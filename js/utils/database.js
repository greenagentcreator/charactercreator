// Firebase Firestore database utilities

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, startAfter, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';
import { firebaseConfig, COLLECTIONS, MODERATION_STATUS } from '../config/database.js';
// Content moderation is currently disabled - can be enabled later if needed
// import { validateCharacterContent } from './content-moderation.js';

// Initialize Firebase
let app = null;
let db = null;

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
    
    // Content moderation is currently disabled
    // Uncomment the following lines to enable content moderation:
    // const contentValidation = validateCharacterContent(characterData.data || characterData);
    // if (!contentValidation.valid) {
    //     throw new Error('Content validation failed: ' + contentValidation.issues.join(', '));
    // }
    
    // Prepare character document
    const characterName = characterData.name || characterData.data?.personalInfo?.name || 'Unnamed Agent';
    const profession = characterData.profession || 'Unknown';
    
    const characterDoc = {
        name: characterName,
        profession: profession,
        data: characterData.data || characterData,
        createdDate: characterData.createdDate || new Date().toISOString(),
        moderationStatus: MODERATION_STATUS.APPROVED, // Auto-approve uploaded characters
        uploadedAt: new Date().toISOString()
    };
    
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.CHARACTERS), characterDoc);
        return docRef.id;
    } catch (error) {
        console.error('Error uploading character:', error);
        throw error;
    }
}

/**
 * Get all approved characters from database
 * @param {number} maxResults - Maximum number of results (default: 50)
 * @param {DocumentSnapshot} lastDoc - Last document from previous query (for pagination)
 * @returns {Promise<{characters: Array, lastDoc: DocumentSnapshot|null, hasMore: boolean}>} Object with characters array, last document, and hasMore flag
 */
export async function getPublicCharacters(maxResults = 50, lastDoc = null) {
    if (!ensureInitialized()) {
        return { characters: [], lastDoc: null, hasMore: false };
    }
    
    try {
        let q = query(
            collection(db, COLLECTIONS.CHARACTERS),
            where('moderationStatus', '==', MODERATION_STATUS.APPROVED),
            orderBy('uploadedAt', 'desc'),
            limit(maxResults)
        );
        
        // Add pagination if lastDoc is provided
        if (lastDoc) {
            q = query(
                collection(db, COLLECTIONS.CHARACTERS),
                where('moderationStatus', '==', MODERATION_STATUS.APPROVED),
                orderBy('uploadedAt', 'desc'),
                startAfter(lastDoc),
                limit(maxResults)
            );
        }
        
        const querySnapshot = await getDocs(q);
        const characters = [];
        let newLastDoc = null;
        
        querySnapshot.forEach((doc) => {
            characters.push({
                id: doc.id,
                ...doc.data()
            });
            newLastDoc = doc; // Keep track of the last document
        });
        
        // Check if there are more results
        const hasMore = querySnapshot.size === maxResults;
        
        return {
            characters: characters,
            lastDoc: newLastDoc,
            hasMore: hasMore
        };
    } catch (error) {
        console.error('Error fetching public characters:', error);
        
        // Check if it's a CORS error (common when testing locally)
        if (error.code === 'failed-precondition' || error.message.includes('CORS') || error.message.includes('access control')) {
            console.warn('CORS error detected. Make sure you are:');
            console.warn('1. Running on an authorized domain (localhost or your GitHub Pages domain)');
            console.warn('2. Not opening the HTML file directly (use a local server instead)');
            console.warn('3. Your domain is added to Firebase Authorized Domains');
        }
        
        return { characters: [], lastDoc: null, hasMore: false };
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
    
    try {
        const reportDoc = {
            characterId: characterId,
            reason: reason,
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
    const { importCharacter } = await import('./storage.js');
    
    const characterToImport = {
        name: characterDoc.name,
        profession: characterDoc.profession,
        data: characterDoc.data
    };
    
    return importCharacter(characterToImport);
}

