// Public site URL for SEO files and fallbacks when runtime location is unavailable
export const SITE_URL = 'https://greenagentcreator.github.io/charactercreator/';

export function getCanonicalSiteUrl() {
    if (typeof window !== 'undefined' && window.location?.origin) {
        const { origin, pathname } = window.location;
        const basePath = pathname.endsWith('/')
            ? pathname
            : pathname.replace(/\/[^/]*$/, '/');
        return `${origin}${basePath}`;
    }
    return SITE_URL;
}
