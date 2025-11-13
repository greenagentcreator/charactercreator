// Step 0: Introduction

import { resetCharacter } from '../model/character.js';
import { getAllCharacters, deleteCharacter, updateCharacterName, importCharacter } from '../utils/storage.js';
import { t } from '../i18n/i18n.js';
import { validateImportedCharacter } from '../utils/validation.js';
import { getPublicCharacters, importCharacterFromDatabase, reportCharacter } from '../utils/database.js';

export async function renderIntro() {
    // Check if we're loading a shared character - if so, don't render intro
    if (window.app && window.app.isLoadingSharedCharacter && window.app.isLoadingSharedCharacter()) {
        return '';
    }
    
    // Reset character when starting from intro
    resetCharacter();
    
    // Get all characters (own and imported)
    const allCharacters = getAllCharacters();
    
    // Load public characters from database (initial load)
    let publicCharactersData = { characters: [], lastDoc: null, hasMore: false };
    try {
        publicCharactersData = await getPublicCharacters(20);
    } catch (error) {
        console.error('Error loading public characters:', error);
    }
    const publicCharacters = publicCharactersData.characters || [];
    
    // Check again after async operation - shared character might have started loading
    if (window.app && window.app.isLoadingSharedCharacter && window.app.isLoadingSharedCharacter()) {
        return '';
    }
    
    let html = `
        <div class="step" id="step-intro">
            <!-- Entry Section with large create button -->
            <div class="intro-entry-section">
                <div class="info-box"><p data-i18n="intro_quote_dg"></p></div>
                <button id="btn-create-character" class="action-button btn-create-character-large" data-i18n="create_character"></button>
                <div class="import-section" style="margin-top: 20px;">
                    <button id="btn-import-json" class="action-button button-secondary" data-i18n="import_character"></button>
                    <input type="file" id="file-input-json" accept=".json" style="display: none;">
                </div>
            </div>
            
            <!-- Characters Section -->
            <div class="intro-characters-section">
                <h3 data-i18n="characters_title"></h3>
                ${allCharacters.length > 0 ? `
                    <div class="character-list">
                        ${allCharacters.map(char => {
                            const createdDate = new Date(char.createdDate || char.importedDate);
                            const dateStr = createdDate.toLocaleDateString();
                            const isImported = char.imported === true;
                            // Translate profession name if it's a translation key
                            let professionDisplay = char.profession || 'Unknown';
                            if (char.profession && char.profession.startsWith('profession_')) {
                                professionDisplay = t(char.profession);
                            }
                            return `
                                <div class="character-card ${isImported ? 'character-card-imported' : ''}" data-character-id="${char.id}">
                                    <div class="character-card-content">
                                        <div class="character-card-header">
                                            <h4 class="character-name" data-character-id="${char.id}">Agent ${char.name || 'Unnamed'}</h4>
                                            ${isImported ? `
                                                <span class="imported-badge" data-i18n="imported_character_label"></span>
                                            ` : `
                                                <button class="character-rename-btn" data-character-id="${char.id}" data-i18n="edit_name"></button>
                                            `}
                                        </div>
                                        <div class="character-card-info">
                                            <span class="character-profession">${professionDisplay}</span>
                                            <span class="character-date">${dateStr}</span>
                                        </div>
                                    </div>
                                    <div class="character-card-actions">
                                        <button class="character-view-btn" data-character-id="${char.id}" data-i18n="view_character"></button>
                                        <button class="character-delete-btn" data-character-id="${char.id}" data-i18n="delete_character"></button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : `
                    <p class="no-characters-message" data-i18n="no_characters_saved"></p>
                `}
            </div>
            
                ${publicCharacters.length > 0 ? `
                    <div class="character-list-section" style="margin-top: 30px;">
                        <h4 data-i18n="made_by_others_title"></h4>
                        <div class="info-box" style="margin-bottom: var(--spacing-md);">
                            <p data-i18n="made_by_others_info"></p>
                        </div>
                        <div class="character-list">
                            ${publicCharacters.map(char => {
                                const uploadedDate = new Date(char.uploadedAt || char.createdDate);
                                const dateStr = uploadedDate.toLocaleDateString();
                                // Translate profession name if it's a translation key
                                let professionDisplay = char.profession || 'Unknown';
                                if (char.profession && char.profession.startsWith('profession_')) {
                                    professionDisplay = t(char.profession);
                                }
                                return `
                                    <div class="character-card character-card-public" data-character-id="${char.id}" data-db-id="${char.id}">
                                        <div class="character-card-content">
                                            <div class="character-card-header">
                                                <h4 class="character-name">Agent ${char.name || 'Unnamed'}</h4>
                                                <button class="character-report-btn-icon" data-db-id="${char.id}" title="${t('report_character')}" aria-label="${t('report_character')}">⚑</button>
                                            </div>
                                            <div class="character-card-info">
                                                <span class="character-profession">${professionDisplay}</span>
                                                <span class="character-date">${dateStr}</span>
                                            </div>
                                        </div>
                                        <div class="character-card-actions">
                                            <button class="character-view-db-btn" data-db-id="${char.id}" data-i18n="view_character"></button>
                                            <button class="character-load-btn" data-db-id="${char.id}" data-i18n="load_from_database"></button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        ${publicCharactersData.hasMore ? `
                            <div style="text-align: center; margin-top: var(--spacing-lg);">
                                <button id="btn-load-more-characters" class="action-button button-secondary" data-i18n="load_more_characters"></button>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        </div>`;
    
    // Store pagination state in a data attribute for the load more button
    if (publicCharactersData.lastDoc) {
        // Store the lastDoc reference (we'll need to store it differently since we can't serialize DocumentSnapshot)
        // Instead, we'll store it in a module-level variable
        window.__introLastDoc = publicCharactersData.lastDoc;
        window.__introHasMore = publicCharactersData.hasMore;
    }
    
    return html;
}

export function attachIntroListeners() {
    // Create character button
    const btnCreate = document.getElementById('btn-create-character');
    if (btnCreate) {
        btnCreate.addEventListener('click', () => {
            if (window.app && window.app.handleNextStep) {
                window.app.handleNextStep();
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
                
                importCharacter(characterToImport);
                
                // Show success message
                alert(t('import_success') || 'Character imported successfully!');
                
                // Re-render intro to update list
                if (window.app && window.app.renderCurrentStep) {
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
    
    // View database character buttons
    document.querySelectorAll('.character-view-db-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const dbId = e.target.dataset.dbId;
            if (dbId && window.app && window.app.viewDatabaseCharacter) {
                await window.app.viewDatabaseCharacter(dbId);
            }
        });
    });
    
    // Load from database buttons
    document.querySelectorAll('.character-load-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const dbId = e.target.dataset.dbId;
            if (dbId) {
                try {
                    // Load enough characters to find the one we need
                    let allChars = [];
                    let lastDoc = null;
                    let hasMore = true;
                    while (hasMore && !allChars.find(c => c.id === dbId)) {
                        const result = await getPublicCharacters(100, lastDoc);
                        allChars = allChars.concat(result.characters);
                        lastDoc = result.lastDoc;
                        hasMore = result.hasMore;
                        if (allChars.length > 500) break; // Safety limit
                    }
                    const characterDoc = allChars.find(c => c.id === dbId);
                    
                    if (characterDoc) {
                        const importedId = await importCharacterFromDatabase(characterDoc);
                        alert(t('import_success') || 'Character imported successfully!');
                        
                        // Re-render intro to update list
                        if (window.app && window.app.renderCurrentStep) {
                            window.app.renderCurrentStep(true);
                        }
                    }
                } catch (error) {
                    console.error('Error loading character from database:', error);
                    alert(t('import_error') || 'Error loading character from database.');
                }
            }
        });
    });
    
    // Load More button
    const btnLoadMore = document.getElementById('btn-load-more-characters');
    if (btnLoadMore) {
        btnLoadMore.addEventListener('click', async () => {
            btnLoadMore.disabled = true;
            btnLoadMore.textContent = t('loading') || 'Loading...';
            
            try {
                const lastDoc = window.__introLastDoc;
                const result = await getPublicCharacters(20, lastDoc);
                
                if (result.characters.length > 0) {
                    // Get the character list container
                    const characterList = document.querySelector('.character-list-section .character-list');
                    if (characterList) {
                        // Append new characters
                        result.characters.forEach(char => {
                            const uploadedDate = new Date(char.uploadedAt || char.createdDate);
                            const dateStr = uploadedDate.toLocaleDateString();
                            let professionDisplay = char.profession || 'Unknown';
                            if (char.profession && char.profession.startsWith('profession_')) {
                                professionDisplay = t(char.profession);
                            }
                            
                            const cardHtml = `
                                <div class="character-card character-card-public" data-character-id="${char.id}" data-db-id="${char.id}">
                                    <div class="character-card-content">
                                        <div class="character-card-header">
                                            <h4 class="character-name">Agent ${char.name || 'Unnamed'}</h4>
                                            <button class="character-report-btn-icon" data-db-id="${char.id}" title="${t('report_character')}" aria-label="${t('report_character')}">⚑</button>
                                        </div>
                                        <div class="character-card-info">
                                            <span class="character-profession">${professionDisplay}</span>
                                            <span class="character-date">${dateStr}</span>
                                        </div>
                                    </div>
                                    <div class="character-card-actions">
                                        <button class="character-view-db-btn" data-db-id="${char.id}" data-i18n="view_character"></button>
                                        <button class="character-load-btn" data-db-id="${char.id}" data-i18n="load_from_database"></button>
                                    </div>
                                </div>
                            `;
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = cardHtml;
                            const newCard = tempDiv.firstElementChild;
                            characterList.appendChild(newCard);
                            
                            // Attach listeners only to the new card's buttons
                            const viewBtn = newCard.querySelector('.character-view-db-btn');
                            const loadBtn = newCard.querySelector('.character-load-btn');
                            const reportBtn = newCard.querySelector('.character-report-btn-icon');
                            
                            // Translate button text
                            if (viewBtn && viewBtn.hasAttribute('data-i18n')) {
                                viewBtn.textContent = t(viewBtn.getAttribute('data-i18n'));
                            }
                            if (loadBtn && loadBtn.hasAttribute('data-i18n')) {
                                loadBtn.textContent = t(loadBtn.getAttribute('data-i18n'));
                            }
                            
                            if (viewBtn) {
                                viewBtn.addEventListener('click', async () => {
                                    const dbId = viewBtn.dataset.dbId;
                                    if (dbId && window.app && window.app.viewDatabaseCharacter) {
                                        await window.app.viewDatabaseCharacter(dbId);
                                    }
                                });
                            }
                            
                            if (loadBtn) {
                                loadBtn.addEventListener('click', async () => {
                                    const dbId = loadBtn.dataset.dbId;
                                    if (dbId) {
                                        try {
                                            let allChars = [];
                                            let lastDoc = null;
                                            let hasMore = true;
                                            while (hasMore && !allChars.find(c => c.id === dbId)) {
                                                const result = await getPublicCharacters(100, lastDoc);
                                                allChars = allChars.concat(result.characters);
                                                lastDoc = result.lastDoc;
                                                hasMore = result.hasMore;
                                                if (allChars.length > 500) break;
                                            }
                                            const characterDoc = allChars.find(c => c.id === dbId);
                                            if (characterDoc) {
                                                const importedId = await importCharacterFromDatabase(characterDoc);
                                                alert(t('import_success') || 'Character imported successfully!');
                                                if (window.app && window.app.renderCurrentStep) {
                                                    window.app.renderCurrentStep(true);
                                                }
                                            }
                                        } catch (error) {
                                            console.error('Error loading character from database:', error);
                                            alert(t('import_error') || 'Error loading character from database.');
                                        }
                                    }
                                });
                            }
                            
                            if (reportBtn) {
                                reportBtn.addEventListener('click', async (e) => {
                                    e.stopPropagation();
                                    const dbId = reportBtn.dataset.dbId;
                                    if (dbId) {
                                        const reason = prompt(t('report_reason_prompt') || 'Please provide a reason for reporting this character:');
                                        if (reason && reason.trim() !== '') {
                                            try {
                                                const success = await reportCharacter(dbId, reason.trim());
                                                if (success) {
                                                    alert(t('report_success') || 'Thank you for reporting. The character has been flagged for review.');
                                                } else {
                                                    alert(t('report_error') || 'Error reporting character. Please try again later.');
                                                }
                                            } catch (error) {
                                                console.error('Error reporting character:', error);
                                                alert(t('report_error') || 'Error reporting character. Please try again later.');
                                            }
                                        }
                                    }
                                });
                            }
                        });
                        
                        // Update pagination state
                        window.__introLastDoc = result.lastDoc;
                        window.__introHasMore = result.hasMore;
                        
                        // Show/hide load more button
                        if (result.hasMore) {
                            btnLoadMore.disabled = false;
                            btnLoadMore.textContent = t('load_more_characters') || 'Load More';
                        } else {
                            btnLoadMore.remove();
                        }
                    }
                } else {
                    btnLoadMore.remove();
                }
            } catch (error) {
                console.error('Error loading more characters:', error);
                btnLoadMore.disabled = false;
                btnLoadMore.textContent = t('load_more_characters') || 'Load More';
                alert(t('load_more_error') || 'Error loading more characters. Please try again.');
            }
        });
    }
    
    // Report character buttons (both old and new icon button)
    document.querySelectorAll('.character-report-btn, .character-report-btn-icon').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const dbId = btn.dataset.dbId;
            if (dbId) {
                const reason = prompt(t('report_reason_prompt') || 'Please provide a reason for reporting this character:');
                if (reason && reason.trim() !== '') {
                    try {
                        const success = await reportCharacter(dbId, reason.trim());
                        if (success) {
                            alert(t('report_success') || 'Thank you for reporting. The character has been flagged for review.');
                        } else {
                            alert(t('report_error') || 'Error reporting character. Please try again later.');
                        }
                    } catch (error) {
                        console.error('Error reporting character:', error);
                        alert(t('report_error') || 'Error reporting character. Please try again later.');
                    }
                }
            }
        });
    });
    
    // View character buttons
    document.querySelectorAll('.character-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const characterId = e.target.dataset.characterId;
            if (characterId && window.app && window.app.viewCharacter) {
                window.app.viewCharacter(characterId);
            }
        });
    });
    
    // Delete character buttons
    document.querySelectorAll('.character-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const characterId = e.target.dataset.characterId;
            if (characterId) {
                const character = getAllCharacters().find(c => c.id === characterId);
                const characterName = character?.name ? `Agent ${character.name}` : 'this character';
                if (confirm(t('confirm_delete_character', { name: characterName }))) {
                    if (deleteCharacter(characterId)) {
                        // Re-render intro to update list
                        if (window.app && window.app.renderCurrentStep) {
                            window.app.renderCurrentStep(true);
                        }
                    }
                }
            }
        });
    });
    
    // Rename character buttons
    document.querySelectorAll('.character-rename-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const characterId = e.target.dataset.characterId;
            const nameElement = document.querySelector(`.character-name[data-character-id="${characterId}"]`);
            if (nameElement && characterId) {
                const currentName = nameElement.textContent;
                const newName = prompt(t('enter_new_name'), currentName);
                if (newName && newName.trim() !== '' && newName !== currentName) {
                    if (updateCharacterName(characterId, newName.trim())) {
                        // Re-render intro to update list
                        if (window.app && window.app.renderCurrentStep) {
                            window.app.renderCurrentStep(true);
                        }
                    }
                }
            }
        });
    });
}

