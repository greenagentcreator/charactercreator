import { describe, it, expect } from 'vitest';
import { ALL_SKILLS } from '../../js/config/skills.js';
import { en } from '../../js/i18n/en.js';
import { de } from '../../js/i18n/de.js';
import { es } from '../../js/i18n/es.js';
import { fr } from '../../js/i18n/fr.js';
import { ru } from '../../js/i18n/ru.js';

const LOCALES = { en, de, es, fr, ru };
const TYPED_SKILLS = Object.entries(ALL_SKILLS).filter(([, def]) => def.type === true);

describe('typed skills carry a specialization placeholder', () => {
    it('includes the expected set of typed skills', () => {
        const keys = TYPED_SKILLS.map(([key]) => key).sort();
        expect(keys).toEqual(
            ['art', 'craft', 'foreign_language', 'military_science', 'pilot', 'science'].sort()
        );
    });

    it('every typed skill defines a placeholderKey', () => {
        for (const [key, def] of TYPED_SKILLS) {
            expect(def.placeholderKey, `skill "${key}" should have a placeholderKey`).toBeTruthy();
        }
    });

    it('no non-typed skill defines a placeholderKey (they share the generic one)', () => {
        for (const [key, def] of Object.entries(ALL_SKILLS)) {
            if (!def.type) {
                expect(def.placeholderKey, `skill "${key}" should not have a placeholderKey`).toBeUndefined();
            }
        }
    });
});

describe('placeholder i18n keys resolve in every locale', () => {
    it('defines the generic fallback in all locales', () => {
        for (const [lang, dict] of Object.entries(LOCALES)) {
            expect(dict.specify_type_placeholder, `${lang} missing generic placeholder`).toBeTruthy();
        }
    });

    it('defines every typed-skill placeholderKey in all locales', () => {
        for (const [, def] of TYPED_SKILLS) {
            for (const [lang, dict] of Object.entries(LOCALES)) {
                expect(
                    dict[def.placeholderKey],
                    `${lang} missing "${def.placeholderKey}"`
                ).toBeTruthy();
            }
        }
    });

    it('Foreign Language suggests languages, not a generic mix', () => {
        // Regression guard for the original "Physics, French, Acting" complaint.
        expect(en.specify_type_placeholder_foreign_language).toMatch(/Spanish|Arabic|French/);
        expect(en.specify_type_placeholder_foreign_language).not.toMatch(/Physics|Acting/);
    });
});
