// Character View - Agent sheet (read-only dossier + toolbar)

import { getCharacterById, saveCharacter } from '../utils/storage.js?v=1a58e28';
import { setCharacter } from '../model/character.js?v=1a58e28';
import { renderStep5_Summary } from './step5-summary.js?v=1a58e28';
import { t, translateAllElements } from '../i18n/i18n.js?v=1a58e28';
import { renderSheetToolbar, attachSheetToolbarListeners } from '../components/sheet-toolbar.js?v=1a58e28';
import { attachSheetEditListeners, collectSheetEditsFromDOM, escapeHtml } from '../utils/sheet-edit.js?v=1a58e28';
import { initSheetAutoSave, resetSheetEditState, notifySheetSaved } from '../utils/sheet-autosave.js?v=1a58e28';
import { attachSheetRollListeners } from '../utils/sheet-rolls.js?v=1a58e28';
import { ensureSheetBaseline } from '../utils/sheet-baseline.js?v=1a58e28';
import { dismissRollResult } from '../components/roll-bubble.js?v=1a58e28';
import { maybeShowSheetOnboarding } from '../utils/sheet-onboarding.js?v=1a58e28';

const SHEET_PRINT_ROOT_ID = 'sheet-print-root';

function attachSheetEditing(characterId) {
    attachSheetEditListeners();
    initSheetAutoSave(characterId);
    attachSheetRollListeners();
}

let sheetPrintListenersBound = false;
let activePrintCharacterId = null;
let printSessionActive = false;
let printStartedAt = 0;
let printMediaQuery = null;

function ensureSheetPrintRoot() {
    let root = document.getElementById(SHEET_PRINT_ROOT_ID);
    if (!root) {
        root = document.createElement('div');
        root.id = SHEET_PRINT_ROOT_ID;
        root.className = 'sheet-print-root';
        root.setAttribute('aria-hidden', 'true');
        document.body.appendChild(root);
    }
    return root;
}

function clearSheetPrintRoot() {
    printSessionActive = false;
    printStartedAt = 0;
    const root = document.getElementById(SHEET_PRINT_ROOT_ID);
    if (root) {
        root.innerHTML = '';
        root.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('sheet-print-active');
}

function prepareSheetPrintRoot() {
    const summaryEl = document.getElementById('step5-summary');
    if (!summaryEl?.classList.contains('sheet-summary')) {
        return false;
    }

    if (summaryEl.classList.contains('sheet-summary-editable')) {
        collectSheetEditsFromDOM();
    }

    const root = ensureSheetPrintRoot();
    root.innerHTML = renderStep5_Summary({ context: 'sheet', editable: false, printLayout: true });
    root.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sheet-print-active');
    printSessionActive = true;
    printStartedAt = Date.now();
    translateAllElements(root);
    return true;
}

/**
 * Chromium fires afterprint as soon as the preview opens (not when it closes).
 * Never tear down while @media print still matches, and ignore early afterprint.
 */
function requestClearSheetPrintRoot(reason) {
    if (!printSessionActive) {
        return;
    }

    const ageMs = Date.now() - printStartedAt;
    if (reason === 'afterprint' && ageMs < 800) {
        return;
    }

    if (window.matchMedia('print').matches) {
        return;
    }

    clearSheetPrintRoot();
}

function onSheetBeforePrint() {
    prepareSheetPrintRoot();
}

function onSheetAfterPrint() {
    requestClearSheetPrintRoot('afterprint');
}

function onPrintMediaChange(event) {
    if (!event.matches) {
        requestClearSheetPrintRoot('print-media-end');
    }
}

function onPrintSessionKeydown(event) {
    if (!printSessionActive) {
        return;
    }
    if (event.key === 'Escape') {
        clearSheetPrintRoot();
    }
}

function bindSheetPrintListeners(characterId) {
    activePrintCharacterId = characterId;

    if (sheetPrintListenersBound) {
        return;
    }

    window.addEventListener('beforeprint', onSheetBeforePrint);
    window.addEventListener('afterprint', onSheetAfterPrint);
    document.addEventListener('keydown', onPrintSessionKeydown);

    printMediaQuery = window.matchMedia('print');
    if (typeof printMediaQuery.addEventListener === 'function') {
        printMediaQuery.addEventListener('change', onPrintMediaChange);
    } else if (typeof printMediaQuery.addListener === 'function') {
        printMediaQuery.addListener(onPrintMediaChange);
    }

    sheetPrintListenersBound = true;
}

export function prepareSheetSummaryForPrint() {
    prepareSheetPrintRoot();
}

export function triggerSheetPrint() {
    if (!prepareSheetPrintRoot()) {
        return;
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const delay = isMobile ? 350 : 50;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            window.setTimeout(() => {
                const printCallStarted = Date.now();
                window.print();
                const printBlockedMs = Date.now() - printCallStarted;

                // Firefox blocks until the dialog closes. Chromium returns immediately
                // and must keep the print root until print media ends / late afterprint.
                if (printBlockedMs > 300) {
                    requestClearSheetPrintRoot('post-print');
                }
            }, delay);
        });
    });
}

export function restoreSheetSummaryAfterPrint() {
    clearSheetPrintRoot();
}

function syncSheetStickySpacer() {
    const step = document.getElementById('step-character-view');
    const bar = step?.querySelector('.sheet-sticky-top');
    if (!step || !bar) {
        return;
    }

    const height = bar.offsetHeight;
    step.style.setProperty('--sheet-sticky-height', `${height}px`);
}

function bindSheetStickyLayoutSync() {
    syncSheetStickySpacer();

    const bar = document.querySelector('#step-character-view .sheet-sticky-top');
    if (bar && !bar.__sheetStickyResizeObserved && typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(() => syncSheetStickySpacer());
        observer.observe(bar);
        bar.__sheetStickyResizeObserved = true;
    }

    if (window.__sheetStickyLayoutSyncBound) {
        return;
    }

    window.addEventListener('resize', syncSheetStickySpacer);
    window.__sheetStickyLayoutSyncBound = true;
}

export function renderCharacterView(characterId, characterData = null) {
    if (!characterData) {
        characterData = getCharacterById(characterId);
    }

    if (!characterData) {
        return `
            <div class="step step-sheet" id="step-character-view">
                <div class="error-message">
                    <p data-i18n="character_not_found"></p>
                    <button class="action-button" onclick="window.app.returnToList()" data-i18n="back_to_list"></button>
                </div>
            </div>`;
    }

    const actualCharacterData = characterData.data || characterData;
    setCharacter(actualCharacterData);

    const isDatabaseCharacter = !characterId;
    const canEdit = !!characterId;
    const agentName = characterData.name || actualCharacterData.personalInfo?.name || 'Unnamed';
    const summaryHtml = renderStep5_Summary({ context: 'sheet', editable: canEdit });
    const toolbarHtml = renderSheetToolbar({ isDatabase: isDatabaseCharacter, canSave: canEdit });
    const saveStatusHtml = canEdit
        ? `<p class="sheet-save-status" data-sheet-save-status role="status" aria-live="polite" aria-atomic="true" data-status="idle">${escapeHtml(t('sheet_autosave_hint'))}</p>`
        : '';

    return `
        <div class="step step-sheet" id="step-character-view">
            <div class="sheet-sticky-top">
                <header class="sheet-header">
                    <button type="button" class="sheet-toolbar-back" data-sheet-action="home" aria-label="${t('aria_back_to_list')}">
                        <span aria-hidden="true">←</span>
                    </button>
                    <h2>Agent ${escapeHtml(agentName)}</h2>
                </header>
                ${toolbarHtml}
                ${saveStatusHtml}
            </div>
            <div class="sheet-sticky-spacer" aria-hidden="true"></div>
            ${summaryHtml}
        </div>`;
}

export function reloadCharacterSheetView(characterId) {
    const characterData = getCharacterById(characterId);
    if (!characterData) {
        return false;
    }

    dismissRollResult();
    const step = document.getElementById('step-character-view');
    if (!step?.parentElement) {
        return false;
    }

    const actualCharacterData = characterData.data || characterData;
    setCharacter(actualCharacterData);

    step.outerHTML = renderCharacterView(characterId, characterData);
    translateAllElements(document.getElementById('step-character-view'));
    attachCharacterViewListeners(characterId, characterData);
    return true;
}

export function attachCharacterViewListeners(characterId, characterData = null) {
    clearSheetPrintRoot();

    if (!characterData && characterId) {
        characterData = getCharacterById(characterId);
    }

    if (characterId && characterData?.data) {
        if (ensureSheetBaseline(characterData.data)) {
            saveCharacter({
                ...characterData,
                data: characterData.data
            });
        }
    }

    attachSheetToolbarListeners(characterId, characterData);
    bindSheetPrintListeners(characterId);
    bindSheetStickyLayoutSync();
    if (characterId) {
        resetSheetEditState();
        attachSheetEditing(characterId);
        maybeShowSheetOnboarding();
    }
}
