// Auto-save, dirty tracking, and leave confirmation for editable agent sheets

import { t } from '../i18n/i18n.js?v=eb448c0';
import { showModal, closeModal } from './modal.js?v=eb448c0';
import { saveLocalSheetCharacter, collectSheetEditsFromDOM } from './sheet-edit.js?v=eb448c0';

const AUTO_SAVE_DELAY_MS = 2000;

let sheetDirty = false;
let activeSheetCharacterId = null;
let autoSaveTimer = null;
let sheetInputHandler = null;

function onSheetBeforeUnload(event) {
    if (!sheetDirty) {
        return;
    }
    event.preventDefault();
    event.returnValue = '';
}

function bindBeforeUnload() {
    if (window.__sheetBeforeUnloadBound) {
        return;
    }
    window.addEventListener('beforeunload', onSheetBeforeUnload);
    window.__sheetBeforeUnloadBound = true;
}

export function isSheetDirty() {
    return sheetDirty;
}

export function markSheetDirty() {
    sheetDirty = true;
    updateSaveStatus('dirty');
}

export function clearSheetDirty() {
    sheetDirty = false;
}

export function resetSheetEditState() {
    sheetDirty = false;
    activeSheetCharacterId = null;
    clearTimeout(autoSaveTimer);
    autoSaveTimer = null;

    const summary = document.getElementById('step5-summary');
    if (summary && sheetInputHandler) {
        summary.removeEventListener('input', sheetInputHandler);
        summary.removeEventListener('change', sheetInputHandler);
    }
    sheetInputHandler = null;
    hideSaveStatus();
}

export function updateSaveStatus(state) {
    const statusEl = document.querySelector('[data-sheet-save-status]');
    if (!statusEl) {
        return;
    }

    const messages = {
        idle: t('sheet_autosave_hint'),
        dirty: t('sheet_save_status_dirty'),
        saving: t('sheet_save_status_saving'),
        saved: t('sheet_save_status_saved'),
        error: t('sheet_save_status_error')
    };

    const message = messages[state] || messages.idle;
    statusEl.textContent = message;
    statusEl.hidden = false;
    statusEl.dataset.status = state || 'idle';
}

function hideSaveStatus() {
    const statusEl = document.querySelector('[data-sheet-save-status]');
    if (statusEl) {
        statusEl.textContent = '';
        statusEl.hidden = true;
        delete statusEl.dataset.status;
    }
}

function updateSheetHeaderName(name) {
    const header = document.querySelector('.sheet-header h2');
    if (header && name) {
        header.textContent = `Agent ${name}`;
    }
}

export function scheduleAutoSave() {
    if (!activeSheetCharacterId) {
        return;
    }

    updateSaveStatus('dirty');
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        updateSaveStatus('saving');
        const result = saveLocalSheetCharacter(activeSheetCharacterId);
        if (result.ok) {
            clearSheetDirty();
            updateSaveStatus('saved');
            updateSheetHeaderName(result.name);
        } else {
            markSheetDirty();
            updateSaveStatus('error');
        }
    }, AUTO_SAVE_DELAY_MS);
}

export function queueSheetAutoSave() {
    markSheetDirty();
    scheduleAutoSave();
}

export function initSheetAutoSave(characterId) {
    if (!characterId) {
        return;
    }

    activeSheetCharacterId = characterId;
    bindBeforeUnload();

    const summary = document.getElementById('step5-summary');
    if (!summary?.classList.contains('sheet-summary-editable')) {
        return;
    }

    if (sheetInputHandler) {
        summary.removeEventListener('input', sheetInputHandler);
        summary.removeEventListener('change', sheetInputHandler);
    }

    sheetInputHandler = () => {
        markSheetDirty();
        scheduleAutoSave();
    };

    summary.addEventListener('input', sheetInputHandler);
    summary.addEventListener('change', sheetInputHandler);
    updateSaveStatus('idle');
}

export function notifySheetSaved(name) {
    clearSheetDirty();
    clearTimeout(autoSaveTimer);
    autoSaveTimer = null;
    updateSaveStatus('saved');
    if (name) {
        updateSheetHeaderName(name);
    }
}

export function confirmLeaveSheetIfDirty() {
    if (!sheetDirty) {
        return Promise.resolve(true);
    }

    return new Promise((resolve) => {
        showModal({
            title: t('sheet_unsaved_title'),
            bodyHtml: `<p>${t('sheet_unsaved_message')}</p>`,
            actions: [
                {
                    label: t('sheet_unsaved_stay'),
                    className: 'action-button button-secondary',
                    onClick: () => resolve(false)
                },
                {
                    label: t('sheet_unsaved_discard'),
                    className: 'action-button app-modal-btn-danger',
                    onClick: () => {
                        clearSheetDirty();
                        resolve(true);
                    }
                },
                {
                    label: t('sheet_unsaved_save'),
                    className: 'action-button',
                    closeOnClick: false,
                    onClick: () => {
                        if (!activeSheetCharacterId) {
                            resolve(true);
                            closeModal();
                            return;
                        }
                        const result = saveLocalSheetCharacter(activeSheetCharacterId);
                        if (result.ok) {
                            notifySheetSaved(result.name);
                            closeModal();
                            resolve(true);
                            return;
                        }
                        updateSaveStatus('error');
                    }
                }
            ]
        });
    });
}

export function isLeavingSheetView(navState, currentCharacterId) {
    if (!currentCharacterId || !sheetDirty) {
        return false;
    }
    return !(navState.mode === 'view-local' && navState.characterId === currentCharacterId);
}

export function syncSheetBeforePrint() {
    if (activeSheetCharacterId) {
        collectSheetEditsFromDOM();
    }
}
