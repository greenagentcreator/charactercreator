// Baseline snapshot for resetting editable agent sheets

import { getCharacterById, saveCharacter } from './storage.js?v=27a0927';
import { calculateDerivedAttributes } from '../model/character.js?v=27a0927';

export function captureSheetBaseline(char) {
    const skills = Array.isArray(char.skills)
        ? char.skills.map((skill) => ({
            instanceId: skill.instanceId,
            value: skill.value
        }))
        : [];

    return {
        personalInfo: JSON.parse(JSON.stringify(char.personalInfo || {})),
        stats: JSON.parse(JSON.stringify(char.stats || {})),
        distinguishingFeatures: JSON.parse(JSON.stringify(char.distinguishingFeatures || {})),
        derivedCurrent: JSON.parse(JSON.stringify(char.derivedCurrent || {})),
        bonds: JSON.parse(JSON.stringify(char.bonds || [])),
        motivations: JSON.parse(JSON.stringify(char.motivations || ['', '', '', '', ''])),
        disorder: char.disorder ?? null,
        adaptations: JSON.parse(JSON.stringify(char.adaptations || [])),
        items: JSON.parse(JSON.stringify(char.items || [])),
        notes: typeof char.notes === 'string' ? char.notes : '',
        skills,
        skillFailMarks: []
    };
}

export function applySheetBaseline(char, baseline) {
    if (!baseline) {
        return false;
    }

    char.personalInfo = JSON.parse(JSON.stringify(baseline.personalInfo || {}));
    char.stats = JSON.parse(JSON.stringify(baseline.stats || {}));
    char.distinguishingFeatures = JSON.parse(JSON.stringify(baseline.distinguishingFeatures || {}));
    char.bonds = JSON.parse(JSON.stringify(baseline.bonds || []));
    char.motivations = JSON.parse(JSON.stringify(baseline.motivations || ['', '', '', '', '']));
    char.disorder = baseline.disorder ?? null;
    char.adaptations = JSON.parse(JSON.stringify(baseline.adaptations || []));
    char.items = JSON.parse(JSON.stringify(baseline.items || []));
    char.notes = typeof baseline.notes === 'string' ? baseline.notes : '';
    char.skillFailMarks = JSON.parse(JSON.stringify(baseline.skillFailMarks || []));

    if (Array.isArray(baseline.skills) && Array.isArray(char.skills)) {
        baseline.skills.forEach(({ instanceId, value }) => {
            const instance = char.skills.find((skill) => skill.instanceId === instanceId);
            if (instance && value != null) {
                instance.value = value;
            }
        });
    }

    calculateDerivedAttributes();
    char.derivedCurrent = JSON.parse(JSON.stringify(baseline.derivedCurrent || {}));
    return true;
}

/** Set baseline once for legacy saves that have none yet. */
export function ensureSheetBaseline(char) {
    if (char.sheetBaseline) {
        return false;
    }
    char.sheetBaseline = captureSheetBaseline(char);
    return true;
}

export function resetLocalSheetToBaseline(characterId) {
    if (!characterId) {
        return { ok: false, error: 'missing_id' };
    }

    const stored = getCharacterById(characterId);
    if (!stored?.data) {
        return { ok: false, error: 'not_found' };
    }

    if (!stored.data.sheetBaseline) {
        return { ok: false, error: 'no_baseline' };
    }

    const data = JSON.parse(JSON.stringify(stored.data));
    applySheetBaseline(data, data.sheetBaseline);

    const characterName = data.personalInfo?.name || stored.name || 'Unnamed Agent';

    try {
        saveCharacter({
            ...stored,
            name: characterName,
            data
        });
        return { ok: true, name: characterName, data };
    } catch (error) {
        console.error('Error resetting sheet to baseline:', error);
        return { ok: false, error: 'reset_failed' };
    }
}
