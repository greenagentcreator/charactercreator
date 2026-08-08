import { describe, it, expect } from 'vitest';
import {
    encodeCharacterForUrl,
    decodeCharacterFromUrl,
    normalizeSharedCharacterPayload
} from '../../js/utils/sharing.js';

// Note: LZString is a CDN global that is undefined in tests, so these exercise
// the plain-Base64 fallback path — which is what older shared links use anyway.

const sampleCharacter = {
    professionKey: 'anthropologist_archaeologist_historian',
    stats: { STR: 12, CON: 12, DEX: 12, INT: 12, POW: 12, CHA: 12 },
    skills: [{ key: 'foreign_language', typeName: 'French', value: 50 }],
    personalInfo: { name: 'Test Agent' }
};

describe('encode/decode round trip', () => {
    it('decodes back to the original object', () => {
        const encoded = encodeCharacterForUrl(sampleCharacter);
        expect(typeof encoded).toBe('string');
        expect(decodeCharacterFromUrl(encoded)).toEqual(sampleCharacter);
    });

    it('preserves unicode in character fields', () => {
        const char = { ...sampleCharacter, personalInfo: { name: 'Ñoël 间諜 — Agent' } };
        expect(decodeCharacterFromUrl(encodeCharacterForUrl(char))).toEqual(char);
    });
});

describe('decodeCharacterFromUrl is robust to malicious/garbage input', () => {
    it('returns null for non-base64 junk instead of throwing', () => {
        expect(decodeCharacterFromUrl('not%%%base64')).toBeNull();
    });

    it('returns null for valid base64 that is not JSON', () => {
        const notJson = Buffer.from('hello world', 'utf8').toString('base64');
        expect(decodeCharacterFromUrl(notJson)).toBeNull();
    });
});

describe('normalizeSharedCharacterPayload', () => {
    it('unwraps a storage wrapper ({ data: <model> })', () => {
        const wrapped = { data: sampleCharacter };
        expect(normalizeSharedCharacterPayload(wrapped)).toEqual(sampleCharacter);
    });

    it('accepts a raw model with stats/skills/professionKey', () => {
        expect(normalizeSharedCharacterPayload(sampleCharacter)).toEqual(sampleCharacter);
    });

    it('rejects values that are not character-shaped', () => {
        expect(normalizeSharedCharacterPayload(null)).toBeNull();
        expect(normalizeSharedCharacterPayload([1, 2, 3])).toBeNull();
        expect(normalizeSharedCharacterPayload({ foo: 'bar' })).toBeNull();
        expect(normalizeSharedCharacterPayload('a string')).toBeNull();
    });
});
