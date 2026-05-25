// News button, unread badge, and modal

import { NEWS_ENTRIES } from '../data/news.js?v=5a1d155';
import { t, getCurrentLanguage } from '../i18n/i18n.js?v=5a1d155';
import { showModal } from './modal.js?v=5a1d155';
import { escapeHtml } from './escape-html.js?v=5a1d155';

const STORAGE_KEY = 'dg_news_last_read_id';

function compareNewsEntries(a, b) {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) {
        return dateCompare;
    }
    return b.id.localeCompare(a.id);
}

export function getAllNewsEntries() {
    return [...NEWS_ENTRIES].sort(compareNewsEntries);
}

export function getLatestNewsId() {
    const entries = getAllNewsEntries();
    if (entries.length === 0) {
        return null;
    }
    return entries[0].id;
}

export function hasUnreadNews() {
    const latestId = getLatestNewsId();
    if (!latestId) {
        return false;
    }
    return localStorage.getItem(STORAGE_KEY) !== latestId;
}

function markNewsAsRead() {
    const latestId = getLatestNewsId();
    if (latestId) {
        localStorage.setItem(STORAGE_KEY, latestId);
    }
}

function formatNewsDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(getCurrentLanguage(), {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function buildNewsBodyHtml() {
    const entries = getAllNewsEntries();

    if (entries.length === 0) {
        return `<p class="news-empty">${escapeHtml(t('news_empty'))}</p>`;
    }

    const hint = entries.length > 1
        ? `<p class="news-scroll-hint">${escapeHtml(t('news_scroll_hint'))}</p>`
        : '';

    const articles = entries.map((entry) => `
        <article class="news-entry">
            <time class="news-entry-date" datetime="${entry.date}">${escapeHtml(formatNewsDate(entry.date))}</time>
            <h3 class="news-entry-title">${escapeHtml(t(entry.titleKey))}</h3>
            <div class="news-entry-body">${t(entry.bodyKey)}</div>
        </article>`).join('');

    return `
        <div class="news-feed" role="feed" aria-label="${escapeHtml(t('news_feed_aria'))}" tabindex="0">
            ${hint}
            ${articles}
        </div>`;
}

export function showNewsModal() {
    markNewsAsRead();
    refreshNewsButton();

    showModal({
        title: t('news_modal_title'),
        bodyHtml: buildNewsBodyHtml(),
        actions: [{ label: t('modal_close'), className: 'action-button' }]
    });
}

export function refreshNewsButton() {
    const btn = document.getElementById('news-toggle');
    const badge = document.getElementById('news-unread-badge');
    if (!btn) {
        return;
    }

    const unread = hasUnreadNews();
    btn.setAttribute('aria-label', unread ? t('news_btn_aria_unread') : t('news_btn_aria'));
    btn.setAttribute('title', unread ? t('news_btn_title_unread') : t('news_btn_title'));

    if (badge) {
        badge.hidden = !unread;
    }
}

export function initNews() {
    const btn = document.getElementById('news-toggle');
    if (!btn || btn.dataset.bound === 'true') {
        return;
    }

    btn.dataset.bound = 'true';
    btn.addEventListener('click', showNewsModal);
    refreshNewsButton();
}
