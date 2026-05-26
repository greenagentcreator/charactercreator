// Unified toolbar for agent sheet view (local + library characters)

import { t } from '../i18n/i18n.js?v=27a0927';
import { createShareableUrl, copyToClipboard } from '../utils/sharing.js?v=27a0927';
import { getCharacterById, deleteCharacter } from '../utils/storage.js?v=27a0927';
import { importCharacterFromDatabase, reportCharacter } from '../utils/database.js?v=27a0927';
import { collectSheetEditsFromDOM, escapeHtml } from '../utils/sheet-edit.js?v=27a0927';
import { getCharacter } from '../model/character.js?v=27a0927';
import { showConfirmDialog, showAlertDialog, showPromptDialog } from '../utils/modal.js?v=27a0927';
import { resetSheetEditState, notifySheetSaved } from '../utils/sheet-autosave.js?v=27a0927';
import { resetLocalSheetToBaseline } from '../utils/sheet-baseline.js?v=27a0927';
import { reloadCharacterSheetView } from '../steps/step-character-view.js?v=27a0927';

/**
 * @param {{ isDatabase?: boolean, canSave?: boolean }} options
 */
export function renderSheetToolbar({ isDatabase = false, canSave = false } = {}) {
    const importBtn = isDatabase
        ? `<button type="button" class="sheet-toolbar-btn sheet-toolbar-btn-primary" data-sheet-action="import" data-i18n="load_from_database" aria-label="${t('load_from_database')}"></button>`
        : '';

    const resetMenuItem = canSave
        ? `<button type="button" class="sheet-toolbar-menu-item sheet-toolbar-menu-item-danger" data-sheet-action="reset-sheet" data-i18n="btn_reset_sheet"></button>`
        : '';

    const dangerMenuItem = isDatabase
        ? `<button type="button" class="sheet-toolbar-menu-item sheet-toolbar-menu-item-danger" data-sheet-action="report" data-i18n="report_character"></button>`
        : `<button type="button" class="sheet-toolbar-menu-item sheet-toolbar-menu-item-danger" data-sheet-action="delete" data-i18n="delete_character"></button>`;

    return `
        <nav class="sheet-toolbar" role="toolbar" aria-label="${t('sheet_toolbar_aria_label')}">
            <div class="sheet-toolbar-inner">
                <div class="sheet-toolbar-actions">
                    ${importBtn}
                    <button type="button" class="sheet-toolbar-btn" data-sheet-action="share" data-i18n="share_character" aria-label="${t('aria_share_character')}"></button>
                    <button type="button" class="sheet-toolbar-btn sheet-toolbar-btn-accent" data-sheet-action="print" data-i18n="btn_print_character" aria-label="${t('aria_print_summary')}"></button>
                </div>
                <div class="sheet-toolbar-overflow">
                    <button type="button" class="sheet-toolbar-more" data-sheet-action="menu-toggle" aria-haspopup="true" aria-expanded="false" aria-label="${t('sheet_toolbar_more')}">⋮</button>
                    <div class="sheet-toolbar-menu" hidden>
                        ${resetMenuItem}
                        <button type="button" class="sheet-toolbar-menu-item" data-sheet-action="export" data-i18n="btn_export_json"></button>
                        ${dangerMenuItem}
                    </div>
                </div>
            </div>
        </nav>`;
}

function closeSheetToolbarMenu() {
    document.querySelectorAll('.sheet-toolbar-menu').forEach((menu) => {
        menu.hidden = true;
    });
    document.querySelectorAll('.sheet-toolbar-more').forEach((btn) => {
        btn.setAttribute('aria-expanded', 'false');
    });
}

function getSheetActionButtons(action) {
    return Array.from(document.querySelectorAll(`[data-sheet-action="${action}"]`));
}

/**
 * @param {string|null} characterId
 * @param {object|null} characterData
 */
export function attachSheetToolbarListeners(characterId, characterData = null) {
    if (!characterData && characterId) {
        characterData = getCharacterById(characterId);
    }

    const menuToggle = document.querySelector('.sheet-toolbar-more');
    const menu = document.querySelector('.sheet-toolbar-menu');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = menu.hidden;
            closeSheetToolbarMenu();
            if (willOpen) {
                menu.hidden = false;
                menuToggle.setAttribute('aria-expanded', 'true');
            }
        });
    }

    if (!window.__sheetToolbarMenuCloseBound) {
        document.addEventListener('click', closeSheetToolbarMenu);
        window.__sheetToolbarMenuCloseBound = true;
    }

    getSheetActionButtons('home').forEach((btn) => {
        btn.addEventListener('click', () => {
            window.app?.returnToList?.();
        });
    });

    getSheetActionButtons('print').forEach((btn) => {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (isSafari && btn.hasAttribute('data-i18n')) {
            btn.textContent = t('btn_print_safari_hint');
        }
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.app?.triggerSheetPrint) {
                window.app.triggerSheetPrint();
            } else {
                window.app?.prepareSheetForPrint?.();
                window.print();
            }
        });
    });

    if (!characterData) return;

    const actualCharacterData = characterData.data || characterData;

    getSheetActionButtons('reset-sheet').forEach((btn) => {
        btn.addEventListener('click', async () => {
            closeSheetToolbarMenu();
            if (!characterId) {
                return;
            }

            const confirmed = await showConfirmDialog({
                title: t('sheet_reset_title'),
                bodyHtml: `
                    <p>${escapeHtml(t('sheet_reset_warning_lead'))}</p>
                    <ul class="app-modal-warning-list">
                        <li>${escapeHtml(t('sheet_reset_warning_item_stats'))}</li>
                        <li>${escapeHtml(t('sheet_reset_warning_item_skills'))}</li>
                        <li>${escapeHtml(t('sheet_reset_warning_item_derived'))}</li>
                        <li>${escapeHtml(t('sheet_reset_warning_item_bonds'))}</li>
                        <li>${escapeHtml(t('sheet_reset_warning_item_marks'))}</li>
                    </ul>
                    <p class="app-modal-warning-final"><strong>${escapeHtml(t('sheet_reset_warning_final'))}</strong></p>`,
                confirmLabel: t('sheet_reset_confirm'),
                cancelLabel: t('modal_cancel'),
                danger: true
            });

            if (!confirmed) {
                return;
            }

            btn.disabled = true;
            try {
                const result = resetLocalSheetToBaseline(characterId);
                if (!result.ok) {
                    showAlertDialog({
                        title: t('sheet_reset_title'),
                        message: t('sheet_reset_error'),
                        closeLabel: t('modal_close')
                    });
                    return;
                }

                resetSheetEditState();
                reloadCharacterSheetView(characterId);
                notifySheetSaved(result.name);
            } finally {
                btn.disabled = false;
            }
        });
    });

    function getExportCharacterData() {
        if (characterId) {
            collectSheetEditsFromDOM();
            return getCharacter();
        }
        return actualCharacterData;
    }

    getSheetActionButtons('share').forEach((btn) => {
        btn.addEventListener('click', async () => {
            closeSheetToolbarMenu();
            try {
                const shareableUrl = createShareableUrl(getExportCharacterData());
                const success = await copyToClipboard(shareableUrl);
                if (success) {
                    showAlertDialog({
                        title: t('share_character'),
                        message: t('share_url_copied'),
                        closeLabel: t('modal_close')
                    });
                } else {
                    showPromptDialog({
                        title: t('share_character'),
                        label: t('share_copy_manually'),
                        defaultValue: shareableUrl,
                        confirmLabel: t('modal_close'),
                        cancelLabel: t('modal_cancel')
                    });
                }
            } catch (error) {
                console.error('Error sharing character:', error);
                showAlertDialog({
                    title: t('share_character'),
                    message: t('share_error') || 'Error creating shareable link.',
                    closeLabel: t('modal_close')
                });
            }
        });
    });

    getSheetActionButtons('export').forEach((btn) => {
        btn.addEventListener('click', () => {
            closeSheetToolbarMenu();
            const jsonData = JSON.stringify(getExportCharacterData(), null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `delta_green_character_${characterData.name || 'unnamed'}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    });

    getSheetActionButtons('import').forEach((btn) => {
        btn.addEventListener('click', async () => {
            closeSheetToolbarMenu();
            btn.disabled = true;
            try {
                const characterDoc = {
                    name: characterData.name,
                    profession: characterData.profession,
                    data: actualCharacterData
                };
                const importedId = await importCharacterFromDatabase(characterDoc);
                showAlertDialog({
                    title: t('load_from_database'),
                    message: t('import_success') || 'Character imported successfully!',
                    closeLabel: t('modal_close')
                });
                if (importedId && window.app?.viewCharacter) {
                    window.app.viewCharacter(importedId);
                } else {
                    window.app?.returnToList?.();
                }
            } catch (error) {
                console.error('Error importing character:', error);
                showAlertDialog({
                    title: t('load_from_database'),
                    message: t('import_error') || 'Error importing character.',
                    closeLabel: t('modal_close')
                });
            } finally {
                btn.disabled = false;
            }
        });
    });

    getSheetActionButtons('report').forEach((btn) => {
        btn.addEventListener('click', async () => {
            closeSheetToolbarMenu();
            if (!characterData?.dbId) return;

            const reason = await showPromptDialog({
                title: t('report_character'),
                label: t('report_reason_prompt') || 'Please provide a reason:',
                confirmLabel: t('report_submit'),
                cancelLabel: t('modal_cancel')
            });

            if (!reason) return;

            btn.disabled = true;
            try {
                const success = await reportCharacter(characterData.dbId, reason);
                showAlertDialog({
                    title: t('report_character'),
                    message: success ? (t('report_success') || 'Reported.') : (t('report_error') || 'Error reporting.'),
                    closeLabel: t('modal_close')
                });
            } catch (error) {
                console.error('Error reporting character:', error);
                showAlertDialog({
                    title: t('report_character'),
                    message: t('report_error') || 'Error reporting character.',
                    closeLabel: t('modal_close')
                });
            } finally {
                btn.disabled = false;
            }
        });
    });

    getSheetActionButtons('delete').forEach((btn) => {
        btn.addEventListener('click', async () => {
            closeSheetToolbarMenu();
            if (!characterId) return;

            const charData = getCharacterById(characterId);
            const characterName = charData?.name ? `Agent ${charData.name}` : 'this character';
            const confirmed = await showConfirmDialog({
                title: t('delete_character'),
                message: t('confirm_delete_character', { name: characterName }),
                confirmLabel: t('delete_character'),
                cancelLabel: t('modal_cancel'),
                danger: true
            });

            if (confirmed && deleteCharacter(characterId)) {
                resetSheetEditState();
                window.app?.returnToList?.();
            }
        });
    });
}
