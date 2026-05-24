// Character model and related functions for Delta Green Character Creator

import { ALL_SKILLS } from '../config/skills.js';
import { STAT_KEYS } from '../config/constants.js';

// Character data structure
let character = {};

// Generate a unique instance ID for skill instances
export function generateInstanceId(baseKey, typeName = null) {
    const typePart = typeName ? typeName.toLowerCase().replace(/\s+/g, '_') : 'generic';
    const randomPart = Math.random().toString(36).substring(2, 7);
    const timePart = (Date.now() % 100000).toString(36);
    return `${baseKey}_${typePart}_${timePart}${randomPart}`;
}

// Initialize character with default values
export function resetCharacter() {
    character = {
        professionKey: null,
        customProfessionName: "",
        isCustomProfession: false,
        customProfessionBonds: 3,
        customProfessionSkillPointBudget: 400,
        customProfessionSelectedSkills: [],
        customProfessionSetupStage: 'bonds',
        skillBoostsUsed: 0,

        orSkillChoices: {},
        profChoiceSkillSelections: {},

        skills: [],

        statGenerationMethod: 'array',
        statArrayChoice: null,
        rolledStatValues: [],
        statAssignments: {},
        stats: { STR: 0, CON: 0, DEX: 0, INT: 0, POW: 0, CHA: 0 },
        distinguishingFeatures: {},
        derivedAttributes: { HP: 0, WP: 0, SAN: 0, BP: 0 },
        derivedCurrent: {},
        bonds: [],
        motivations: ["", "", "", "", ""],
        personalInfo: {},
        traumaticBackground: null,
        traumaticBackgroundEffects: {},
        basePOW: null,
        adaptations: [],
        disorder: null,
        skillFailMarks: [],
        items: [],
        notes: '',
        id: null,
        createdDate: null
    };
    initializeCharacterSkills();
}

// Initialize all skills with their base values
export function initializeCharacterSkills() {
    character.skills = [];

    for (const skillKey in ALL_SKILLS) {
        if (ALL_SKILLS.hasOwnProperty(skillKey)) {
            const skillDef = ALL_SKILLS[skillKey];
            const newInstance = {
                instanceId: generateInstanceId(skillKey, null),
                key: skillKey,
                typeName: skillDef.type ? "" : null,
                value: skillDef.base,
                baseValueFromProfession: 0,
                increases: 0,
                isProfessional: false,
                isChoiceSkill: false,
                slotId: null
            };
            character.skills.push(newInstance);
        }
    }
    character.skillBoostsUsed = 0;
    console.log("Character skills initialized and skillBoostsUsed reset to 0.");
}

// Copy array/roll assignments into character.stats when stats were lost (e.g. after re-render)
export function syncStatsFromAssignments() {
    if (!character.stats) {
        character.stats = { STR: 0, CON: 0, DEX: 0, INT: 0, POW: 0, CHA: 0 };
    }
    if (character.statGenerationMethod !== 'array' && character.statGenerationMethod !== 'roll') {
        return;
    }
    const assignments = character.statAssignments;
    if (!assignments || typeof assignments !== 'object') {
        return;
    }

    STAT_KEYS.forEach(key => {
        const assigned = assignments[key];
        if (assigned === null || assigned === undefined) {
            return;
        }
        // Captivity intentionally lowers POW below the assigned value
        if (key === 'POW' && character.traumaticBackground === 'captivity' && character.basePOW != null) {
            return;
        }
        const current = character.stats[key] || 0;
        if (current === 0) {
            character.stats[key] = assigned;
        }
    });
}

function getEffectiveStatValue(statKey) {
    const stats = character.stats || {};
    const statValue = stats[statKey];
    if (statValue != null && statValue > 0) {
        return statValue;
    }
    const assigned = character.statAssignments?.[statKey];
    if (assigned != null && assigned > 0) {
        return assigned;
    }
    return statValue || 0;
}

// Calculate derived attributes based on primary statistics
export function calculateDerivedAttributes() {
    syncStatsFromAssignments();

    const str = getEffectiveStatValue('STR');
    const con = getEffectiveStatValue('CON');
    const pow = getEffectiveStatValue('POW');

    if (str < 1 || con < 1 || pow < 1) {
        character.derivedAttributes = { HP: 0, WP: 0, SAN: 0, BP: 0 };
        syncDerivedCurrentDefaults(character);
        return;
    }

    const HP = Math.ceil((str + con) / 2);
    const WP = character.stats.POW > 0 ? character.stats.POW : pow;

    // Captivity lowers POW for checks but SAN max uses the original POW (stored in basePOW)
    const powForSan = (character.traumaticBackground === 'captivity' && character.basePOW != null)
        ? character.basePOW
        : pow;

    let SAN = powForSan * 5;
    const bg = character.traumaticBackground;

    if (bg === 'extreme_violence' || bg === 'captivity' || bg === 'hard_experience') {
        SAN = Math.max(0, SAN - 5);
    } else if (bg === 'things_man_was_not_meant_to_know') {
        SAN = Math.max(0, SAN - WP);
    }

    const BP = Math.max(0, SAN - WP);

    character.derivedAttributes = {
        HP: HP,
        WP: WP,
        SAN: SAN,
        BP: BP
    };

    syncDerivedCurrentDefaults(character);
}

const DERIVED_CURRENT_KEYS = ['HP', 'WP', 'SAN', 'BP'];

/** Fill missing derived "current" values with maximums (new chars / legacy saves). */
export function syncDerivedCurrentDefaults(char = character) {
    if (!char.derivedCurrent || typeof char.derivedCurrent !== 'object') {
        char.derivedCurrent = {};
    }
    const derived = char.derivedAttributes;
    if (!derived) {
        return;
    }

    DERIVED_CURRENT_KEYS.forEach((key) => {
        if (char.derivedCurrent[key] == null) {
            const max = derived[key];
            if (max != null) {
                char.derivedCurrent[key] = max;
            }
        }
    });
}

// Ensure traumatic-background fields exist (older saves may omit them)
export function normalizeTraumaticBackgroundFields(char = character) {
    if (!char.traumaticBackgroundEffects || typeof char.traumaticBackgroundEffects !== 'object') {
        char.traumaticBackgroundEffects = {};
    }
    if (!Array.isArray(char.adaptations)) {
        char.adaptations = [];
    }
    if (char.traumaticBackground === undefined) {
        char.traumaticBackground = null;
    }
    if (char.basePOW === undefined) {
        char.basePOW = null;
    }
    if (char.disorder === undefined) {
        char.disorder = null;
    }
    if (!char.derivedCurrent || typeof char.derivedCurrent !== 'object') {
        char.derivedCurrent = {};
    }
}

// Get the current character object
export function getCharacter() {
    normalizeTraumaticBackgroundFields(character);
    syncDerivedCurrentDefaults(character);
    return character;
}

// Set the character object (useful for loading saved data)
export function setCharacter(newCharacter) {
    character = newCharacter;
    normalizeTraumaticBackgroundFields(character);
}

// Find a skill instance by key (for non-typed skills, returns first instance)
export function findSkillInstance(skillKey, typeName = null) {
    if (!character.skills || !Array.isArray(character.skills)) {
        return null;
    }
    
    if (typeName) {
        return character.skills.find(s => s.key === skillKey && s.typeName === typeName);
    } else {
        // For non-typed skills, return the first instance
        return character.skills.find(s => s.key === skillKey);
    }
}

// Modify a skill value by adding a percentage
export function modifySkillValue(skillKey, percentageChange, typeName = null) {
    const instance = findSkillInstance(skillKey, typeName);
    if (instance) {
        instance.value = Math.max(0, Math.min(99, instance.value + percentageChange));
        return true;
    }
    return false;
}

