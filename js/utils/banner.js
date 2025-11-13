// Banner dismissal utility with 7-day/30-day logic

const BANNER_STORAGE_KEY = 'writersalley_banner_dismissed';
const FIRST_DISMISSAL_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const SECOND_DISMISSAL_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

/**
 * Check if banner should be shown
 * @returns {boolean} True if banner should be shown
 */
export function shouldShowBanner() {
    const dismissedData = localStorage.getItem(BANNER_STORAGE_KEY);
    
    if (!dismissedData) {
        // Never dismissed, show banner
        return true;
    }
    
    try {
        const data = JSON.parse(dismissedData);
        const now = Date.now();
        const dismissedAt = data.dismissedAt;
        const dismissalCount = data.count || 1;
        
        // Calculate duration based on dismissal count
        const duration = dismissalCount === 1 
            ? FIRST_DISMISSAL_DURATION 
            : SECOND_DISMISSAL_DURATION;
        
        // Check if dismissal period has expired
        if (now - dismissedAt >= duration) {
            // Period expired, show banner again
            return true;
        }
        
        // Still within dismissal period
        return false;
    } catch (error) {
        console.error('Error parsing banner dismissal data:', error);
        // On error, show banner to be safe
        return true;
    }
}

/**
 * Dismiss the banner and store dismissal info
 */
export function dismissBanner() {
    const dismissedData = localStorage.getItem(BANNER_STORAGE_KEY);
    let count = 1;
    
    if (dismissedData) {
        try {
            const data = JSON.parse(dismissedData);
            count = (data.count || 1) + 1;
        } catch (error) {
            console.error('Error parsing existing dismissal data:', error);
        }
    }
    
    const data = {
        dismissedAt: Date.now(),
        count: count
    };
    
    localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Get days until banner can be shown again
 * @returns {number|null} Number of days, or null if banner should be shown
 */
export function getDaysUntilNextShow() {
    if (shouldShowBanner()) {
        return null;
    }
    
    const dismissedData = localStorage.getItem(BANNER_STORAGE_KEY);
    if (!dismissedData) {
        return null;
    }
    
    try {
        const data = JSON.parse(dismissedData);
        const now = Date.now();
        const dismissedAt = data.dismissedAt;
        const dismissalCount = data.count || 1;
        
        const duration = dismissalCount === 1 
            ? FIRST_DISMISSAL_DURATION 
            : SECOND_DISMISSAL_DURATION;
        
        const remaining = duration - (now - dismissedAt);
        const daysRemaining = Math.ceil(remaining / (24 * 60 * 60 * 1000));
        
        return Math.max(0, daysRemaining);
    } catch (error) {
        console.error('Error calculating days until next show:', error);
        return null;
    }
}

