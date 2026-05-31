// Public site URL for SEO files and fallbacks when runtime location is unavailable
export const SITE_URL = 'https://greenagentcreator.github.io/charactercreator/';
export const SITE_OG_IMAGE_PATH = 'assets/og-image.png';
export const SITE_LLMS_TXT_URL = 'https://greenagentcreator.github.io/charactercreator/llms.txt';
export const SITE_LLMS_FULL_TXT_URL = 'https://greenagentcreator.github.io/charactercreator/llms-full.txt';
export const SUPPORTED_UI_LANGUAGES = ['en', 'de', 'es', 'fr', 'ru'];

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

/** Full URL of the current document (for static SEO subpages). */
export function getDocumentCanonicalUrl() {
    if (typeof window !== 'undefined' && window.location?.href) {
        const url = new URL(window.location.href);
        url.searchParams.delete('v');
        url.hash = '';
        return url.href;
    }
    return SITE_URL;
}

export function getOgImageUrl() {
    return new URL(SITE_OG_IMAGE_PATH, getCanonicalSiteUrl()).href;
}

/** Absolute URL for a site HTML page, optionally with ?lang= */
export function getPageUrl(filename, lang = null) {
    const url = new URL(filename, SITE_URL);
    if (lang && lang !== 'x-default') {
        url.searchParams.set('lang', lang);
    }
    return url.href;
}
