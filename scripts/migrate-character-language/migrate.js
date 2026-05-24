#!/usr/bin/env node
/**
 * Backfill `language` on Firestore character documents that lack it.
 *
 * Usage:
 *   npm install
 *   node migrate.js --credentials ./service-account.json --limit 25
 *   node migrate.js --credentials ./service-account.json --apply
 *
 * Env alternative:
 *   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
 *   node migrate.js --limit 25
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import admin from 'firebase-admin';
import { franc } from 'franc';

const PROJECT_ID = 'delta-green-agents';
const COLLECTION = 'characters';
const SUPPORTED_LANGUAGES = new Set(['de', 'en', 'es', 'fr', 'it', 'nl', 'pl', 'pt', 'ru']);
const MIN_TEXT_LENGTH = 25;
const PAGE_SIZE = 200;

const LANGUAGE_LABELS = {
    de: 'Deutsch',
    en: 'English',
    es: 'Español',
    fr: 'Français',
    nl: 'Nederlands',
    pl: 'Polski',
    pt: 'Português',
    ru: 'Русский',
    it: 'Italiano'
};

const ISO3_TO_APP = {
    deu: 'de',
    eng: 'en',
    spa: 'es',
    fra: 'fr',
    nld: 'nl',
    pol: 'pl',
    por: 'pt',
    rus: 'ru',
    ukr: 'ru',
    ita: 'it',
    glg: 'es',
    cat: 'es',
    // Short English bond lists are often misread as Scots / Low German / Scandinavian
    sco: 'en',
    nds: 'en',
    dan: 'en',
    nno: 'en',
    nob: 'en',
    swe: 'en'
};

function parseArgs(argv) {
    const options = {
        apply: false,
        limit: null,
        credentials: null
    };

    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        if (arg === '--apply') {
            options.apply = true;
        } else if (arg === '--dry-run') {
            options.apply = false;
        } else if (arg === '--limit') {
            options.limit = Number(argv[i + 1]);
            i += 1;
        } else if (arg === '--credentials') {
            options.credentials = argv[i + 1];
            i += 1;
        } else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        }
    }

    if (Number.isNaN(options.limit)) {
        throw new Error('--limit must be a number');
    }

    return options;
}

function printHelp() {
    console.log(`\
Backfill missing character.language fields in Firestore.

Options:
  --dry-run              Do not write (default)
  --apply                Write inferred languages to Firestore
  --limit <n>            Process at most n characters missing language
  --credentials <path>   Firebase service account JSON

Examples:
  node migrate.js --credentials ./service-account.json --limit 25
  node migrate.js --credentials ./service-account.json --apply
`);
}

function initFirebase(credentialsPath) {
    if (admin.apps.length > 0) {
        return admin.firestore();
    }

    if (credentialsPath) {
        const absolutePath = resolve(credentialsPath);
        if (!existsSync(absolutePath)) {
            throw new Error(`Credentials file not found: ${absolutePath}`);
        }
        const serviceAccount = JSON.parse(readFileSync(absolutePath, 'utf8'));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: PROJECT_ID
        });
    } else {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: PROJECT_ID
        });
    }

    return admin.firestore();
}

function normalizeText(value) {
    if (typeof value !== 'string') {
        return '';
    }
    return value.replace(/\s+/g, ' ').trim();
}

function extractBondTexts(bonds) {
    if (!Array.isArray(bonds)) {
        return [];
    }

    return bonds
        .map((bond, index) => {
            if (typeof bond === 'string') {
                return normalizeText(bond);
            }
            if (!bond || typeof bond !== 'object') {
                return '';
            }

            return normalizeText(
                bond.description ||
                bond.text ||
                bond.label ||
                bond.name ||
                bond.value ||
                ''
            );
        })
        .filter(Boolean);
}

function extractMotivationTexts(motivations) {
    if (!Array.isArray(motivations)) {
        return [];
    }

    return motivations
        .map((motivation) => normalizeText(typeof motivation === 'string' ? motivation : motivation?.text || ''))
        .filter(Boolean);
}

function collectText(firestoreData) {
    const characterData = firestoreData?.data || {};
    const bondTexts = extractBondTexts(characterData.bonds);
    const motivationTexts = extractMotivationTexts(characterData.motivations);

    const parts = [];

    if (bondTexts.length > 0) {
        parts.push(bondTexts.join(' '));
    }

    if (motivationTexts.length > 0) {
        parts.push(motivationTexts.join(' '));
    }

    return {
        text: parts.join(' ').replace(/\s+/g, ' ').trim(),
        bondCount: bondTexts.length,
        motivationCount: motivationTexts.length
    };
}

function detectLanguage(text) {
    if (text.length < MIN_TEXT_LENGTH) {
        return {
            language: null,
            detectedIso3: null,
            skipCategory: 'too_short',
            reason: `text too short (${text.length} chars, need ${MIN_TEXT_LENGTH})`
        };
    }

    const iso3 = franc(text, { minLength: MIN_TEXT_LENGTH });
    if (!iso3 || iso3 === 'und') {
        return {
            language: null,
            detectedIso3: iso3 || 'und',
            skipCategory: 'undetermined',
            reason: 'language undetermined'
        };
    }

    const mapped = ISO3_TO_APP[iso3];
    if (!mapped || !SUPPORTED_LANGUAGES.has(mapped)) {
        return {
            language: null,
            detectedIso3: iso3,
            skipCategory: 'unsupported',
            reason: `unsupported detected language: ${iso3}`
        };
    }

    return {
        language: mapped,
        detectedIso3: iso3,
        skipCategory: null,
        reason: `detected ${iso3} -> ${mapped}`
    };
}

function incrementCount(map, key) {
    map[key] = (map[key] || 0) + 1;
}

function printLanguageBreakdown(results) {
    const tagged = {};
    const unsupported = {};
    const skipCategories = {};
    const total = results.length;

    results.forEach((item) => {
        if (item.language) {
            incrementCount(tagged, item.language);
            return;
        }

        incrementCount(skipCategories, item.skipCategory || 'unknown');
        if (item.skipCategory === 'unsupported' && item.detectedIso3) {
            incrementCount(unsupported, item.detectedIso3);
        }
    });

    const taggedTotal = Object.values(tagged).reduce((sum, count) => sum + count, 0);
    const sortedTagged = Object.entries(tagged).sort((a, b) => b[1] - a[1]);
    const sortedUnsupported = Object.entries(unsupported).sort((a, b) => b[1] - a[1]);

    console.log('\nLanguage distribution (would be tagged):');
    if (sortedTagged.length === 0) {
        console.log('  (none)');
    } else {
        sortedTagged.forEach(([code, count]) => {
            const label = LANGUAGE_LABELS[code] || code;
            const pct = ((count / total) * 100).toFixed(1);
            const taggedPct = ((count / taggedTotal) * 100).toFixed(1);
            console.log(`  ${code.padEnd(3)} ${label.padEnd(12)} ${String(count).padStart(5)}  (${pct}% of all, ${taggedPct}% of tagged)`);
        });
        console.log(`  ${'TOTAL'.padEnd(16)} ${String(taggedTotal).padStart(5)}`);
    }

    console.log('\nSkipped breakdown:');
    Object.entries(skipCategories)
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, count]) => {
            const pct = ((count / total) * 100).toFixed(1);
            console.log(`  ${category.padEnd(14)} ${String(count).padStart(5)}  (${pct}%)`);
        });

    if (sortedUnsupported.length > 0) {
        console.log('\nDetected but unsupported (ISO 639-3):');
        sortedUnsupported.forEach(([iso3, count]) => {
            const mapped = ISO3_TO_APP[iso3] ? `→ ${ISO3_TO_APP[iso3]}` : '';
            console.log(`  ${iso3.padEnd(6)} ${String(count).padStart(5)}  ${mapped}`);
        });
    }

    console.log(`\nGrand total: ${total} character(s) without language`);
}

async function fetchMissingLanguageDocs(db, limit) {
    const docs = [];
    let lastDoc = null;

    while (true) {
        let query = db.collection(COLLECTION).orderBy(admin.firestore.FieldPath.documentId()).limit(PAGE_SIZE);
        if (lastDoc) {
            query = query.startAfter(lastDoc);
        }

        const snapshot = await query.get();
        if (snapshot.empty) {
            break;
        }

        snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.language && SUPPORTED_LANGUAGES.has(data.language)) {
                return;
            }
            docs.push({
                id: docSnap.id,
                ref: docSnap.ref,
                data
            });
        });

        lastDoc = snapshot.docs[snapshot.docs.length - 1];

        if (limit && docs.length >= limit) {
            return docs.slice(0, limit);
        }

        if (snapshot.size < PAGE_SIZE) {
            break;
        }
    }

    return limit ? docs.slice(0, limit) : docs;
}

function printPreview(results) {
    const tagged = results.filter((item) => item.language);
    const skipped = results.filter((item) => !item.language);

    console.log('\nPreview:');
    tagged.slice(0, 15).forEach((item) => {
        console.log(`  ✓ ${item.id} | ${item.name} | ${item.language} | ${item.reason}`);
        console.log(`    bonds: ${item.bondCount}, motivations: ${item.motivationCount}`);
        console.log(`    ${item.sample}`);
    });

    if (tagged.length > 15) {
        console.log(`  … ${tagged.length - 15} more tagged`);
    }

    skipped.slice(0, 10).forEach((item) => {
        console.log(`  – ${item.id} | ${item.name} | skip | ${item.reason}`);
        console.log(`    bonds: ${item.bondCount}, motivations: ${item.motivationCount}`);
    });

    if (skipped.length > 10) {
        console.log(`  … ${skipped.length - 10} more skipped`);
    }
}

async function applyUpdates(results) {
    const tagged = results.filter((item) => item.language);
    if (tagged.length === 0) {
        console.log('Nothing to write.');
        return;
    }

    let batch = admin.firestore().batch();
    let batchCount = 0;
    let written = 0;

    for (const item of tagged) {
        batch.update(item.ref, {
            language: item.language,
            languageSource: 'inferred',
            languageInferredAt: new Date().toISOString()
        });
        batchCount += 1;
        written += 1;

        if (batchCount === 400) {
            await batch.commit();
            batch = admin.firestore().batch();
            batchCount = 0;
        }
    }

    if (batchCount > 0) {
        await batch.commit();
    }

    console.log(`\nWrote language for ${written} character(s).`);
}

async function main() {
    const options = parseArgs(process.argv.slice(2));
    const db = initFirebase(options.credentials);

    console.log(`Project: ${PROJECT_ID}`);
    console.log(`Mode: ${options.apply ? 'APPLY (writes enabled)' : 'DRY RUN'}`);
    if (options.limit) {
        console.log(`Limit: ${options.limit}`);
    }

    const docs = await fetchMissingLanguageDocs(db, options.limit);
    console.log(`Found ${docs.length} character(s) without language.`);

    const results = docs.map((doc) => {
        const collected = collectText(doc.data);
        const detection = detectLanguage(collected.text);
        const sample = collected.text.length > 120 ? `${collected.text.slice(0, 120)}…` : collected.text;

        return {
            id: doc.id,
            ref: doc.ref,
            name: doc.data.name || 'Unnamed',
            language: detection.language,
            detectedIso3: detection.detectedIso3,
            skipCategory: detection.skipCategory,
            reason: detection.reason,
            bondCount: collected.bondCount,
            motivationCount: collected.motivationCount,
            sample: sample || '(no bond or motivation text)'
        };
    });

    const summary = results.reduce(
        (acc, item) => {
            if (item.language) {
                acc.tagged += 1;
                acc.byLanguage[item.language] = (acc.byLanguage[item.language] || 0) + 1;
            } else {
                acc.skipped += 1;
            }
            return acc;
        },
        { tagged: 0, skipped: 0, byLanguage: {} }
    );

    printPreview(results);
    printLanguageBreakdown(results);

    console.log('\nSummary:');
    console.log(`  Would tag: ${summary.tagged}`);
    console.log(`  Would skip: ${summary.skipped}`);

    if (options.apply) {
        await applyUpdates(results);
    } else {
        console.log('\nDry run only. Re-run with --apply to write changes.');
    }
}

main().catch((error) => {
    console.error('\nMigration failed:', error.message);
    if (error.message.includes('Could not load the default credentials')) {
        console.error('\nProvide credentials via:');
        console.error('  --credentials ./service-account.json');
        console.error('  or GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json');
    }
    process.exit(1);
});
