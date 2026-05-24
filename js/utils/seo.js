// Document meta tags, Open Graph, and JSON-LD for SEO / discoverability

import { t } from '../i18n/i18n.js?v=eb448c0';
import { getCanonicalSiteUrl } from '../config/site.js?v=eb448c0';

const HREFLANGS = ['en', 'de', 'es', 'fr', 'ru'];

function upsertMeta(selector, attributes) {
    let el = document.head.querySelector(selector);
    if (!el) {
        el = document.createElement('meta');
        document.head.appendChild(el);
    }
    Object.entries(attributes).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}

function upsertLink(rel, hreflang, href) {
    const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]`;
    let el = document.head.querySelector(selector);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        if (hreflang) {
            el.setAttribute('hreflang', hreflang);
        }
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
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

export function initSeoMeta() {
    const siteUrl = getCanonicalSiteUrl();
    HREFLANGS.forEach((lang) => {
        upsertLink('alternate', lang, `${siteUrl}?lang=${lang}`);
    });
    upsertLink('alternate', 'x-default', siteUrl);
    updateSeoMeta();
}

export function updateSeoMeta(lang = document.documentElement.lang || 'en') {
    const siteUrl = getCanonicalSiteUrl();
    const title = t('page_title');
    const description = t('meta_description');
    const ogTitle = t('meta_og_title');

    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: t('meta_keywords') });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow, max-image-preview:large' });

    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: t('meta_og_site_name') });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: ogTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: siteUrl });
    upsertMeta('meta[property="og:locale"]', {
        property: 'og:locale',
        content: lang === 'en' ? 'en_US' : lang.replace('-', '_')
    });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: ogTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });

    upsertLink('canonical', null, siteUrl);

    upsertJsonLd('site-json-ld', {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: t('meta_og_site_name'),
        alternateName: 'Delta Green Agent Creator',
        description,
        url: siteUrl,
        applicationCategory: 'GameApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        },
        inLanguage: HREFLANGS,
        featureList: t('meta_feature_list'),
        keywords: t('meta_keywords'),
        isAccessibleForFree: true,
        author: {
            '@type': 'Organization',
            name: 'Delta Green Character Creator'
        }
    });
}
