// Content moderation utilities

// Blacklist of problematic terms (case-insensitive).
// This list is intentionally short to avoid false positives – extend it to
// match your community guidelines.
const BLACKLIST = [
    'script>',
    '<img',
    'onerror=',
    'onload=',
    'alert(',
    'drop table',
    'hate',
    'kill yourself',
    'terrorist',
    'nazi'
];

const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F]+/g;
const STRIP_TAGS_REGEX = /<\/?[^>]+(>|$)/g;
const STRIP_SCRIPT_REGEX = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;

const DEFAULT_FIELD_LIMITS = {
    name: 80,
    employer: 120,
    nationality: 80,
    text: 2000,
    bondDescription: 280,
    motivation: 180,
    adaptation: 220,
    disorder: 220,
    customProfessionName: 80,
    reportReason: 360
};

const MAX_ARRAY_LENGTHS = {
    bonds: 6,
    motivations: 5,
    adaptations: 5
};

const ALLOWED_ROOT_FIELDS = new Set([
    'personalInfo',
    'bonds',
    'motivations',
    'customProfessionName',
    'professionKey',
    'profession',
    'isCustomProfession',
    'customProfessionBonds',
    'customProfessionSkillPointBudget',
    'customProfessionSelectedSkills',
    'customProfessionSetupStage',
    'skillBoostsUsed',
    'orSkillChoices',
    'profChoiceSkillSelections',
    'skills',
    'statGenerationMethod',
    'statArrayChoice',
    'rolledStatValues',
    'statAssignments',
    'stats',
    'distinguishingFeatures',
    'derivedAttributes',
    'adaptations',
    'disorder',
    'traumaticBackground',
    'notes',
    'id',
    'createdDate',
    'meta',
    'version'
]);

function deepClone(value) {
    if (typeof structuredClone === 'function') {
        return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
}

function sanitizeText(value, limit = DEFAULT_FIELD_LIMITS.text) {
    if (typeof value !== 'string') {
        return value;
    }
    let sanitized = value
        .replace(STRIP_SCRIPT_REGEX, '')
        .replace(STRIP_TAGS_REGEX, '')
        .replace(CONTROL_CHARS_REGEX, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (limit && sanitized.length > limit) {
        sanitized = sanitized.slice(0, limit);
    }
    return sanitized;
}

function sanitizePersonalInfo(info = {}) {
    const allowedFields = ['name', 'employer', 'nationality', 'sex', 'age', 'dob'];
    const sanitized = {};
    for (const field of allowedFields) {
        if (info[field] !== undefined) {
            const limit = DEFAULT_FIELD_LIMITS[field] || DEFAULT_FIELD_LIMITS.text;
            sanitized[field] = sanitizeText(info[field], limit);
        }
    }
    return sanitized;
}

function sanitizeArrayItems(items, limitKey, maxItems) {
    if (!Array.isArray(items)) {
        return [];
    }
    const limit = DEFAULT_FIELD_LIMITS[limitKey] || DEFAULT_FIELD_LIMITS.text;
    return items
        .slice(0, maxItems)
        .map((item) => sanitizeText(item, limit));
}

function sanitizeBonds(bonds = []) {
    if (!Array.isArray(bonds)) {
        return [];
    }
    return bonds.slice(0, MAX_ARRAY_LENGTHS.bonds).map((bond) => {
        if (!bond || typeof bond !== 'object') {
            return {};
        }
        return {
            ...bond,
            description: sanitizeText(bond.description || '', DEFAULT_FIELD_LIMITS.bondDescription)
        };
    });
}

export function sanitizeCharacterContent(characterData = {}) {
    if (!characterData || typeof characterData !== 'object') {
        return {};
    }

    const sanitized = deepClone(characterData);

    sanitized.personalInfo = sanitizePersonalInfo(characterData.personalInfo || {});
    sanitized.bonds = sanitizeBonds(characterData.bonds || []);
    sanitized.motivations = sanitizeArrayItems(
        characterData.motivations || [],
        'motivation',
        MAX_ARRAY_LENGTHS.motivations
    );
    sanitized.adaptations = sanitizeArrayItems(
        characterData.adaptations || [],
        'adaptation',
        MAX_ARRAY_LENGTHS.adaptations
    );

    if (characterData.disorder) {
        sanitized.disorder = sanitizeText(characterData.disorder, DEFAULT_FIELD_LIMITS.disorder);
    }
    if (characterData.customProfessionName) {
        sanitized.customProfessionName = sanitizeText(
            characterData.customProfessionName,
            DEFAULT_FIELD_LIMITS.customProfessionName
        );
    }
    if (characterData.notes) {
        sanitized.notes = sanitizeText(characterData.notes, DEFAULT_FIELD_LIMITS.text);
    }

    return sanitized;
}

export function validateCharacterSchema(characterData = {}) {
    const issues = [];
    if (!characterData || typeof characterData !== 'object' || Array.isArray(characterData)) {
        issues.push('Character data must be an object.');
        return { valid: false, issues };
    }

    const rootKeys = Object.keys(characterData);
    for (const key of rootKeys) {
        if (!ALLOWED_ROOT_FIELDS.has(key)) {
            issues.push(`Unexpected field "${key}" in character payload.`);
        }
    }

    if ('personalInfo' in characterData) {
        if (
            !characterData.personalInfo ||
            typeof characterData.personalInfo !== 'object' ||
            Array.isArray(characterData.personalInfo)
        ) {
            issues.push('personalInfo must be an object.');
        }
    }

    if ('bonds' in characterData) {
        if (!Array.isArray(characterData.bonds)) {
            issues.push('bonds must be an array.');
        } else if (characterData.bonds.length > MAX_ARRAY_LENGTHS.bonds) {
            issues.push(`bonds cannot exceed ${MAX_ARRAY_LENGTHS.bonds} entries.`);
        }
    }

    if ('motivations' in characterData) {
        if (!Array.isArray(characterData.motivations)) {
            issues.push('motivations must be an array.');
        } else if (characterData.motivations.length > MAX_ARRAY_LENGTHS.motivations) {
            issues.push(`motivations cannot exceed ${MAX_ARRAY_LENGTHS.motivations} entries.`);
        }
    }

    if ('adaptations' in characterData) {
        if (!Array.isArray(characterData.adaptations)) {
            issues.push('adaptations must be an array.');
        } else if (characterData.adaptations.length > MAX_ARRAY_LENGTHS.adaptations) {
            issues.push(`adaptations cannot exceed ${MAX_ARRAY_LENGTHS.adaptations} entries.`);
        }
    }

    return {
        valid: issues.length === 0,
        issues
    };
}

// Check if text contains problematic content
export function containsProhibitedContent(text) {
    if (!text || typeof text !== 'string') {
        return false;
    }
    
    const lowerText = text.toLowerCase();
    
    // Check against blacklist
    for (const term of BLACKLIST) {
        if (lowerText.includes(term.toLowerCase())) {
            return true;
        }
    }
    
    return false;
}

// Validate character data for prohibited content
export function validateCharacterContent(characterData) {
    const issues = [];
    
    // Check personal info
    if (characterData.personalInfo) {
        const personalFields = ['name', 'employer', 'nationality', 'sex', 'age', 'dob'];
        for (const field of personalFields) {
            if (characterData.personalInfo[field] && containsProhibitedContent(characterData.personalInfo[field])) {
                issues.push(`Prohibited content found in ${field}`);
            }
        }
    }
    
    // Check bonds
    if (characterData.bonds && Array.isArray(characterData.bonds)) {
        characterData.bonds.forEach((bond, index) => {
            if (bond.description && containsProhibitedContent(bond.description)) {
                issues.push(`Prohibited content found in bond ${index + 1}`);
            }
        });
    }
    
    // Check motivations
    if (characterData.motivations && Array.isArray(characterData.motivations)) {
        characterData.motivations.forEach((motivation, index) => {
            if (motivation && containsProhibitedContent(motivation)) {
                issues.push(`Prohibited content found in motivation ${index + 1}`);
            }
        });
    }
    
    // Check custom profession name
    if (characterData.customProfessionName && containsProhibitedContent(characterData.customProfessionName)) {
        issues.push('Prohibited content found in profession name');
    }
    
    // Check traumatic background adaptations
    if (characterData.adaptations && Array.isArray(characterData.adaptations)) {
        characterData.adaptations.forEach((adaptation, index) => {
            if (containsProhibitedContent(adaptation)) {
                issues.push(`Prohibited content found in adaptation ${index + 1}`);
            }
        });
    }
    
    // Check disorder
    if (characterData.disorder && containsProhibitedContent(characterData.disorder)) {
        issues.push('Prohibited content found in disorder description');
    }
    
    return {
        valid: issues.length === 0,
        issues: issues
    };
}

