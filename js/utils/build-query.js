// Build query suffix for cache-busted module imports (?v=git-hash)

export function getBuildQuery() {
    const version = typeof window !== 'undefined' ? window.__APP_BUILD__ : '';
    if (!version || version === 'dev') {
        return '';
    }
    return `?v=${encodeURIComponent(version)}`;
}
