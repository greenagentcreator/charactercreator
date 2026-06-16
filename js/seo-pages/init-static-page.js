// Lightweight i18n + meta for static SEO subpages (guide, sheet, ideas)

import { initI18n, initLanguageSwitcher, applyPageTranslations, getCurrentLanguage, t } from '../i18n/i18n.js?v=5c9e92d';
import { configureLogging } from '../config/environment.js?v=5c9e92d';
import {
    getDocumentCanonicalUrl,
    getOgImageUrl,
    getPageUrl,
    SUPPORTED_UI_LANGUAGES
} from '../config/site.js?v=5c9e92d';

function upsertMeta(selector, attributes) {
    let el = document.head.querySelector(selector);
    if (!el) {
        el = document.createElement('meta');
        document.head.appendChild(el);
    }
    Object.entries(attributes).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
}

function upsertJsonLd(id, data) {
    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement('script');
        el.id = id;
        el.type = 'application/ld+json';
        document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
}

function syncHreflangLinks(filename) {
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

    SUPPORTED_UI_LANGUAGES.forEach((lang) => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', lang);
        link.setAttribute('href', getPageUrl(filename, lang));
        document.head.appendChild(link);
    });

    const xDefault = document.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', getPageUrl(filename, null));
    document.head.appendChild(xDefault);
}

function updateStaticPageMeta(pageId, filename, lang) {
    const title = t(`${pageId}_page_title`);
    const description = t(`${pageId}_meta_description`);
    const keywords = t(`${pageId}_meta_keywords`);
    const canonical = getDocumentCanonicalUrl();
    const ogImage = getOgImageUrl();

    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    upsertMeta('meta[property="og:locale"]', {
        property: 'og:locale',
        content: lang === 'en' ? 'en_US' : lang
    });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    syncHreflangLinks(filename);

    if (pageId === 'guide') {
        upsertJsonLd('page-json-ld', buildGuideArticleJsonLd());
    } else if (pageId === 'sheet') {
        upsertJsonLd('page-json-ld', buildSheetWebPageJsonLd());
    } else if (pageId === 'ideas') {
        upsertJsonLd('page-json-ld', buildIdeasWebPageJsonLd());
    }
}

function buildGuideArticleJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: t('guide_h1'),
        description: t('guide_meta_description'),
        url: getDocumentCanonicalUrl(),
        image: getOgImageUrl(),
        inLanguage: getCurrentLanguage(),
        author: { '@type': 'Organization', name: t('meta_og_site_name') },
        publisher: { '@type': 'Organization', name: t('meta_og_site_name') },
        mainEntityOfPage: getDocumentCanonicalUrl()
    };
}

function buildSheetWebPageJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: t('sheet_h1'),
        description: t('sheet_meta_description'),
        url: getDocumentCanonicalUrl(),
        inLanguage: getCurrentLanguage()
    };
}

function buildIdeasWebPageJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: t('ideas_h1'),
        description: t('ideas_meta_description'),
        url: getDocumentCanonicalUrl(),
        inLanguage: getCurrentLanguage()
    };
}

function applyLanguage(lang, pageId, filename) {
    applyPageTranslations(lang);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    url.searchParams.delete('v');
    window.history.replaceState(null, '', url);
    updateStaticPageMeta(pageId, filename, lang);

    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.setAttribute('aria-label', t('seo_pages_language_aria'));
    }
}

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    html.setAttribute('data-theme', initialTheme);
    if (themeIcon) {
        themeIcon.textContent = initialTheme === 'dark' ? '☀️' : '🌙';
    }
    themeToggle?.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        if (themeIcon) {
            themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
        }
    });
}

/**
 * @param {{ pageId: 'guide' | 'sheet' | 'ideas', filename: string }} config
 */
export function initStaticPage({ pageId, filename }) {
    configureLogging();
    initThemeToggle();
    initI18n();
    initLanguageSwitcher();

    const lang = getCurrentLanguage();
    document.documentElement.lang = lang;
    applyLanguage(lang, pageId, filename);

    const languageSelect = document.getElementById('language-select');
    languageSelect?.addEventListener('change', () => {
        applyLanguage(languageSelect.value, pageId, filename);
    });

}
