// Banner dismissal utility with 7-day/30-day logic

export const BANNER_KEYS = {
    ADVENTURE_ENGINE: 'adventureengine_banner_dismissed',
};

const FIRST_DISMISSAL_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const SECOND_DISMISSAL_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

/**
 * Check if banner should be shown
 * @param {string} storageKey localStorage key for dismissal state
 * @returns {boolean} True if banner should be shown
 */
export function shouldShowBanner(storageKey = BANNER_KEYS.ADVENTURE_ENGINE) {
    const dismissedData = localStorage.getItem(storageKey);

    if (!dismissedData) {
        return true;
    }

    try {
        const data = JSON.parse(dismissedData);
        const now = Date.now();
        const dismissedAt = data.dismissedAt;
        const dismissalCount = data.count || 1;

        const duration = dismissalCount === 1
            ? FIRST_DISMISSAL_DURATION
            : SECOND_DISMISSAL_DURATION;

        if (now - dismissedAt >= duration) {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error parsing banner dismissal data:', error);
        return true;
    }
}

/**
 * Dismiss the banner and store dismissal info
 * @param {string} storageKey localStorage key for dismissal state
 */
export function dismissBanner(storageKey = BANNER_KEYS.ADVENTURE_ENGINE) {
    const dismissedData = localStorage.getItem(storageKey);
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

    localStorage.setItem(storageKey, JSON.stringify(data));
}

/**
 * Get days until banner can be shown again
 * @param {string} storageKey localStorage key for dismissal state
 * @returns {number|null} Number of days, or null if banner should be shown
 */
export function getDaysUntilNextShow(storageKey = BANNER_KEYS.ADVENTURE_ENGINE) {
    if (shouldShowBanner(storageKey)) {
        return null;
    }

    const dismissedData = localStorage.getItem(storageKey);
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

function animateBannerDismiss(banner) {
    banner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        banner.classList.add('hidden');
    }, 300);
}

/**
 * Initialize the AdventureEngine top-of-page promo banner
 * @param {() => string} getDismissLabel Returns translated dismiss label
 */
export function initAdventureEngineTopBanner(getDismissLabel) {
    const banner = document.getElementById('adventureengine-top-banner');
    if (!banner) {
        return;
    }

    if (!shouldShowBanner(BANNER_KEYS.ADVENTURE_ENGINE)) {
        banner.classList.add('hidden');
        return;
    }

    banner.classList.remove('hidden');

    const closeBtn = document.getElementById('ae-banner-close-btn');
    if (!closeBtn || closeBtn.dataset.bound === 'true') {
        return;
    }

    closeBtn.dataset.bound = 'true';

    const updateDismissLabel = () => {
        const dismissText = getDismissLabel();
        closeBtn.setAttribute('aria-label', dismissText);
        closeBtn.setAttribute('title', dismissText);
    };

    updateDismissLabel();

    closeBtn.addEventListener('click', () => {
        dismissBanner(BANNER_KEYS.ADVENTURE_ENGINE);
        animateBannerDismiss(banner);
    });

    return updateDismissLabel;
}
