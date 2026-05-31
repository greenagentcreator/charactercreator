// Shared profession metadata for library filters and uploads

import { PROFESSIONS } from '../config/professions.js?v=08b391a';
import { t } from '../i18n/i18n.js?v=08b391a';

const PROFESSION_KEY_TO_NAME_KEY = new Map();

Object.entries(PROFESSIONS).forEach(([profKey, profData]) => {
    if (profData && !profData.isCustom && profData.nameKey) {
        PROFESSION_KEY_TO_NAME_KEY.set(profKey, profData.nameKey);
    }
});

export const STANDARD_PROFESSION_NAME_KEYS = new Set(PROFESSION_KEY_TO_NAME_KEY.values());

/**
 * Resolve display name, custom flag, and filter key from a stored profession value.
 */
export function resolveProfessionMetadata(professionValue) {
    if (!professionValue) {
        return {
            displayName: 'Unknown',
            isCustom: true,
            filterKey: 'custom'
        };
    }

    if (STANDARD_PROFESSION_NAME_KEYS.has(professionValue)) {
        return {
            displayName: t(professionValue),
            isCustom: false,
            filterKey: professionValue
        };
    }

    if (PROFESSION_KEY_TO_NAME_KEY.has(professionValue)) {
        const nameKey = PROFESSION_KEY_TO_NAME_KEY.get(professionValue);
        return {
            displayName: t(nameKey),
            isCustom: false,
            filterKey: nameKey
        };
    }

    return {
        displayName: professionValue,
        isCustom: true,
        filterKey: 'custom'
    };
}

export function getProfessionFilterKey(professionValue) {
    return resolveProfessionMetadata(professionValue).filterKey;
}

export function getStandardProfessionFilters() {
    return Array.from(STANDARD_PROFESSION_NAME_KEYS)
        .map((nameKey) => ({ key: nameKey, label: t(nameKey), i18nKey: nameKey }))
        .sort((a, b) => a.label.localeCompare(b.label));
}
