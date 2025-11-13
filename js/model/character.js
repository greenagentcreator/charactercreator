// Character model and related functions for Delta Green Character Creator

import { ALL_SKILLS } from '../config/skills.js';

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
        bonds: [],
        motivations: ["", "", "", "", ""]
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

// Calculate derived attributes based on primary statistics
export function calculateDerivedAttributes() {
    const stats = character.stats;
    if (!stats.STR || !stats.CON || !stats.POW) {
        character.derivedAttributes = { HP: 0, WP: 0, SAN: 0, BP: 0 };
        return;
    }

    const HP = Math.ceil((stats.STR + stats.CON) / 2);
    const WP = stats.POW;
    const SAN = stats.POW * 5;
    const BP = SAN - stats.POW;

    character.derivedAttributes = {
        HP: HP,
        WP: WP,
        SAN: SAN,
        BP: BP
    };
}

// Get the current character object
export function getCharacter() {
    return character;
}

// Set the character object (useful for loading saved data)
export function setCharacter(newCharacter) {
    character = newCharacter;
}

