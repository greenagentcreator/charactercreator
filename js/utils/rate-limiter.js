// Rate limiter utility for preventing spam uploads

const STORAGE_KEY = 'character_upload_timestamps';
const RATE_LIMIT_UPLOADS = 3; // Maximum uploads allowed
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Clean up old timestamps that are outside the rate limit window
 */
function cleanupOldTimestamps() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return;
        }
        
        const timestamps = JSON.parse(stored);
        if (!Array.isArray(timestamps)) {
            localStorage.removeItem(STORAGE_KEY);
            return;
        }
        
        const now = Date.now();
        const validTimestamps = timestamps.filter(ts => {
            if (typeof ts !== 'number') {
                return false;
            }
            return (now - ts) < RATE_LIMIT_WINDOW_MS;
        });
        
        if (validTimestamps.length === 0) {
            localStorage.removeItem(STORAGE_KEY);
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(validTimestamps));
        }
    } catch (error) {
        console.error('Error cleaning up rate limit timestamps:', error);
        localStorage.removeItem(STORAGE_KEY);
    }
}

/**
 * Check if upload is allowed based on rate limit
 * @returns {Object} { allowed: boolean, remaining: number, resetAt: number|null }
 */
export function checkRateLimit() {
    cleanupOldTimestamps();
    
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let timestamps = [];
        
        if (stored) {
            timestamps = JSON.parse(stored);
            if (!Array.isArray(timestamps)) {
                timestamps = [];
            }
        }
        
        const now = Date.now();
        const recentTimestamps = timestamps.filter(ts => {
            if (typeof ts !== 'number') {
                return false;
            }
            return (now - ts) < RATE_LIMIT_WINDOW_MS;
        });
        
        const remaining = Math.max(0, RATE_LIMIT_UPLOADS - recentTimestamps.length);
        const allowed = remaining > 0;
        
        // Calculate when the rate limit will reset (oldest timestamp + window)
        let resetAt = null;
        if (recentTimestamps.length > 0 && recentTimestamps.length >= RATE_LIMIT_UPLOADS) {
            const oldestTimestamp = Math.min(...recentTimestamps);
            resetAt = oldestTimestamp + RATE_LIMIT_WINDOW_MS;
        }
        
        return {
            allowed,
            remaining,
            resetAt
        };
    } catch (error) {
        console.error('Error checking rate limit:', error);
        // On error, allow the upload (fail open)
        return {
            allowed: true,
            remaining: RATE_LIMIT_UPLOADS,
            resetAt: null
        };
    }
}

/**
 * Record an upload timestamp
 */
export function recordUpload() {
    cleanupOldTimestamps();
    
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let timestamps = [];
        
        if (stored) {
            timestamps = JSON.parse(stored);
            if (!Array.isArray(timestamps)) {
                timestamps = [];
            }
        }
        
        const now = Date.now();
        timestamps.push(now);
        
        // Keep only timestamps within the window
        const validTimestamps = timestamps.filter(ts => {
            if (typeof ts !== 'number') {
                return false;
            }
            return (now - ts) < RATE_LIMIT_WINDOW_MS;
        });
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validTimestamps));
    } catch (error) {
        console.error('Error recording upload timestamp:', error);
        // Silently fail - don't block uploads if storage fails
    }
}

