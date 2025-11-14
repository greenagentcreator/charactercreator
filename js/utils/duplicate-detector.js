// Duplicate detection utility for preventing duplicate character uploads

const STORAGE_KEY = 'character_upload_fingerprints';
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Create a fingerprint/hash from character data for duplicate detection
 * @param {Object} characterData - Character data object
 * @returns {string} Fingerprint hash
 */
function createCharacterFingerprint(characterData) {
    try {
        // Extract key identifying fields
        const name = (characterData.personalInfo?.name || characterData.name || '').toLowerCase().trim();
        const profession = (characterData.profession || characterData.professionKey || '').toLowerCase().trim();
        const stats = characterData.stats || {};
        
        // Create a normalized stats string
        const statsStr = [
            stats.STR || 0,
            stats.CON || 0,
            stats.DEX || 0,
            stats.INT || 0,
            stats.POW || 0,
            stats.CHA || 0
        ].join(',');
        
        // Extract skill values (top 10 skills by value for comparison)
        const skills = characterData.skills || [];
        const skillValues = skills
            .map(s => ({ key: s.key, value: s.value || 0 }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10)
            .map(s => `${s.key}:${s.value}`)
            .join(',');
        
        // Extract bond descriptions (first 3 bonds)
        const bonds = characterData.bonds || [];
        const bondDescriptions = bonds
            .slice(0, 3)
            .map(b => (b.description || '').toLowerCase().trim())
            .filter(d => d.length > 0)
            .join('|');
        
        // Create fingerprint string
        const fingerprintData = [
            name,
            profession,
            statsStr,
            skillValues,
            bondDescriptions
        ].join('||');
        
        // Simple hash function (djb2 algorithm)
        let hash = 5381;
        for (let i = 0; i < fingerprintData.length; i++) {
            hash = ((hash << 5) + hash) + fingerprintData.charCodeAt(i);
        }
        
        return hash.toString(36);
    } catch (error) {
        console.error('Error creating character fingerprint:', error);
        // Return a timestamp-based fallback to avoid blocking uploads
        return Date.now().toString(36);
    }
}

/**
 * Clean up old fingerprints that are outside the duplicate detection window
 */
function cleanupOldFingerprints() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return;
        }
        
        const fingerprints = JSON.parse(stored);
        if (!Array.isArray(fingerprints)) {
            localStorage.removeItem(STORAGE_KEY);
            return;
        }
        
        const now = Date.now();
        const validFingerprints = fingerprints.filter(fp => {
            if (!fp || typeof fp !== 'object' || !fp.hash || typeof fp.timestamp !== 'number') {
                return false;
            }
            return (now - fp.timestamp) < DUPLICATE_WINDOW_MS;
        });
        
        if (validFingerprints.length === 0) {
            localStorage.removeItem(STORAGE_KEY);
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(validFingerprints));
        }
    } catch (error) {
        console.error('Error cleaning up duplicate fingerprints:', error);
        localStorage.removeItem(STORAGE_KEY);
    }
}

/**
 * Check if character is a duplicate of recently uploaded characters
 * @param {Object} characterData - Character data to check
 * @returns {Object} { isDuplicate: boolean, matchedFingerprint: string|null }
 */
export function checkForDuplicate(characterData) {
    cleanupOldFingerprints();
    
    try {
        const fingerprint = createCharacterFingerprint(characterData);
        
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return {
                isDuplicate: false,
                matchedFingerprint: null
            };
        }
        
        const fingerprints = JSON.parse(stored);
        if (!Array.isArray(fingerprints)) {
            return {
                isDuplicate: false,
                matchedFingerprint: null
            };
        }
        
        // Check if this fingerprint exists in recent uploads
        const now = Date.now();
        const recentFingerprints = fingerprints.filter(fp => {
            if (!fp || typeof fp !== 'object' || !fp.hash || typeof fp.timestamp !== 'number') {
                return false;
            }
            return (now - fp.timestamp) < DUPLICATE_WINDOW_MS;
        });
        
        const match = recentFingerprints.find(fp => fp.hash === fingerprint);
        
        return {
            isDuplicate: match !== undefined,
            matchedFingerprint: match ? match.hash : null
        };
    } catch (error) {
        console.error('Error checking for duplicate:', error);
        // On error, allow the upload (fail open)
        return {
            isDuplicate: false,
            matchedFingerprint: null
        };
    }
}

/**
 * Record a character fingerprint after successful upload
 * @param {Object} characterData - Character data that was uploaded
 */
export function recordCharacterFingerprint(characterData) {
    cleanupOldFingerprints();
    
    try {
        const fingerprint = createCharacterFingerprint(characterData);
        
        const stored = localStorage.getItem(STORAGE_KEY);
        let fingerprints = [];
        
        if (stored) {
            fingerprints = JSON.parse(stored);
            if (!Array.isArray(fingerprints)) {
                fingerprints = [];
            }
        }
        
        const now = Date.now();
        
        // Add new fingerprint
        fingerprints.push({
            hash: fingerprint,
            timestamp: now
        });
        
        // Keep only fingerprints within the window
        const validFingerprints = fingerprints.filter(fp => {
            if (!fp || typeof fp !== 'object' || !fp.hash || typeof fp.timestamp !== 'number') {
                return false;
            }
            return (now - fp.timestamp) < DUPLICATE_WINDOW_MS;
        });
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validFingerprints));
    } catch (error) {
        console.error('Error recording character fingerprint:', error);
        // Silently fail - don't block uploads if storage fails
    }
}

