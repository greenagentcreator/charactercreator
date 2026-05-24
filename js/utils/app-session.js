// Session persistence for in-tab navigation restore (URL hash backup)

const NAV_STATE_KEY = 'dgcc_app_nav';

/**
 * @param {{ mode: string, step?: number, characterId?: string, dbId?: string, draftId?: string }} state
 */
export function persistAppNavigationState(state) {
    if (!state?.mode) {
        return;
    }
    try {
        sessionStorage.setItem(NAV_STATE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn('Could not persist navigation state:', error);
    }
}

/**
 * @returns {{ mode: string, step?: number, characterId?: string, dbId?: string, draftId?: string }|null}
 */
export function loadAppNavigationState() {
    try {
        const raw = sessionStorage.getItem(NAV_STATE_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw);
        return parsed?.mode ? parsed : null;
    } catch {
        return null;
    }
}

export function clearAppNavigationState() {
    try {
        sessionStorage.removeItem(NAV_STATE_KEY);
    } catch {
        // ignore
    }
}
