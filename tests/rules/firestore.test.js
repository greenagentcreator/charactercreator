// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
    initializeTestEnvironment,
    assertSucceeds,
    assertFails
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Requires the Firestore emulator — run via `npm run test:rules`
// (which wraps this in `firebase emulators:exec`).

const here = dirname(fileURLToPath(import.meta.url));
const rules = readFileSync(resolve(here, '../../firestore.rules'), 'utf8');

let testEnv;

function validCharacter(overrides = {}) {
    return {
        name: 'Agent Smith',
        nameLower: 'agent smith',
        profession: 'Anthropologist',
        language: 'en',
        previewStats: { STR: 12, CON: 12 },
        bondCount: 2,
        data: { stats: { STR: 12 } },
        createdDate: '2026-06-20T00:00:00.000Z',
        moderationStatus: 'approved',
        uploadedAt: '2026-06-20T00:00:00.000Z',
        ...overrides
    };
}

beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
        projectId: 'demo-dg',
        firestore: { rules }
    });
});

afterAll(async () => {
    await testEnv?.cleanup();
});

beforeEach(async () => {
    await testEnv.clearFirestore();
});

function db() {
    // Unauthenticated context — the live app writes without auth today.
    return testEnv.unauthenticatedContext().firestore();
}

async function seedApproved(id, data = validCharacter()) {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), 'characters', id), data);
    });
}

describe('characters: create', () => {
    it('allows a well-formed approved character', async () => {
        await assertSucceeds(setDoc(doc(db(), 'characters', 'c1'), validCharacter()));
    });

    it('denies a payload with an unknown extra key', async () => {
        await assertFails(setDoc(doc(db(), 'characters', 'c2'), validCharacter({ evil: 'x' })));
    });

    it('denies a non-approved moderationStatus on create', async () => {
        await assertFails(
            setDoc(doc(db(), 'characters', 'c3'), validCharacter({ moderationStatus: 'pending' }))
        );
    });

    // --- M4 regression guards: previewStats / bondCount are rendered unescaped ---
    it('denies previewStats containing a non-number value (markup injection)', async () => {
        const evil = validCharacter({
            previewStats: { STR: '<img src=x onerror=alert(1)>' }
        });
        await assertFails(setDoc(doc(db(), 'characters', 'c4'), evil));
    });

    it('denies previewStats with an unexpected key', async () => {
        await assertFails(
            setDoc(doc(db(), 'characters', 'c5'), validCharacter({ previewStats: { LUCK: 5 } }))
        );
    });

    it('denies a non-integer bondCount', async () => {
        await assertFails(
            setDoc(doc(db(), 'characters', 'c6'), validCharacter({ bondCount: 'lots' }))
        );
    });

    it('denies an out-of-range bondCount', async () => {
        await assertFails(
            setDoc(doc(db(), 'characters', 'c7'), validCharacter({ bondCount: 100000 }))
        );
    });

    it('allows a null previewStats (empty preview)', async () => {
        await assertSucceeds(
            setDoc(doc(db(), 'characters', 'c8'), validCharacter({ previewStats: null }))
        );
    });
});

describe('characters: read', () => {
    it('allows reading an approved character', async () => {
        await seedApproved('r1');
        await assertSucceeds(getDoc(doc(db(), 'characters', 'r1')));
    });

    it('denies reading a pending character', async () => {
        await seedApproved('r2', validCharacter({ moderationStatus: 'pending' }));
        await assertFails(getDoc(doc(db(), 'characters', 'r2')));
    });
});

describe('reports: create', () => {
    it('allows a well-formed report', async () => {
        await assertSucceeds(
            setDoc(doc(db(), 'reports', 'rep1'), {
                characterId: 'c1',
                reason: 'spam',
                reportedAt: '2026-06-20T00:00:00.000Z',
                status: 'pending'
            })
        );
    });
});

// --- Known-open risks documented as future work (H1/H2 in the security audit) ---
describe('hardening backlog (currently EXPECTED to be open — see audit H1/H2)', () => {
    // H1: any client can flip a character to `pending`, hiding the whole library.
    // When H1 is fixed (remove client moderationStatus writes), flip this to assertFails.
    it.todo('H1: should DENY an anonymous client flipping moderationStatus to pending');

    // H2: creates are unauthenticated and unbounded.
    // When H2 is fixed (require auth/App Check), add an assertFails for an
    // unauthenticated create here.
    it.todo('H2: should require authentication / App Check to create a character');
});
