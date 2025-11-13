// Content moderation utilities

// Blacklist of problematic terms
// Add terms that should be blocked (case-insensitive matching)
// This is a basic list - expand as needed based on your requirements
const BLACKLIST = [
    // Hate speech and discriminatory terms (examples - expand as needed)
    // Note: This is a basic list. You should expand it based on your specific needs.
    
    // Extremely offensive terms would go here
    // For now, keeping it minimal to avoid false positives
    // You can add specific terms that are problematic in your context
];

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

