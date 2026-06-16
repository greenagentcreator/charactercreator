// News button, unread badge, and modal

import { collection, doc, getDocs, increment, setDoc } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';
import { NEWS_ENTRIES } from '../data/news.js?v=3af973b';
import { COLLECTIONS } from '../config/database.js?v=3af973b';
import { t, getCurrentLanguage } from '../i18n/i18n.js?v=3af973b';
import { showModal } from './modal.js?v=3af973b';
import { escapeHtml, escapeAttr } from './escape-html.js?v=3af973b';
import { getDb } from './database.js?v=3af973b';

const STORAGE_KEY = 'dg_news_last_read_id';
const LIKES_STORAGE_KEY = 'dg_news_liked_ids';

const NEWS_LIKE_ICON = `<svg class="news-like-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

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

function getLikedNewsIds() {
    try {
        const parsed = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY) || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveLikedNewsId(entryId) {
    const likedIds = getLikedNewsIds();
    if (likedIds.includes(entryId)) {
        return;
    }
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify([...likedIds, entryId]));
}

async function fetchNewsLikeCounts() {
    const db = getDb();
    if (!db) {
        return {};
    }

    const snapshot = await getDocs(collection(db, COLLECTIONS.NEWS_LIKES));
    const counts = {};
    snapshot.forEach((docSnap) => {
        counts[docSnap.id] = docSnap.data().count ?? 0;
    });
    return counts;
}

async function incrementNewsLike(entryId) {
    const db = getDb();
    if (!db) {
        return false;
    }

    await setDoc(
        doc(db, COLLECTIONS.NEWS_LIKES, entryId),
        { count: increment(1) },
        { merge: true }
    );
    return true;
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

function buildLikeButtonHtml(entryId, count, isLiked) {
    const ariaLabel = isLiked ? t('news_like_aria_liked') : t('news_like_aria');

    return `
        <button type="button"
            class="news-like-btn${isLiked ? ' is-liked' : ''}"
            data-news-id="${escapeAttr(entryId)}"
            aria-label="${escapeAttr(ariaLabel)}"
            aria-pressed="${isLiked ? 'true' : 'false'}"
            ${isLiked ? 'disabled' : ''}>
            ${NEWS_LIKE_ICON}
            <span class="news-like-count">${count}</span>
        </button>`;
}

function buildNewsBodyHtml(counts = {}, likedIds = []) {
    const entries = getAllNewsEntries();

    if (entries.length === 0) {
        return `<p class="news-empty">${escapeHtml(t('news_empty'))}</p>`;
    }

    const hint = entries.length > 1
        ? `<p class="news-scroll-hint">${escapeHtml(t('news_scroll_hint'))}</p>`
        : '';

    const articles = entries.map((entry) => {
        const count = counts[entry.id] ?? 0;
        const isLiked = likedIds.includes(entry.id);

        return `
        <article class="news-entry">
            <time class="news-entry-date" datetime="${entry.date}">${escapeHtml(formatNewsDate(entry.date))}</time>
            <h3 class="news-entry-title">${escapeHtml(t(entry.titleKey))}</h3>
            <div class="news-entry-body">${t(entry.bodyKey)}</div>
            <footer class="news-entry-footer">
                ${buildLikeButtonHtml(entry.id, count, isLiked)}
            </footer>
        </article>`;
    }).join('');

    return `
        <div class="news-feed" role="feed" aria-label="${escapeHtml(t('news_feed_aria'))}" tabindex="0">
            ${hint}
            ${articles}
        </div>`;
}

function attachNewsLikeHandlers(counts) {
    const feed = document.querySelector('.news-feed');
    if (!feed) {
        return;
    }

    feed.addEventListener('click', async (event) => {
        const button = event.target.closest('.news-like-btn');
        if (!button || button.classList.contains('is-liked') || button.disabled) {
            return;
        }

        const entryId = button.dataset.newsId;
        if (!entryId || getLikedNewsIds().includes(entryId)) {
            return;
        }

        button.disabled = true;

        try {
            const saved = await incrementNewsLike(entryId);
            if (!saved) {
                button.disabled = false;
                return;
            }

            saveLikedNewsId(entryId);
            counts[entryId] = (counts[entryId] ?? 0) + 1;

            const countEl = button.querySelector('.news-like-count');
            if (countEl) {
                countEl.textContent = String(counts[entryId]);
            }

            button.classList.add('is-liked');
            button.setAttribute('aria-pressed', 'true');
            button.setAttribute('aria-label', t('news_like_aria_liked'));
        } catch (error) {
            console.warn('Could not save news like:', error);
            button.disabled = false;
        }
    });
}

export async function showNewsModal() {
    markNewsAsRead();
    refreshNewsButton();

    const likedIds = getLikedNewsIds();
    const counts = await fetchNewsLikeCounts().catch((error) => {
        console.warn('Could not load news likes:', error);
        return {};
    });

    showModal({
        title: t('news_modal_title'),
        bodyHtml: buildNewsBodyHtml(counts, likedIds),
        actions: [{ label: t('modal_close'), className: 'action-button' }]
    });

    attachNewsLikeHandlers(counts);
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
    btn.addEventListener('click', () => {
        showNewsModal();
    });
    refreshNewsButton();
}
