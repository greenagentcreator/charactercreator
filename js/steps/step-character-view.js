// Character View - Read-only character sheet view

import { getCharacterById, deleteCharacter } from '../utils/storage.js';
import { setCharacter } from '../model/character.js';
import { renderStep5_Summary } from './step5-summary.js';
import { t } from '../i18n/i18n.js';
import { createShareableUrl, copyToClipboard } from '../utils/sharing.js';
import { getPublicCharacters } from '../utils/database.js';

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
    
    // Wrap it with view-specific controls
    const html = `
        <div class="step" id="step-character-view">
            <div class="character-view-header">
                <h2>Agent ${characterData.name || 'Unnamed'}</h2>
                <div class="character-view-actions">
                    <button id="btn-view-share" class="action-button button-secondary" data-i18n="share_character"></button>
                    <button id="btn-view-print" class="action-button button-secondary" data-i18n="btn_print_summary"></button>
                    <button id="btn-view-export" class="action-button button-secondary" data-i18n="btn_export_json"></button>
                    ${!isDatabaseCharacter ? `<button id="btn-view-delete" class="action-button character-delete-btn-view" data-i18n="delete_character"></button>` : ''}
                    <button id="btn-view-back" class="action-button" data-i18n="back_to_list"></button>
                </div>
            </div>
            ${summaryHtml}
        </div>`;
    
    return html;
}

export function attachCharacterViewListeners(characterId, characterData = null) {
    // Get character data if not provided
    if (!characterData && characterId) {
        characterData = getCharacterById(characterId);
    }
    
    // Share button
    const btnShare = document.getElementById('btn-view-share');
    if (btnShare && characterData) {
        btnShare.addEventListener('click', async () => {
            if (characterData) {
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
            }
        });
    }
    
    // Print button
    const btnPrint = document.getElementById('btn-view-print');
    if (btnPrint) {
        btnPrint.addEventListener('click', () => {
            window.print();
        });
    }
    
    // Export JSON button
    const btnExport = document.getElementById('btn-view-export');
    if (btnExport && characterData) {
        btnExport.addEventListener('click', () => {
            if (characterData) {
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
            }
        });
    }
    
    // Delete button (only for local characters)
    const btnDelete = document.getElementById('btn-view-delete');
    if (btnDelete && characterId) {
        btnDelete.addEventListener('click', () => {
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
    }
    
    // Back button
    const btnBack = document.getElementById('btn-view-back');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            if (window.app && window.app.returnToList) {
                window.app.returnToList();
            }
        });
    }
}

