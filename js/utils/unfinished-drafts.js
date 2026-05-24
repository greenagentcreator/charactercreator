// Unfinished character creation drafts (persist across browser sessions)

import { PROFESSIONS } from '../config/professions.js?v=eb448c0';
import { t } from '../i18n/i18n.js?v=eb448c0';

const DRAFTS_KEY = 'dgcc_unfinished_drafts';
const ACTIVE_DRAFT_KEY = 'dgcc_active_draft_id';
const LEGACY_SESSION_DRAFT_KEY = 'dgcc_creation_draft';
const MAX_DRAFTS = 5;

function generateDraftId() {
    return `draft_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function readDraftsRaw() {
    try {
        const stored = localStorage.getItem(DRAFTS_KEY);
        if (!stored) {
            return [];
        }
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeDraftsRaw(drafts) {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

function setActiveDraftId(draftId) {
    if (draftId) {
        localStorage.setItem(ACTIVE_DRAFT_KEY, draftId);
    } else {
        localStorage.removeItem(ACTIVE_DRAFT_KEY);
    }
}

export function getActiveDraftId() {
    return localStorage.getItem(ACTIVE_DRAFT_KEY);
}

export function getDraftProfessionLabel(character) {
    if (!character?.professionKey) {
        return t('not_selected');
    }
    if (character.professionKey === 'custom_profession') {
        const custom = character.customProfessionName?.trim();
        return custom || t(PROFESSIONS.custom_profession.nameKey);
    }
    if (PROFESSIONS[character.professionKey]) {
        return t(PROFESSIONS[character.professionKey].nameKey);
    }
    return character.professionKey.replace(/_/g, ' ');
}

export function getDraftDisplayName(character) {
    const name = character?.personalInfo?.name?.trim();
    return name ? `Agent ${name}` : t('unfinished_character_unnamed');
}

/**
 * @returns {Array<{ id: string, step: number, character: object, name: string, profession: string, updatedAt: string }>}
 */
export function getUnfinishedDrafts() {
    migrateLegacySessionDraftIfNeeded();
    return readDraftsRaw().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export function getUnfinishedDraftById(draftId) {
    if (!draftId) {
        return null;
    }
    return getUnfinishedDrafts().find((draft) => draft.id === draftId) || null;
}

export function resolveUnfinishedDraftForResume(draftId) {
    if (draftId) {
        return getUnfinishedDraftById(draftId);
    }
    const activeId = getActiveDraftId();
    if (activeId) {
        return getUnfinishedDraftById(activeId);
    }
    const drafts = getUnfinishedDrafts();
    return drafts[0] || null;
}

/**
 * @param {number} step
 * @param {object} character
 * @param {string|null} [draftId]
 * @returns {string|null}
 */
export function saveUnfinishedDraft(step, character, draftId = null) {
    if (!Number.isFinite(step) || step <= 0 || !character) {
        return draftId;
    }

    migrateLegacySessionDraftIfNeeded();

    let resolvedDraftId = draftId || getActiveDraftId() || generateDraftId();
    const snapshot = JSON.parse(JSON.stringify(character));
    const entry = {
        id: resolvedDraftId,
        step,
        character: snapshot,
        name: getDraftDisplayName(snapshot),
        profession: getDraftProfessionLabel(snapshot),
        updatedAt: new Date().toISOString()
    };

    const drafts = readDraftsRaw().filter((draft) => draft.id !== resolvedDraftId);
    drafts.unshift(entry);
    drafts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    while (drafts.length > MAX_DRAFTS) {
        drafts.pop();
    }

    writeDraftsRaw(drafts);
    setActiveDraftId(resolvedDraftId);
    return resolvedDraftId;
}

export function removeUnfinishedDraft(draftId) {
    if (!draftId) {
        return false;
    }

    const drafts = readDraftsRaw().filter((draft) => draft.id !== draftId);
    writeDraftsRaw(drafts);

    if (getActiveDraftId() === draftId) {
        setActiveDraftId(null);
    }
    return true;
}

export function clearActiveUnfinishedDraftReference() {
    setActiveDraftId(null);
}

function migrateLegacySessionDraftIfNeeded() {
    try {
        const raw = sessionStorage.getItem(LEGACY_SESSION_DRAFT_KEY);
        if (!raw) {
            return;
        }
        const parsed = JSON.parse(raw);
        if (parsed?.character && Number.isFinite(parsed.step)) {
            saveUnfinishedDraft(parsed.step, parsed.character);
        }
        sessionStorage.removeItem(LEGACY_SESSION_DRAFT_KEY);
    } catch {
        sessionStorage.removeItem(LEGACY_SESSION_DRAFT_KEY);
    }
}
