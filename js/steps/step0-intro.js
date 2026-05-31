// Step 0: Introduction

import { resetCharacter } from '../model/character.js?v=b5d21d8';
import { getAllCharacters, deleteCharacter, updateCharacterName, importCharacter } from '../utils/storage.js?v=b5d21d8';
import { getUnfinishedDrafts } from '../utils/unfinished-drafts.js?v=b5d21d8';
import { t, translateAllElements, getCurrentLanguage } from '../i18n/i18n.js?v=b5d21d8';
import { languageLabels, SUPPORTED_LIBRARY_LANGUAGES } from '../i18n/translations.js?v=b5d21d8';
import { validateImportedCharacter } from '../utils/validation.js?v=b5d21d8';
import { getPublicCharacters, importCharacterFromDatabase, reportCharacter, getPublicCharacterById } from '../utils/database.js?v=b5d21d8';
import { shouldShowBanner, dismissBanner } from '../utils/banner.js?v=b5d21d8';
import { resolveProfessionMetadata, getStandardProfessionFilters } from '../utils/profession-filter.js?v=b5d21d8';
import { showModal, closeModal, showConfirmDialog, showPromptDialog, showAlertDialog } from '../utils/modal.js?v=b5d21d8';
import { escapeHtml, escapeAttr } from '../utils/escape-html.js?v=b5d21d8';

const DEFAULT_PROFESSION_FILTER = 'all';
const DEFAULT_LANGUAGE_FILTER = 'all';
const LIBRARY_PAGE_SIZE = 20;
const LIBRARY_CACHE_TTL_MS = 5 * 60 * 1000;
const LIBRARY_CACHE_PREFIX = 'dg_library_v2_';

const libraryState = {
    filter: DEFAULT_PROFESSION_FILTER,
    languageFilter: DEFAULT_LANGUAGE_FILTER,
    characters: [],
    lastDoc: null,
    lastDocId: null,
    hasMore: false,
    loaded: false,
    loading: false
};

let lazyLoadObserver = null;

function getProfessionDisplayName(professionValue) {
    if (!professionValue) {
        return 'Unknown';
    }
    if (professionValue.startsWith('profession_')) {
        return t(professionValue);
    }
    return professionValue;
}

function renderPromoBannerMarkup(showBanner) {
    if (!showBanner) {
        return '';
    }
    return `
            <div class="promo-banner" id="writersalley-banner">
                <div class="promo-banner-icon">✍️</div>
                <div class="promo-banner-content">
                    <h3 class="promo-banner-headline" data-i18n="banner_headline">Are you a writer?</h3>
                    <p class="promo-banner-text" data-i18n="banner_text">Check out my new app <a href="https://writersalley.com" target="_blank" rel="noopener noreferrer" class="promo-banner-link">WritersAlley.com</a> — a goal-based writing tracker that helps you stay on target.</p>
                </div>
                <div class="promo-banner-actions">
                    <a href="https://writersalley.com" target="_blank" rel="noopener noreferrer" class="promo-banner-cta" data-i18n="banner_cta">Visit WritersAlley.com</a>
                    <button class="promo-banner-close" id="banner-close-btn" aria-label="" title="">×</button>
                </div>
            </div>`;
}

const CREATION_STEP_NAME_KEYS = [
    '',
    'step_name_1',
    'step_name_2',
    'step_name_3',
    'step_name_4',
    'step_name_4_3',
    'step_name_5_personal',
    'step_name_5'
];

function getCreationStepLabel(step) {
    const key = CREATION_STEP_NAME_KEYS[step] || CREATION_STEP_NAME_KEYS[1];
    return t(key);
}

function getCharacterCardMenuMarkup({ characterId = '', draftId = '', showRename = false, showDelete = false, showDiscard = false, agentName = '' }) {
    const items = [];

    if (showRename && characterId) {
        items.push(`<button type="button" class="character-menu-item character-rename-btn" data-character-id="${characterId}" data-i18n="edit_name"></button>`);
    }
    if (showDelete && characterId) {
        items.push(`<button type="button" class="character-menu-item character-menu-delete character-delete-btn" data-character-id="${characterId}" data-i18n="delete_character" aria-label="${escapeAttr(t('aria_delete_character', { name: agentName }))}"></button>`);
    }
    if (showDiscard && draftId) {
        items.push(`<button type="button" class="character-menu-item character-menu-delete character-discard-draft-btn" data-draft-id="${draftId}" data-i18n="btn_discard_unfinished" aria-label="${escapeAttr(t('aria_discard_unfinished', { name: agentName }))}"></button>`);
    }

    if (items.length === 0) {
        return '';
    }

    return `
                        <div class="character-card-menu">
                            <button type="button" class="character-menu-toggle" aria-label="${t('home_card_menu_label')}" aria-haspopup="true" aria-expanded="false">⋮</button>
                            <div class="character-card-menu-dropdown" hidden>
                                ${items.join('')}
                            </div>
                        </div>`;
}

function getUnfinishedCharacterCardMarkup(draft) {
    const updatedDate = new Date(draft.updatedAt);
    const dateStr = updatedDate.toLocaleDateString();
    const stepLabel = getCreationStepLabel(draft.step);
    const progressText = t('unfinished_character_progress', { step: draft.step, stepName: stepLabel });

    return `
        <div class="character-card character-card-public character-card-unfinished" data-draft-id="${draft.id}">
            <div class="character-card-content">
                <div class="character-card-header">
                    <h4 class="character-name">${escapeHtml(draft.name)}</h4>
                    ${getCharacterCardMenuMarkup({
                        draftId: draft.id,
                        showDiscard: true,
                        agentName: draft.name,
                    })}
                </div>
                <div class="character-card-info">
                    <span class="character-profession">${escapeHtml(draft.profession)}</span>
                    <span class="character-date">${dateStr}</span>
                </div>
                <p class="character-unfinished-progress">${escapeHtml(progressText)}</p>
                ${getCharacterStatsPreview({ data: draft.character })}
            </div>
            <div class="character-card-actions character-card-actions-single">
                <button type="button" class="character-continue-draft-btn character-view-db-btn" data-draft-id="${draft.id}" data-i18n="btn_continue_unfinished" aria-label="${escapeAttr(t('aria_continue_unfinished', { name: draft.name }))}"></button>
            </div>
        </div>`;
}

function getOwnCharacterCardMarkup(char) {
    const createdDate = new Date(char.createdDate || char.importedDate);
    const dateStr = createdDate.toLocaleDateString();
    const isImported = char.imported === true;
    const professionDisplay = getProfessionDisplayName(char.profession);
    const agentName = char.name || 'Unnamed';
    const displayName = `Agent ${agentName}`;

    return `
        <div class="character-card character-card-public character-card-own${isImported ? ' character-card-imported' : ''}" data-character-id="${char.id}">
            <div class="character-card-content">
                <div class="character-card-header">
                    <h4 class="character-name" data-character-id="${char.id}">${escapeHtml(displayName)}</h4>
                    <div class="character-card-header-actions">
                        ${isImported ? `<span class="imported-badge" data-i18n="imported_character_label"></span>` : ''}
                        ${getCharacterCardMenuMarkup({
                            characterId: char.id,
                            showRename: !isImported,
                            showDelete: true,
                            agentName,
                        })}
                    </div>
                </div>
                <div class="character-card-info">
                    <span class="character-profession">${escapeHtml(professionDisplay)}</span>
                    <span class="character-date">${escapeHtml(dateStr)}</span>
                </div>
                ${getCharacterStatsPreview(char)}
            </div>
            <div class="character-card-actions">
                <button type="button" class="character-open-btn character-view-db-btn" data-character-id="${char.id}" data-i18n="btn_open_character" aria-label="${escapeAttr(t('aria_view_character', { name: agentName }))}"></button>
                <button type="button" class="character-print-btn character-load-btn" data-character-id="${char.id}" data-i18n="btn_print_character" aria-label="${escapeAttr(t('aria_print_summary'))}"></button>
            </div>
        </div>`;
}

function renderMineSectionMarkup(allCharacters, unfinishedDrafts = []) {
    const hasCompleted = allCharacters.length > 0;
    const hasUnfinished = unfinishedDrafts.length > 0;

    let body = `
                <div class="home-empty-state">
                    <p data-i18n="home_empty_characters"></p>
                    <p class="home-empty-hint" data-i18n="home_empty_characters_hint"></p>
                </div>`;

    if (hasUnfinished || hasCompleted) {
        const unfinishedHtml = hasUnfinished
            ? `
                <div class="home-unfinished-group">
                    <h4 class="home-subsection-title" data-i18n="home_unfinished_heading"></h4>
                    <div class="character-list character-list-library">
                        ${unfinishedDrafts.map(getUnfinishedCharacterCardMarkup).join('')}
                    </div>
                </div>`
            : '';

        const completedHtml = hasCompleted
            ? `
                ${hasUnfinished ? '<h4 class="home-subsection-title" data-i18n="home_completed_heading"></h4>' : ''}
                <div class="character-list character-list-library">
                    ${allCharacters.map(getOwnCharacterCardMarkup).join('')}
                </div>`
            : '';

        body = `${unfinishedHtml}${completedHtml}`;
    }

    return `
            <section class="home-section home-section-mine" id="home-section-mine" aria-labelledby="home-mine-heading">
                <h3 class="home-section-title" id="home-mine-heading" data-i18n="own_characters_title"></h3>
                ${body}
            </section>`;
}

function renderLibrarySkeletonMarkup() {
    return `
        <div class="library-skeleton" aria-hidden="true">
            ${Array.from({ length: 3 }).map(() => `
                <div class="library-skeleton-card">
                    <div class="library-skeleton-line library-skeleton-line--title"></div>
                    <div class="library-skeleton-line library-skeleton-line--short"></div>
                    <div class="library-skeleton-line library-skeleton-line--medium"></div>
                </div>
            `).join('')}
        </div>`;
}

function renderLibrarySectionMarkup() {
    return `
            <section class="home-section home-section-library" id="home-section-library" aria-labelledby="home-library-heading">
                <div class="home-section-library-header">
                    <h3 class="home-section-title" id="home-library-heading" data-i18n="made_by_others_title"></h3>
                    <button type="button" id="btn-library-refresh" class="library-refresh-btn" data-i18n="library_refresh" aria-label="${t('library_refresh')}"></button>
                </div>
                <div id="library-panel-inner" class="library-panel-inner" aria-live="polite">
                    ${renderLibrarySkeletonMarkup()}
                </div>
            </section>`;
}

function getLibraryCacheKey() {
    return `${libraryState.filter}__${libraryState.languageFilter}`;
}

function getLibraryEmptyMessageKey() {
    if (libraryState.languageFilter !== DEFAULT_LANGUAGE_FILTER) {
        return 'library_language_filter_empty';
    }
    return 'made_by_others_filter_empty';
}

function buildLanguageFilterMarkup() {
    const languageFilters = [
        ...SUPPORTED_LIBRARY_LANGUAGES.map((code) => ({
            key: code,
            label: languageLabels[code] || code.toUpperCase(),
            i18nKey: null
        })),
        { key: 'all', label: t('library_language_all'), i18nKey: 'library_language_all' }
    ];

    const options = languageFilters.map((filter) => {
        const selected = libraryState.languageFilter === filter.key ? ' selected' : '';
        const i18nAttr = filter.i18nKey ? ` data-i18n="${filter.i18nKey}"` : '';
        return `<option value="${filter.key}"${selected}${i18nAttr}>${filter.label}</option>`;
    }).join('');

    return `
            <div class="library-filter-row library-language-filter">
                <label class="library-filter-label" for="library-language-filter">
                    <span data-i18n="library_language_filter_label"></span>
                </label>
                <div class="library-filter-control">
                    <select id="library-language-filter" class="library-language-filter-select" aria-label="${t('library_language_filter_aria')}">
                        ${options}
                    </select>
                </div>
            </div>`;
}

function buildLibraryFiltersMarkup() {
    return `
            ${buildLanguageFilterMarkup()}
            <div class="made-by-others-filters" role="tablist" aria-label="${t('made_by_others_filter_aria_label')}">
                ${buildProfessionFilterButtonsMarkup()}
            </div>`;
}

function buildProfessionFilterButtonsMarkup() {
    const standardProfessionFilters = getStandardProfessionFilters();
    const professionFilterButtons = [
        { key: 'all', label: t('made_by_others_filter_all'), i18nKey: 'made_by_others_filter_all' },
        ...standardProfessionFilters.map((filter) => ({ key: filter.key, label: filter.label, i18nKey: filter.i18nKey })),
        { key: 'custom', label: t('made_by_others_filter_custom'), i18nKey: 'made_by_others_filter_custom' }
    ];

    return professionFilterButtons.map((filter) => {
        const isActive = libraryState.filter === filter.key;
        return `
            <button type="button" class="profession-filter-btn ${isActive ? 'active' : ''}" data-filter="${filter.key}" role="tab" aria-selected="${isActive ? 'true' : 'false'}" data-i18n="${filter.i18nKey}">
                ${filter.label}
            </button>`;
    }).join('');
}

function getCharacterStatsPreview(char) {
    const stats = char.previewStats || char.data?.stats;
    if (!stats) {
        return '';
    }

    const statKeys = ['STR', 'CON', 'DEX', 'INT', 'POW', 'CHA'];
    const chips = statKeys
        .filter((key) => stats[key] != null)
        .map((key) => `
            <div class="character-stat-chip">
                <span class="character-stat-label">${key}</span>
                <span class="character-stat-value">${stats[key]}</span>
            </div>`);

    if (chips.length === 0) {
        return '';
    }

    const bondCount = char.data?.bonds?.length ?? char.bondCount ?? 0;
    const bondsMarkup = bondCount > 0
        ? `<span class="character-bonds-preview">${t('library_bonds_count', { count: bondCount })}</span>`
        : '';

    return `
        <div class="character-card-preview">
            <div class="character-stats-grid">${chips.join('')}</div>
            ${bondsMarkup}
        </div>`;
}

function renderLibraryPanelContent() {
    const filtersMarkup = buildLibraryFiltersMarkup();

    if (libraryState.characters.length === 0) {
        return `
            <p class="home-library-subtitle" data-i18n="home_library_subtitle"></p>
            <div class="info-box home-library-info">
                <p data-i18n="made_by_others_info"></p>
            </div>
            ${filtersMarkup}
            <div class="home-empty-state">
                <p data-i18n="${getLibraryEmptyMessageKey()}"></p>
            </div>`;
    }

    return `
            <p class="home-library-subtitle" data-i18n="home_library_subtitle"></p>
            <div class="info-box home-library-info">
                <p data-i18n="made_by_others_info"></p>
            </div>
            ${filtersMarkup}
            <div class="character-list character-list-library">
                ${libraryState.characters.map(getPublicCharacterCardTemplate).join('')}
            </div>
            ${libraryState.hasMore ? `
                <div class="home-load-more-wrap">
                    <button type="button" id="btn-load-more-characters" class="action-button button-secondary" data-i18n="load_more_characters" aria-label="${t('load_more_characters')}"></button>
                </div>
            ` : ''}`;
}

function getPublicProfessionMetadata(professionValue, professionFilterKey) {
    if (professionFilterKey === 'custom') {
        return {
            displayName: professionValue || t('made_by_others_filter_custom'),
            isCustom: true,
            filterKey: 'custom'
        };
    }

    if (professionFilterKey) {
        const meta = resolveProfessionMetadata(professionFilterKey);
        if (!meta.isCustom) {
            return meta;
        }
    }

    return resolveProfessionMetadata(professionValue);
}

function getPublicCharacterCardTemplate(char) {
    const uploadedDate = new Date(char.uploadedAt || char.createdDate);
    const dateStr = uploadedDate.toLocaleDateString();
    const { displayName, isCustom, filterKey } = getPublicProfessionMetadata(
        char.profession,
        char.professionFilterKey
    );
    const agentName = char.name || 'Unnamed';
    const customBadge = isCustom
        ? `<span class="library-custom-badge" data-i18n="library_custom_badge"></span>`
        : '';

    return `
        <div class="character-card character-card-public" data-character-id="${char.id}" data-db-id="${char.id}" data-profession-key="${escapeAttr(filterKey)}" data-profession-custom="${isCustom}">
            <div class="character-card-content">
                <div class="character-card-header">
                    <h4 class="character-name">Agent ${escapeHtml(agentName)}</h4>
                    <button type="button" class="character-report-btn-icon" data-db-id="${char.id}" title="${escapeAttr(t('report_character'))}" aria-label="${escapeAttr(t('aria_report_character', { name: agentName }))}">
                        <span aria-hidden="true">⚑</span>
                        <span class="character-report-btn-label sr-only" data-i18n="report_character"></span>
                    </button>
                </div>
                <div class="character-card-info">
                    <span class="character-profession">${escapeHtml(displayName)}${customBadge}</span>
                    <span class="character-date">${escapeHtml(dateStr)}</span>
                </div>
                ${getCharacterStatsPreview(char)}
            </div>
            <div class="character-card-actions">
                <button type="button" class="character-view-db-btn" data-db-id="${char.id}" data-i18n="view_character" aria-label="${escapeAttr(t('aria_view_character', { name: agentName }))}"></button>
                <button type="button" class="character-load-btn" data-db-id="${char.id}" data-i18n="load_from_database" aria-label="${escapeAttr(t('aria_load_from_database', { name: agentName }))}"></button>
            </div>
        </div>
    `;
}


export function syncLibraryLanguageFilterWithUi(language = getCurrentLanguage()) {
    const normalizedLanguage = SUPPORTED_LIBRARY_LANGUAGES.includes(language) ? language : 'en';
    if (libraryState.languageFilter === normalizedLanguage) {
        return;
    }

    libraryState.languageFilter = normalizedLanguage;
    libraryState.loaded = false;
    libraryState.characters = [];
    libraryState.lastDoc = null;
    libraryState.hasMore = false;
}

export async function renderIntro() {
    try {
        if (window.app?.isLoadingSharedCharacter?.()) {
            return '';
        }

        resetCharacter();
        const allCharacters = getAllCharacters();
        const unfinishedDrafts = getUnfinishedDrafts();
        if (window.app?.isLoadingSharedCharacter?.()) {
            return '';
        }

        const showBanner = shouldShowBanner();

        return `
        <div class="step step-home" id="step-intro">
            ${renderMineSectionMarkup(allCharacters, unfinishedDrafts)}
            ${renderLibrarySectionMarkup()}
            ${showBanner ? `<div class="home-promo-wrap">${renderPromoBannerMarkup(true)}</div>` : ''}
        </div>`;
    } catch (error) {
        console.error('Error rendering intro:', error);
        return `
            <div class="step step-home" id="step-intro">
            </div>`;
    }
}

function closeAllCharacterMenus() {
    document.querySelectorAll('.character-card-menu-dropdown').forEach((dropdown) => {
        dropdown.hidden = true;
    });
    document.querySelectorAll('.character-menu-toggle').forEach((toggle) => {
        toggle.setAttribute('aria-expanded', 'false');
    });
}

function initializeCharacterCardMenus() {
    document.querySelectorAll('.character-menu-toggle').forEach((toggle) => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = toggle.closest('.character-card-menu')?.querySelector('.character-card-menu-dropdown');
            const willOpen = dropdown?.hidden !== false;
            closeAllCharacterMenus();
            if (dropdown && willOpen) {
                dropdown.hidden = false;
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    if (!window.__introMenuCloseBound) {
        document.addEventListener('click', closeAllCharacterMenus);
        window.__introMenuCloseBound = true;
    }
}

function stripCharacterForCache(char) {
    return {
        id: char.id,
        name: char.name,
        profession: char.profession,
        professionFilterKey: char.professionFilterKey,
        language: char.language,
        uploadedAt: char.uploadedAt,
        createdDate: char.createdDate,
        previewStats: char.previewStats ?? null,
        bondCount: char.bondCount ?? 0
    };
}

function readLibraryCache() {
    try {
        const raw = sessionStorage.getItem(LIBRARY_CACHE_PREFIX + getLibraryCacheKey());
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.timestamp > LIBRARY_CACHE_TTL_MS) {
            sessionStorage.removeItem(LIBRARY_CACHE_PREFIX + getLibraryCacheKey());
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

function writeLibraryCache(characters, hasMore, lastDocId) {
    try {
        sessionStorage.setItem(LIBRARY_CACHE_PREFIX + getLibraryCacheKey(), JSON.stringify({
            timestamp: Date.now(),
            characters: characters.map(stripCharacterForCache),
            hasMore,
            lastDocId: lastDocId || null
        }));
    } catch {
        // Ignore quota errors
    }
}

function invalidateLibraryCache() {
    Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith(LIBRARY_CACHE_PREFIX)) {
            sessionStorage.removeItem(key);
        }
    });
}

function paintLibraryPanel() {
    const inner = document.getElementById('library-panel-inner');
    if (!inner) {
        return;
    }

    inner.innerHTML = renderLibraryPanelContent();
    translateAllElements(inner);
    attachLibraryPanelListeners();
}

function appendUniqueLibraryCharacters(characters) {
    const existingIds = new Set(libraryState.characters.map((char) => char.id));
    const uniqueCharacters = characters.filter((char) => !existingIds.has(char.id));
    libraryState.characters = libraryState.characters.concat(uniqueCharacters);
    return uniqueCharacters.length;
}

function applyLibraryFetchResult(result, reset) {
    if (reset) {
        libraryState.characters = result.characters;
    } else {
        appendUniqueLibraryCharacters(result.characters);
    }

    libraryState.lastDoc = result.lastDoc;
    libraryState.lastDocId = result.lastDocId ?? result.lastDoc?.id ?? null;
    libraryState.hasMore = result.hasMore;
}

async function loadLibraryBatch(reset = false) {
    const result = await getPublicCharacters(
        LIBRARY_PAGE_SIZE,
        reset ? null : libraryState.lastDoc,
        libraryState.filter,
        libraryState.languageFilter,
        reset ? null : libraryState.lastDocId
    );

    applyLibraryFetchResult(result, reset);
}

async function fetchLibraryPage(reset = false) {
    const inner = document.getElementById('library-panel-inner');
    if (!inner || libraryState.loading) {
        return;
    }

    if (reset) {
        libraryState.characters = [];
        libraryState.lastDoc = null;
        libraryState.lastDocId = null;
        libraryState.hasMore = true;
        inner.innerHTML = renderLibrarySkeletonMarkup();
    }

    libraryState.loading = true;

    try {
        if (reset) {
            const cached = readLibraryCache();
            if (cached && cached.characters.length > 0) {
                libraryState.characters = cached.characters;
                libraryState.hasMore = cached.hasMore;
                libraryState.lastDoc = null;
                libraryState.lastDocId = cached.lastDocId || null;
                libraryState.loaded = true;
                paintLibraryPanel();
            }
        }

        await loadLibraryBatch(reset);

        if (reset) {
            writeLibraryCache(libraryState.characters, libraryState.hasMore, libraryState.lastDocId);
        }

        libraryState.loaded = true;
        paintLibraryPanel();
    } catch (error) {
        console.error('Error loading public characters:', error);
        inner.innerHTML = `<div class="home-empty-state"><p>${t('load_more_error')}</p></div>`;
    } finally {
        libraryState.loading = false;
    }
}

async function changeLibraryFilter(newFilter) {
    libraryState.filter = newFilter;
    libraryState.loaded = false;
    await fetchLibraryPage(true);
}

async function changeLibraryLanguageFilter(newLanguageFilter) {
    libraryState.languageFilter = newLanguageFilter;
    libraryState.loaded = false;
    await fetchLibraryPage(true);
}

async function importLibraryCharacter(dbId) {
    try {
        const characterDoc = await getPublicCharacterById(dbId);
        if (!characterDoc) {
            alert(t('character_not_found') || 'Character not found.');
            return;
        }

        const characterId = await importCharacterFromDatabase(characterDoc);
        if (characterId) {
            window.app?.scheduleScrollToCharacterOnHome?.(characterId);
        }
        if (window.app?.renderCurrentStep) {
            window.app.renderCurrentStep(true);
        }
    } catch (error) {
        console.error('Error loading character from database:', error);
        alert(t('import_error') || 'Error loading character from database.');
    }
}

function openReportDialog(dbId, characterName) {
    const bodyHtml = `
        <p>${escapeHtml(t('report_modal_intro', { name: characterName }))}</p>
        <fieldset class="report-reasons">
            <legend class="sr-only">${t('report_modal_title')}</legend>
            <label class="report-reason-option">
                <input type="radio" name="report-reason" value="unfinished">
                ${t('report_reason_unfinished')}
            </label>
            <label class="report-reason-option">
                <input type="radio" name="report-reason" value="offensive">
                ${t('report_reason_offensive')}
            </label>
            <label class="report-reason-option">
                <input type="radio" name="report-reason" value="duplicate">
                ${t('report_reason_duplicate')}
            </label>
            <label class="report-reason-option">
                <input type="radio" name="report-reason" value="other">
                ${t('report_reason_other')}
            </label>
        </fieldset>
        <textarea id="report-other-text" class="report-other-text" rows="3" hidden placeholder="${t('report_reason_other_placeholder')}"></textarea>`;

    showModal({
        title: t('report_modal_title'),
        bodyHtml,
        actions: [
            { label: t('report_cancel'), className: 'action-button button-secondary' },
            {
                label: t('report_submit'),
                className: 'action-button',
                closeOnClick: false,
                onClick: async () => {
                    const selected = document.querySelector('input[name="report-reason"]:checked');
                    const otherText = document.getElementById('report-other-text')?.value?.trim() || '';
                    if (!selected) {
                        return;
                    }

                    const reasonLabels = {
                        unfinished: t('report_reason_unfinished'),
                        offensive: t('report_reason_offensive'),
                        duplicate: t('report_reason_duplicate')
                    };

                    const reason = selected.value === 'other'
                        ? otherText
                        : reasonLabels[selected.value] || selected.value;

                    if (reason.length < 3) {
                        return;
                    }

                    try {
                        const success = await reportCharacter(dbId, reason);
                        closeModal();
                        showAlertDialog({
                            title: t('report_modal_title'),
                            message: success ? (t('report_success') || 'Reported.') : (t('report_error') || 'Error reporting.'),
                            closeLabel: t('modal_close')
                        });
                    } catch (error) {
                        console.error('Error reporting character:', error);
                        showAlertDialog({
                            title: t('report_modal_title'),
                            message: t('report_error') || 'Error reporting character.',
                            closeLabel: t('modal_close')
                        });
                    }
                }
            }
        ]
    });

    requestAnimationFrame(() => {
        document.querySelectorAll('input[name="report-reason"]').forEach((radio) => {
            radio.addEventListener('change', () => {
                const otherField = document.getElementById('report-other-text');
                if (!otherField) {
                    return;
                }
                otherField.hidden = radio.value !== 'other' || !radio.checked;
                if (radio.value === 'other' && radio.checked) {
                    otherField.focus();
                }
            });
        });
    });
}

function setupLibraryLazyLoad() {
    if (lazyLoadObserver) {
        lazyLoadObserver.disconnect();
        lazyLoadObserver = null;
    }

    const section = document.getElementById('home-section-library');
    if (!section) {
        return;
    }

    lazyLoadObserver = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
            return;
        }

        lazyLoadObserver.disconnect();
        lazyLoadObserver = null;

        if (libraryState.loaded) {
            paintLibraryPanel();
            return;
        }

        fetchLibraryPage(true);
    }, { rootMargin: '120px' });

    lazyLoadObserver.observe(section);
}

function attachLibraryPanelListeners() {
    document.querySelectorAll('#library-panel-inner .character-view-db-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const dbId = btn.dataset.dbId;
            if (dbId && window.app?.viewDatabaseCharacter) {
                await window.app.viewDatabaseCharacter(dbId);
            }
        });
    });

    document.querySelectorAll('#library-panel-inner .character-load-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const dbId = btn.dataset.dbId;
            if (dbId) {
                await importLibraryCharacter(dbId);
            }
        });
    });

    document.querySelectorAll('#library-panel-inner .character-report-btn-icon').forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            const dbId = btn.dataset.dbId;
            if (!dbId) {
                return;
            }
            const card = btn.closest('.character-card-public');
            const name = card?.querySelector('.character-name')?.textContent?.replace(/^Agent\s+/i, '') || 'Unnamed';
            openReportDialog(dbId, name);
        });
    });

    initializeLibraryLanguageFilter();
    initializeMadeByOthersFilters();

    const btnLoadMore = document.getElementById('btn-load-more-characters');
    if (btnLoadMore && !btnLoadMore.dataset.bound) {
        btnLoadMore.dataset.bound = 'true';
        btnLoadMore.addEventListener('click', handleLoadMoreCharacters);
    }
}

async function handleLoadMoreCharacters() {
    const btnLoadMore = document.getElementById('btn-load-more-characters');
    if (!btnLoadMore || libraryState.loading) {
        return;
    }

    btnLoadMore.disabled = true;
    btnLoadMore.textContent = t('loading') || 'Loading...';

    try {
        await loadLibraryBatch(false);
        paintLibraryPanel();
    } catch (error) {
        console.error('Error loading more characters:', error);
        btnLoadMore.disabled = false;
        btnLoadMore.textContent = t('load_more_characters') || 'Load More';
        alert(t('load_more_error') || 'Error loading more characters. Please try again.');
    }
}

export function attachIntroListeners() {
    // Banner dismissal
    const bannerCloseBtn = document.getElementById('banner-close-btn');
    if (bannerCloseBtn) {
        // Set translated aria-label and title
        const dismissText = t('banner_dismiss');
        bannerCloseBtn.setAttribute('aria-label', dismissText);
        bannerCloseBtn.setAttribute('title', dismissText);
        
        bannerCloseBtn.addEventListener('click', () => {
            const banner = document.getElementById('writersalley-banner');
            if (banner) {
                dismissBanner();
                banner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                banner.style.opacity = '0';
                banner.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    banner.classList.add('hidden');
                }, 300);
            }
        });
    }
    
    // Import JSON button
    const btnImport = document.getElementById('btn-import-json');
    const fileInput = document.getElementById('file-input-json');
    
    if (btnImport && fileInput) {
        btnImport.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (!file.name.endsWith('.json')) {
                alert(t('import_error') || 'Please select a valid JSON file.');
                fileInput.value = '';
                return;
            }
            
            try {
                const text = await file.text();
                const characterData = JSON.parse(text);
                
                // Validate imported character
                const validationResult = validateImportedCharacter(characterData);
                if (!validationResult.valid) {
                    alert(t('import_error') + ': ' + validationResult.error);
                    fileInput.value = '';
                    return;
                }
                
                // Import character
                const characterName = characterData.personalInfo?.name || 'Unnamed Agent';
                let professionName = 'Unknown';
                if (characterData.professionKey) {
                    // Profession name will be resolved from config if needed
                    professionName = characterData.customProfessionName || characterData.professionKey;
                }
                
                const characterToImport = {
                    name: characterName,
                    profession: professionName,
                    data: characterData
                };
                
                const characterId = importCharacter(characterToImport);

                if (characterId) {
                    window.app?.scheduleScrollToCharacterOnHome?.(characterId);
                }

                if (window.app?.renderCurrentStep) {
                    window.app.renderCurrentStep(true);
                }
            } catch (error) {
                console.error('Error importing character:', error);
                alert(t('import_error') || 'Error importing character. Please check the file format.');
            } finally {
                fileInput.value = '';
            }
        });
    }
    
    document.querySelectorAll('.character-print-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const characterId = btn.dataset.characterId;
            if (characterId && window.app?.viewCharacterAndPrint) {
                window.app.viewCharacterAndPrint(characterId);
            }
        });
    });

    document.querySelectorAll('.character-open-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const characterId = btn.dataset.characterId;
            if (characterId && window.app?.viewCharacter) {
                window.app.viewCharacter(characterId);
            }
        });
    });

    document.querySelectorAll('.character-continue-draft-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const draftId = btn.dataset.draftId;
            if (draftId && window.app?.continueUnfinishedDraft) {
                window.app.continueUnfinishedDraft(draftId);
            }
        });
    });

    document.querySelectorAll('.character-discard-draft-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllCharacterMenus();
            const draftId = e.currentTarget.dataset.draftId;
            if (draftId && window.app?.discardUnfinishedDraft) {
                window.app.discardUnfinishedDraft(draftId);
            }
        });
    });

    // Delete character buttons
    document.querySelectorAll('.character-delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            closeAllCharacterMenus();
            const characterId = e.currentTarget.dataset.characterId;
            if (!characterId) {
                return;
            }
            const character = getAllCharacters().find(c => c.id === characterId);
            const characterName = character?.name ? `Agent ${character.name}` : 'this character';
            const confirmed = await showConfirmDialog({
                title: t('delete_character'),
                message: t('confirm_delete_character', { name: characterName }),
                confirmLabel: t('delete_character'),
                cancelLabel: t('modal_cancel'),
                danger: true
            });
            if (confirmed && deleteCharacter(characterId)) {
                if (window.app && window.app.renderCurrentStep) {
                    window.app.renderCurrentStep(true);
                }
            }
        });
    });

    // Rename character buttons
    document.querySelectorAll('.character-rename-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const characterId = e.target.dataset.characterId;
            const nameElement = document.querySelector(`.character-name[data-character-id="${characterId}"]`);
            if (!nameElement || !characterId) {
                return;
            }
            const currentName = nameElement.textContent;
            const newName = await showPromptDialog({
                title: t('edit_name'),
                label: t('enter_new_name'),
                defaultValue: currentName,
                confirmLabel: t('modal_save'),
                cancelLabel: t('modal_cancel')
            });
            if (newName && newName !== currentName) {
                if (updateCharacterName(characterId, newName)) {
                    if (window.app && window.app.renderCurrentStep) {
                        window.app.renderCurrentStep(true);
                    }
                }
            }
        });
    });

    initializeCharacterCardMenus();

    setupLibraryLazyLoad();

    const refreshBtn = document.getElementById('btn-library-refresh');
    if (refreshBtn && !refreshBtn.dataset.bound) {
        refreshBtn.dataset.bound = 'true';
        refreshBtn.addEventListener('click', () => {
            invalidateLibraryCache();
            libraryState.loaded = false;
            fetchLibraryPage(true);
        });
    }
}

function initializeLibraryLanguageFilter() {
    const languageSelect = document.getElementById('library-language-filter');
    if (!languageSelect || languageSelect.dataset.bound) {
        return;
    }

    languageSelect.dataset.bound = 'true';
    languageSelect.addEventListener('change', () => {
        const selectedLanguage = languageSelect.value || DEFAULT_LANGUAGE_FILTER;
        if (selectedLanguage === libraryState.languageFilter) {
            return;
        }
        changeLibraryLanguageFilter(selectedLanguage);
    });
}

function initializeMadeByOthersFilters() {
    const filterContainer = document.querySelector('#library-panel-inner .made-by-others-filters');
    if (!filterContainer || filterContainer.dataset.bound) {
        return;
    }

    filterContainer.dataset.bound = 'true';
    const buttons = Array.from(filterContainer.querySelectorAll('.profession-filter-btn'));

    filterContainer.addEventListener('keydown', (event) => {
        const currentIndex = buttons.findIndex((btn) => btn === document.activeElement);
        if (currentIndex === -1) {
            return;
        }

        let nextIndex = currentIndex;
        if (event.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % buttons.length;
        } else if (event.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        } else {
            return;
        }

        event.preventDefault();
        buttons[nextIndex].focus();
    });

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const selectedFilter = button.dataset.filter || DEFAULT_PROFESSION_FILTER;
            if (selectedFilter === libraryState.filter) {
                return;
            }
            changeLibraryFilter(selectedFilter);
        });
    });
}

