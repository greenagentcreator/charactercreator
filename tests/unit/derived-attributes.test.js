import { describe, it, expect, beforeEach } from 'vitest';
import {
    resetCharacter,
    getCharacter,
    setCharacter,
    calculateDerivedAttributes
} from '../../js/model/character.js';

function buildCharacterWithStats(overrides = {}) {
    resetCharacter();
    const character = getCharacter();
    character.stats = { STR: 12, CON: 14, DEX: 10, INT: 10, POW: 13, CHA: 10 };
    Object.assign(character, overrides);
    setCharacter(character);
    return character;
}

describe('calculateDerivedAttributes', () => {
    beforeEach(() => resetCharacter());

    it('computes HP/WP/SAN/BP from the core stats', () => {
        buildCharacterWithStats();
        calculateDerivedAttributes();
        const { HP, WP, SAN, BP } = getCharacter().derivedAttributes;
        expect(HP).toBe(13); // ceil((STR 12 + CON 14) / 2)
        expect(WP).toBe(13); // POW
        expect(SAN).toBe(65); // POW * 5
        expect(BP).toBe(52); // SAN - WP
    });

    it('zeroes everything when core stats are unset', () => {
        resetCharacter(); // stats default to 0
        calculateDerivedAttributes();
        expect(getCharacter().derivedAttributes).toEqual({ HP: 0, WP: 0, SAN: 0, BP: 0 });
    });

    it('applies the -5 SAN penalty for an extreme-violence background', () => {
        buildCharacterWithStats({ traumaticBackground: 'extreme_violence' });
        calculateDerivedAttributes();
        expect(getCharacter().derivedAttributes.SAN).toBe(60); // 65 - 5
    });
});
