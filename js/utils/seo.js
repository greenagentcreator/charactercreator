// Document meta tags, Open Graph, and JSON-LD for SEO / discoverability

import { t } from '../i18n/i18n.js?v=3e17b91';
import { getCanonicalSiteUrl, getOgImageUrl } from '../config/site.js?v=3e17b91';

const HREFLANGS = ['en', 'de', 'es', 'fr', 'ru'];
const FAQ_COUNT = 5;
const HOWTO_STEP_COUNT = 6;

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

function buildFaqPageJsonLd() {
    const mainEntity = [];
    for (let i = 1; i <= FAQ_COUNT; i += 1) {
        const question = t(`seo_faq_q${i}`);
        const answer = t(`seo_faq_a${i}`);
        if (!question || question.startsWith('[[')) {
            continue;
        }
        mainEntity.push({
            '@type': 'Question',
            name: question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: answer
            }
        });
    }
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity
    };
}

function buildHowToJsonLd() {
    const steps = [];
    for (let i = 1; i <= HOWTO_STEP_COUNT; i += 1) {
        const name = t(`seo_howto_step${i}_name`);
        const text = t(`seo_howto_step${i}_text`);
        if (!name || name.startsWith('[[')) {
            continue;
        }
        steps.push({
            '@type': 'HowToStep',
            position: steps.length + 1,
            name,
            text
        });
    }
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: t('seo_howto_name'),
        description: t('seo_howto_description'),
        step: steps
    };
}

function buildWebApplicationJsonLd(siteUrl, description) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: t('meta_og_site_name'),
        alternateName: [
            'Delta Green Character Creator',
            'Delta Green Character Sheet',
            'Delta Green Character Builder'
        ],
        description,
        url: siteUrl,
        image: getOgImageUrl(),
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
    };
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
    const ogImageUrl = getOgImageUrl();
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
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImageUrl });
    upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
    upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' });
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: t('meta_og_image_alt') });
    upsertMeta('meta[property="og:locale"]', {
        property: 'og:locale',
        content: lang === 'en' ? 'en_US' : lang.replace('-', '_')
    });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: ogTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImageUrl });
    upsertMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: t('meta_og_image_alt') });

    upsertLink('canonical', null, siteUrl);

    upsertJsonLd('site-json-ld', buildWebApplicationJsonLd(siteUrl, description));
    upsertJsonLd('faq-json-ld', buildFaqPageJsonLd());
    upsertJsonLd('howto-json-ld', buildHowToJsonLd());
}
