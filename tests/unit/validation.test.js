import { describe, it, expect } from 'vitest';
import { validateImportedCharacter } from '../../js/utils/validation.js';

const validStats = { STR: 12, CON: 12, DEX: 12, INT: 12, POW: 12, CHA: 12 };

describe('validateImportedCharacter', () => {
    it('accepts a minimally valid character', () => {
        const result = validateImportedCharacter({ stats: validStats, skills: [] });
        expect(result).toEqual({ valid: true, error: null });
    });

    it('rejects null / non-object input', () => {
        expect(validateImportedCharacter(null).valid).toBe(false);
        expect(validateImportedCharacter('nope').valid).toBe(false);
    });

    it('rejects a missing stats field', () => {
        expect(validateImportedCharacter({ skills: [] }).valid).toBe(false);
    });

    it('rejects a missing skills field', () => {
        expect(validateImportedCharacter({ stats: validStats }).valid).toBe(false);
    });

    it('rejects a non-numeric stat value', () => {
        const bad = { stats: { ...validStats, STR: '12' }, skills: [] };
        const result = validateImportedCharacter(bad);
        expect(result.valid).toBe(false);
        expect(result.error).toMatch(/STR/);
    });

    it('rejects skills that are not an array', () => {
        expect(validateImportedCharacter({ stats: validStats, skills: {} }).valid).toBe(false);
    });
});
