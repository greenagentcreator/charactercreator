// Character View - Read-only character sheet view

import { getCharacterById, deleteCharacter } from '../utils/storage.js';
import { setCharacter } from '../model/character.js';
import { renderStep5_Summary } from './step5-summary.js';
import { t } from '../i18n/i18n.js';
import { createShareableUrl, copyToClipboard } from '../utils/sharing.js';
import { importCharacterFromDatabase, reportCharacter } from '../utils/database.js';

export function renderCharacterView(characterId, characterData = null) {
    // If characterData is provided, use it (for database characters)
    // Otherwise, get from localStorage
    if (!characterData) {
        characterData = getCharacterById(characterId);
    }
    
    if (!characterData) {
        return `
            <div class="step" id="step-character-view">
                <div class="error-message">
                    <p data-i18n="character_not_found"></p>
                    <button class="action-button" onclick="window.app.returnToList()" data-i18n="back_to_list"></button>
                </div>
            </div>`;
    }
    
    // Load character data into the character model
    // characterData.data contains the actual character object, or characterData itself if it's already the data
    const actualCharacterData = characterData.data || characterData;
    setCharacter(actualCharacterData);
    
    // Render the summary view
    const summaryHtml = renderStep5_Summary();
    
    // Determine if this is a database character (no delete button)
    // Database characters don't have a local ID, so characterId will be null
    const isDatabaseCharacter = !characterId;
    
    const includeReport = isDatabaseCharacter && characterData?.dbId;
    
    const renderActionButtons = (position, { includeImport = false, includeDelete = false, includeReport = false } = {}) => `
                <div class="character-view-actions character-view-actions-${position}">
                    ${includeImport ? `<button type="button" class="action-button button-secondary" data-character-view-action="import" data-i18n="import_character" aria-label="${t('aria_import_character')}"></button>` : ''}
                    <button type="button" class="action-button button-secondary" data-character-view-action="share" data-i18n="share_character" aria-label="${t('aria_share_character')}"></button>
                    <button type="button" class="action-button button-secondary" data-character-view-action="print" data-i18n="btn_print_summary" aria-label="${t('aria_print_summary')}" onclick="window.print(); return false;"></button>
                    <button type="button" class="action-button button-secondary" data-character-view-action="export" data-i18n="btn_export_json" aria-label="${t('aria_export_json')}"></button>
                    ${includeReport ? `<button type="button" class="character-report-btn-icon character-view-report-btn" data-character-view-action="report" title="${t('report_character')}" aria-label="${t('aria_report_character', { name: characterData.name || 'Unnamed' })}">⚑</button>` : ''}
                    ${includeDelete ? `<button type="button" class="action-button character-delete-btn-view" data-character-view-action="delete" data-i18n="delete_character" aria-label="${t('aria_delete_character', { name: characterData.name || 'Unnamed' })}"></button>` : ''}
                    <button type="button" class="action-button" data-character-view-action="back" data-i18n="back_to_list" aria-label="${t('aria_back_to_list')}"></button>
                </div>`;
    
    const topActions = renderActionButtons('top', { includeImport: isDatabaseCharacter, includeDelete: !isDatabaseCharacter, includeReport });
    const bottomActions = isDatabaseCharacter ? renderActionButtons('bottom', { includeImport: true, includeReport }) : '';
    
    // Wrap it with view-specific controls
    const html = `
        <div class="step" id="step-character-view">
            <div class="character-view-header">
                <h2>Agent ${characterData.name || 'Unnamed'}</h2>
                ${topActions}
            </div>
            ${summaryHtml}
            ${bottomActions}
        </div>`;
    
    return html;
}

export function attachCharacterViewListeners(characterId, characterData = null) {
    // Get character data if not provided
    if (!characterData && characterId) {
        characterData = getCharacterById(characterId);
    }
    
    const getActionButtons = (action) => Array.from(document.querySelectorAll(`[data-character-view-action="${action}"]`));
    
    // Share button
    const shareButtons = getActionButtons('share');
    if (shareButtons.length && characterData) {
        shareButtons.forEach((btn) => {
            btn.addEventListener('click', async () => {
                try {
                    // Get the actual character data (either from .data property or characterData itself)
                    const actualCharacterData = characterData.data || characterData;
                    const shareableUrl = createShareableUrl(actualCharacterData);
                    const success = await copyToClipboard(shareableUrl);
                    if (success) {
                        alert(t('share_url_copied'));
                    } else {
                        // Fallback: show URL in prompt
                        prompt(t('share_character'), shareableUrl);
                    }
                } catch (error) {
                    console.error('Error sharing character:', error);
                    alert(t('share_error') || 'Error creating shareable link. Character data may be too large.');
                }
            });
        });
    }
    
    // Print button - using onclick attribute for better Safari compatibility
    // The onclick is already set in the HTML, but we can also add event listener as fallback
    const printButtons = getActionButtons('print');
    if (printButtons.length) {
        // Detect Safari and change button text
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        printButtons.forEach((btn) => {
            if (isSafari) {
                btn.textContent = 'print with cmd + p';
            }
            
            if (!btn.onclick) {
                // Fallback if onclick wasn't set
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.print();
                });
            }
        });
    }
    
    // Export JSON button
    const exportButtons = getActionButtons('export');
    if (exportButtons.length && characterData) {
        exportButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                // Get the actual character data (either from .data property or characterData itself)
                const actualCharacterData = characterData.data || characterData;
                const jsonData = JSON.stringify(actualCharacterData, null, 2);
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
    }
    
    // Import buttons (only visible for database characters)
    const importButtons = getActionButtons('import');
    if (importButtons.length && characterData) {
        importButtons.forEach((btn) => {
            btn.addEventListener('click', async () => {
                btn.disabled = true;
                try {
                    const characterDoc = {
                        name: characterData.name,
                        profession: characterData.profession,
                        data: characterData.data || characterData
                    };
                    const importedId = await importCharacterFromDatabase(characterDoc);
                    alert(t('import_success') || 'Character imported successfully!');
                    
                    if (importedId && window.app?.viewCharacter) {
                        window.app.viewCharacter(importedId);
                    } else if (window.app?.returnToList) {
                        window.app.returnToList();
                    }
                } catch (error) {
                    console.error('Error importing character:', error);
                    alert(t('import_error') || 'Error importing character.');
                } finally {
                    btn.disabled = false;
                }
            });
        });
    }
    
    // Report button (only for database characters)
    const reportButtons = getActionButtons('report');
    if (reportButtons.length && characterData?.dbId) {
        reportButtons.forEach((btn) => {
            btn.addEventListener('click', async () => {
                const reasonPrompt = t('report_reason_prompt') || 'Please provide a reason for reporting this character:';
                const reason = prompt(reasonPrompt);
                if (!reason || !reason.trim()) {
                    return;
                }
                
                btn.disabled = true;
                try {
                    const success = await reportCharacter(characterData.dbId, reason.trim());
                    if (success) {
                        alert(t('report_success') || 'Thank you for reporting. The character has been flagged for review.');
                    } else {
                        alert(t('report_error') || 'Error reporting character. Please try again later.');
                    }
                } catch (error) {
                    console.error('Error reporting character:', error);
                    alert(t('report_error') || 'Error reporting character. Please try again later.');
                } finally {
                    btn.disabled = false;
                }
            });
        });
    }
    
    // Delete button (only for local characters)
    const deleteButtons = getActionButtons('delete');
    if (deleteButtons.length && characterId) {
        deleteButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const charData = getCharacterById(characterId);
                const characterName = charData?.name ? `Agent ${charData.name}` : 'this character';
                if (confirm(t('confirm_delete_character', { name: characterName }))) {
                    if (deleteCharacter(characterId)) {
                        // Return to list
                        if (window.app && window.app.returnToList) {
                            window.app.returnToList();
                        }
                    }
                }
            });
        });
    }
    
    // Back button
    const backButtons = getActionButtons('back');
    if (backButtons.length) {
        backButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                if (window.app && window.app.returnToList) {
                    window.app.returnToList();
                }
            });
        });
    }
}



