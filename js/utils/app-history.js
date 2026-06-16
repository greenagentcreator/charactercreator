// Browser history integration for in-app navigation (steps, character views)

import { persistAppNavigationState } from './app-session.js?v=09f6897';

let navigatingFromHistory = false;

/**
 * @typedef {'home'|'create'|'view-local'|'view-db'} AppNavMode
 * @typedef {{ appNav?: boolean, mode: AppNavMode, step?: number, characterId?: string, dbId?: string }} AppNavState
 */

/**
 * @param {AppNavState} state
 * @returns {string}
 */
export function appStateToUrl(state) {
    const base = window.location.pathname + window.location.search;
    switch (state.mode) {
        case 'home':
            return `${base}#app/home`;
        case 'create':
            return `${base}#app/create/${state.step ?? 0}`;
        case 'view-local':
            return `${base}#app/view/local/${encodeURIComponent(state.characterId || '')}`;
        case 'view-db':
            return `${base}#app/view/db/${encodeURIComponent(state.dbId || '')}`;
        default:
            return `${base}#app/home`;
    }
}

/**
 * @returns {AppNavState|null}
 */
export function appStateFromUrl() {
    const hash = window.location.hash;
    if (!hash.startsWith('#app/')) return null;

    const path = hash.slice('#app/'.length);

    if (path === 'home') {
        return { appNav: true, mode: 'home', step: 0 };
    }

    const createMatch = path.match(/^create\/(\d+)$/);
    if (createMatch) {
        return { appNav: true, mode: 'create', step: parseInt(createMatch[1], 10) };
    }

    const localMatch = path.match(/^view\/local\/(.+)$/);
    if (localMatch) {
        return { appNav: true, mode: 'view-local', characterId: decodeURIComponent(localMatch[1]) };
    }

    const dbMatch = path.match(/^view\/db\/(.+)$/);
    if (dbMatch) {
        return { appNav: true, mode: 'view-db', dbId: decodeURIComponent(dbMatch[1]) };
    }

    return null;
}

/**
 * @param {AppNavState} state
 * @param {{ replace?: boolean }} [options]
 */
export function syncAppHistory(state, { replace = false } = {}) {
    if (navigatingFromHistory) return;

    const fullState = { appNav: true, ...state };
    const url = appStateToUrl(fullState);

    if (replace) {
        history.replaceState(fullState, '', url);
    } else {
        history.pushState(fullState, '', url);
    }

    persistAppNavigationState(state);
}

/**
 * @param {(state: AppNavState) => void|Promise<void>} applyState
 */
export function initAppHistory(applyState) {
    window.addEventListener('popstate', (event) => {
        navigatingFromHistory = true;
        Promise.resolve(applyState(event.state?.appNav ? event.state : (appStateFromUrl() || { appNav: true, mode: 'home', step: 0 })))
            .finally(() => {
                navigatingFromHistory = false;
            });
    });
}

export function isNavigatingFromHistory() {
    return navigatingFromHistory;
}
