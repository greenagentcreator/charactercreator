// Firebase Firestore database utilities

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, getDoc, query, where, orderBy, limit, startAfter, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';
import { firebaseConfig, COLLECTIONS, MODERATION_STATUS } from '../config/database.js?v=c3eb2a8';
import { getProfessionFilterKey } from './profession-filter.js?v=c3eb2a8';
import { SUPPORTED_LIBRARY_LANGUAGES } from '../i18n/translations.js?v=c3eb2a8';
import {
    sanitizeCharacterContent,
    validateCharacterContent,
    validateCharacterSchema
} from './content-moderation.js?v=c3eb2a8';
import { checkRateLimit, recordUpload } from './rate-limiter.js?v=c3eb2a8';
import { checkForDuplicate, recordCharacterFingerprint } from './duplicate-detector.js?v=c3eb2a8';

// Initialize Firebase
let app = null;
let db = null;

const MAX_CHARACTER_BYTES = 750 * 1024; // keep well below Firestore 1MB limit
const LIBRARY_LANGUAGE_CODES = new Set(SUPPORTED_LIBRARY_LANGUAGES);
const FALLBACK_SCAN_BATCH = 100;
const MAX_FALLBACK_FILL_ITERATIONS = 15;
const STAT_PREVIEW_KEYS = ['STR', 'CON', 'DEX', 'INT', 'POW', 'CHA'];

function normalizeLibraryLanguage(value) {
    const base = String(value || 'en').split('-')[0].toLowerCase();
    return LIBRARY_LANGUAGE_CODES.has(base) ? base : 'en';
}

function matchesLibraryFilters(character, professionFilter, languageFilter) {
    if (professionFilter && professionFilter !== 'all') {
        const filterKey = character.professionFilterKey || getProfessionFilterKey(character.profession);
        if (filterKey !== professionFilter) {
            return false;
        }
    }

    if (languageFilter && languageFilter !== 'all') {
        if (character.language !== languageFilter) {
            return false;
        }
    }

    return true;
}

function buildLibraryPreviewFields(characterData) {
    const stats = characterData?.stats;
    const previewStats = {};

    if (stats && typeof stats === 'object') {
        STAT_PREVIEW_KEYS.forEach((key) => {
            if (stats[key] != null) {
                previewStats[key] = stats[key];
            }
        });
    }

    return {
        previewStats: Object.keys(previewStats).length > 0 ? previewStats : null,
        bondCount: Array.isArray(characterData?.bonds) ? characterData.bonds.length : 0
    };
}

function buildPreviewStatsFromData(characterData) {
    return buildLibraryPreviewFields(characterData).previewStats;
}

function toPublicListCharacter(id, data) {
    const previewStats = data.previewStats ?? buildPreviewStatsFromData(data.data);

    return {
        id,
        name: data.name,
        profession: data.profession,
        professionFilterKey: data.professionFilterKey,
        language: data.language,
        uploadedAt: data.uploadedAt,
        createdDate: data.createdDate,
        previewStats,
        bondCount: data.bondCount ?? (Array.isArray(data.data?.bonds) ? data.data.bonds.length : 0)
    };
}

async function resolveLibraryPaginationCursor(lastDoc, lastDocId) {
    if (lastDoc) {
        return lastDoc;
    }

    if (!lastDocId || !ensureInitialized()) {
        return null;
    }

    try {
        const docSnap = await getDoc(doc(db, COLLECTIONS.CHARACTERS, lastDocId));
        return docSnap.exists() ? docSnap : null;
    } catch (error) {
        console.warn('Could not resolve library pagination cursor:', error);
        return null;
    }
}

function buildPublicCharactersResult(characters, lastDoc, hasMore) {
    return {
        characters,
        lastDoc,
        lastDocId: lastDoc?.id ?? null,
        hasMore
    };
}

function sanitizeShortText(value, maxLength = 120) {
    if (!value) {
        return '';
    }
    const text = String(value)
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/[\u0000-\u001F\u007F]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return text.slice(0, maxLength);
}

function estimateByteSize(payload) {
    const encoder = new TextEncoder();
    return encoder.encode(JSON.stringify(payload)).length;
}

export function initFirebase() {
    try {
        if (!app) {
            app = initializeApp(firebaseConfig);
            db = getFirestore(app);
        }
        return true;
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        return false;
    }
}

// Check if Firebase is initialized
function ensureInitialized() {
    if (!db) {
        initFirebase();
    }
    return db !== null;
}

/**
 * Upload character to database
 * @param {Object} characterData - Character data to upload
 * @returns {Promise<string>} Document ID
 */
export async function uploadCharacter(characterData) {
    if (!ensureInitialized()) {
        throw new Error('Firebase not initialized');
    }

    const submittedData = characterData?.data || characterData || {};
    const sanitizedData = sanitizeCharacterContent(submittedData);

    // Check rate limit
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
        throw new Error('Rate limit exceeded. Please wait before uploading again.');
    }

    // Check for duplicates
    const duplicateCheck = checkForDuplicate(sanitizedData);
    if (duplicateCheck.isDuplicate) {
        throw new Error('Duplicate character detected. This character was recently uploaded.');
    }

    const schemaValidation = validateCharacterSchema(sanitizedData);
    if (!schemaValidation.valid) {
        throw new Error('Schema validation failed: ' + schemaValidation.issues.join(', '));
    }

    const contentValidation = validateCharacterContent(sanitizedData);
    if (!contentValidation.valid) {
        throw new Error('Content validation failed: ' + contentValidation.issues.join(', '));
    }

    const payloadSize = estimateByteSize(sanitizedData);
    if (payloadSize > MAX_CHARACTER_BYTES) {
        throw new Error('Character data is too large to upload.');
    }

    // Prepare character document
    const characterName =
        sanitizeShortText(
            characterData.name ||
                sanitizedData.name ||
                sanitizedData.personalInfo?.name ||
                'Unnamed Agent',
            80
        ) || 'Unnamed Agent';

    const profession =
        sanitizeShortText(characterData.profession || sanitizedData.profession || 'Unknown', 80) ||
        'Unknown';

    const professionFilterKey = getProfessionFilterKey(profession);
    const nameLower = characterName.toLowerCase();
    const language = normalizeLibraryLanguage(characterData.language);
    const { previewStats, bondCount } = buildLibraryPreviewFields(sanitizedData);

    const characterDoc = {
        name: characterName,
        nameLower,
        profession: profession,
        professionFilterKey,
        language,
        previewStats,
        bondCount,
        data: sanitizedData,
        createdDate: characterData.createdDate || new Date().toISOString(),
        moderationStatus: MODERATION_STATUS.APPROVED, // Auto-approve uploaded characters
        uploadedAt: new Date().toISOString()
    };
    
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.CHARACTERS), characterDoc);
        
        // Record successful upload for rate limiting and duplicate detection
        recordUpload();
        recordCharacterFingerprint(sanitizedData);
        
        return docRef.id;
    } catch (error) {
        console.error('Error uploading character:', error);
        throw error;
    }
}

/**
 * Fetch a single approved public character by document ID.
 * @param {string} id - Firestore document ID
 * @returns {Promise<Object|null>}
 */
export async function getPublicCharacterById(id) {
    if (!ensureInitialized() || !id) {
        return null;
    }

    try {
        const docSnap = await getDoc(doc(db, COLLECTIONS.CHARACTERS, id));
        if (!docSnap.exists()) {
            return null;
        }

        const data = docSnap.data();
        if (data.moderationStatus !== MODERATION_STATUS.APPROVED) {
            return null;
        }

        return {
            id: docSnap.id,
            ...data
        };
    } catch (error) {
        console.error('Error fetching public character by ID:', error);
        return null;
    }
}

/**
 * Get approved characters from database
 * @param {number} maxResults - Maximum number of results (default: 50)
 * @param {DocumentSnapshot} lastDoc - Last document from previous query (for pagination)
 * @param {string|null} professionFilter - 'all', 'custom', or a profession nameKey
 * @param {string|null} languageFilter - 'all' or a supported language code (de, en, es, fr, it, nl, pl, pt, ru)
 * @param {string|null} lastDocId - Optional document ID when resuming without a snapshot
 * @returns {Promise<{characters: Array, lastDoc: DocumentSnapshot|null, lastDocId: string|null, hasMore: boolean}>}
 */
export async function getPublicCharacters(
    maxResults = 50,
    lastDoc = null,
    professionFilter = 'all',
    languageFilter = 'all',
    lastDocId = null
) {
    if (!ensureInitialized()) {
        return buildPublicCharactersResult([], null, false);
    }

    const cursor = await resolveLibraryPaginationCursor(lastDoc, lastDocId);
    const indexedResult = await queryPublicCharacters(maxResults, cursor, professionFilter, languageFilter);
    if (indexedResult !== null) {
        return indexedResult;
    }

    const usesFilters =
        (professionFilter && professionFilter !== 'all') ||
        (languageFilter && languageFilter !== 'all');

    if (!usesFilters) {
        return buildPublicCharactersResult([], null, false);
    }

    const accumulated = [];
    let scanCursor = cursor;
    let scanHasMore = true;
    let iterations = 0;

    while (
        accumulated.length < maxResults &&
        scanHasMore &&
        iterations < MAX_FALLBACK_FILL_ITERATIONS
    ) {
        const batch = await queryPublicCharacters(FALLBACK_SCAN_BATCH, scanCursor, 'all', 'all');
        if (!batch) {
            break;
        }

        const matchingCharacters = batch.characters.filter((character) =>
            matchesLibraryFilters(character, professionFilter, languageFilter)
        );
        accumulated.push(...matchingCharacters);

        scanCursor = batch.lastDoc;
        scanHasMore = batch.hasMore;
        iterations += 1;

        if (batch.characters.length === 0) {
            scanHasMore = false;
            break;
        }
    }

    const trimmedCharacters = accumulated.slice(0, maxResults);
    const hasMoreResults = scanHasMore || accumulated.length > maxResults;

    return buildPublicCharactersResult(trimmedCharacters, scanCursor, hasMoreResults);
}

async function queryPublicCharacters(maxResults, lastDoc, professionFilter, languageFilter) {
    try {
        const constraints = [
            where('moderationStatus', '==', MODERATION_STATUS.APPROVED)
        ];

        if (professionFilter && professionFilter !== 'all') {
            constraints.push(where('professionFilterKey', '==', professionFilter));
        }

        if (languageFilter && languageFilter !== 'all') {
            constraints.push(where('language', '==', languageFilter));
        }

        constraints.push(orderBy('uploadedAt', 'desc'));

        if (lastDoc) {
            constraints.push(startAfter(lastDoc));
        }

        constraints.push(limit(maxResults));

        const q = query(collection(db, COLLECTIONS.CHARACTERS), ...constraints);
        
        const querySnapshot = await getDocs(q);
        const characters = [];
        let newLastDoc = null;
        
        querySnapshot.forEach((docSnap) => {
            characters.push(toPublicListCharacter(docSnap.id, docSnap.data()));
            newLastDoc = docSnap;
        });

        const hasMore = querySnapshot.size === maxResults;

        return buildPublicCharactersResult(characters, newLastDoc, hasMore);
    } catch (error) {
        console.error('Error fetching public characters:', error);

        if (error.code === 'failed-precondition' || error.message.includes('index')) {
            console.warn('Firestore index may be missing for library filter queries.');
        }

        if (error.code === 'failed-precondition' || error.message.includes('CORS') || error.message.includes('access control')) {
            console.warn('CORS error detected. Make sure you are:');
            console.warn('1. Running on an authorized domain (localhost or your GitHub Pages domain)');
            console.warn('2. Not opening the HTML file directly (use a local server instead)');
            console.warn('3. Your domain is added to Firebase Authorized Domains');
        }

        return null;
    }
}

/**
 * Report a character for inappropriate content
 * @param {string} characterId - Character document ID
 * @param {string} reason - Reason for reporting
 * @returns {Promise<boolean>} Success status
 */
export async function reportCharacter(characterId, reason) {
    if (!ensureInitialized()) {
        return false;
    }

    const safeReason = sanitizeShortText(reason, 360);
    if (!safeReason || safeReason.length < 3) {
        throw new Error('Report reason must contain at least 3 readable characters.');
    }

    try {
        const reportDoc = {
            characterId: characterId,
            reason: safeReason,
            reportedAt: new Date().toISOString(),
            status: 'pending'
        };
        
        await addDoc(collection(db, COLLECTIONS.REPORTS), reportDoc);
        
        // Also set character to pending for review (this requires update permission)
        try {
            const characterRef = doc(db, COLLECTIONS.CHARACTERS, characterId);
            await updateDoc(characterRef, {
                moderationStatus: MODERATION_STATUS.PENDING
            });
        } catch (updateError) {
            // If update fails (due to security rules), that's okay - the report was still created
            console.warn('Could not set character to pending (may require admin rights):', updateError);
        }
        
        return true;
    } catch (error) {
        console.error('Error reporting character:', error);
        return false;
    }
}

/**
 * Import character from database to localStorage
 * @param {Object} characterDoc - Character document from database
 * @returns {Promise<string>} Local storage character ID
 */
export async function importCharacterFromDatabase(characterDoc) {
    const { importCharacter } = await import('./storage.js?v=c3eb2a8');
    
    const characterToImport = {
        name: characterDoc.name,
        profession: characterDoc.profession,
        data: characterDoc.data
    };
    
    return importCharacter(characterToImport);
}

