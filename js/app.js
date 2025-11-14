// Main application logic for Delta Green Character Creator

import { t, translateAllElements } from './i18n/i18n.js';
import { getCurrentLanguage } from './i18n/i18n.js';
import { resetCharacter, getCharacter } from './model/character.js';
import { initErrorContainer, clearErrors } from './utils/validation.js';
import { initKeyboardNavigation, focusFirstInput } from './utils/keyboard.js';
import { renderIntro, attachIntroListeners } from './steps/step0-intro.js';
import { renderStep1_ProfessionSkills, validateStep1, saveStep1, attachStep1Listeners } from './steps/step1-profession.js';
import { renderStep2_Statistics, validateStep2, saveStep2, attachStep2Listeners } from './steps/step2-statistics.js';
import { renderStep3_DerivedAttributes, validateStep3, saveStep3, attachStep3Listeners } from './steps/step3-derived.js';
import { renderStep4_BondsMotivations, validateStep4, saveStep4, attachStep4Listeners } from './steps/step4-bonds.js';
import { renderStep4_TraumaticBackground, validateStep4_3, saveStep4_3, attachStep4_3Listeners } from './steps/step4-traumatic-background.js';
import { renderStep5_PersonalInfo, validateStep5_PersonalInfo, saveStep5_PersonalInfo, attachStep5_PersonalInfoListeners } from './steps/step5-personal-info.js';
import { renderStep5_Summary, validateStep5, saveStep5, attachStep5Listeners } from './steps/step5-summary.js';
import { saveCharacter, isStorageFull, getStorageLimit, importCharacter, getAllCharacters } from './utils/storage.js';
import { PROFESSIONS } from './config/professions.js';
import { renderCharacterView, attachCharacterViewListeners } from './steps/step-character-view.js';
import { getCharacterFromUrl } from './utils/sharing.js';
import { uploadCharacter } from './utils/database.js';

let currentStep = 0;
let stepContainer, progressBarContainer, btnNext, btnBack;
let currentViewMode = 'creation'; // 'creation', 'view', 'list'
let viewingCharacterId = null;
let isLoadingSharedCharacter = false; // Flag to prevent intro from rendering when loading shared character

// Export function to set the flag (used by main.js)
export function setLoadingSharedCharacter(value) {
    isLoadingSharedCharacter = value;
}

// Define steps array
const steps = [
    { render: renderIntro, validate: () => true, save: () => {}, nameKey: "step_name_0", attachListeners: attachIntroListeners },
    { render: renderStep1_ProfessionSkills, validate: validateStep1, save: saveStep1, nameKey: "step_name_1", attachListeners: attachStep1Listeners },
    { render: renderStep2_Statistics, validate: validateStep2, save: saveStep2, nameKey: "step_name_2", attachListeners: attachStep2Listeners },
    { render: renderStep3_DerivedAttributes, validate: validateStep3, save: saveStep3, nameKey: "step_name_3", attachListeners: attachStep3Listeners },
    { render: renderStep4_BondsMotivations, validate: validateStep4, save: saveStep4, nameKey: "step_name_4", attachListeners: attachStep4Listeners },
    { render: renderStep4_TraumaticBackground, validate: validateStep4_3, save: saveStep4_3, nameKey: "step_name_4_3", attachListeners: attachStep4_3Listeners },
    { render: renderStep5_PersonalInfo, validate: validateStep5_PersonalInfo, save: saveStep5_PersonalInfo, nameKey: "step_name_5_personal", attachListeners: attachStep5_PersonalInfoListeners },
    { render: renderStep5_Summary, validate: validateStep5, save: saveStep5, nameKey: "step_name_5", attachListeners: attachStep5Listeners }
];

async function renderCurrentStep(skipFocus = false) {
    // Don't render if we're currently loading a shared character
    if (isLoadingSharedCharacter) {
        return;
    }
    
    if (steps[currentStep] && typeof steps[currentStep].render === 'function') {
        const stepData = steps[currentStep];
        const stepContentOrHtml = await stepData.render();
        
    // Don't render if we started loading a shared character while waiting for async render
    if (isLoadingSharedCharacter) {
        return;
    }
        
        if (typeof stepContentOrHtml === 'string') {
            stepContainer.innerHTML = stepContentOrHtml;
        } else if (stepContentOrHtml instanceof Node) {
            stepContainer.innerHTML = ''; 
            stepContainer.appendChild(stepContentOrHtml);
        }
        // Initialize error container for the new step
        clearErrors();
        initErrorContainer();
        translateAllElements(stepContainer);
        if (stepData.attachListeners) {
            stepData.attachListeners();
        }
        
        // Auto-save character when entering Summary step (step 7, index 7)
        if (currentStep === 7) {
            autoSaveCharacter();
            autoUploadCharacter();
        }
        
        updateProgressBar(); 
        updateNavigationButtons();
        // Focus first input after a short delay to ensure DOM is ready
        // Skip focus if requested (e.g., when updating UI without changing steps)
        if (!skipFocus) {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    focusFirstInput();
                }, 150);
            });
        }
    }
}

function updateProgressBar() {
    // Hide progress bar on intro step (step 0)
    if (currentStep === 0) {
        if (progressBarContainer) {
            progressBarContainer.style.display = 'none';
        }
        return;
    }
    
    // Show progress bar for all other steps
    if (progressBarContainer) {
        progressBarContainer.style.display = 'block';
    }
    
    // Clear existing content
    progressBarContainer.innerHTML = '';
    
    // Create stepper container
    const stepper = document.createElement('div');
    stepper.className = 'progress-stepper';
    stepper.setAttribute('role', 'navigation');
    stepper.setAttribute('aria-label', 'Step navigation');
    
    // Filter out intro step (index 0) - only show steps 1 onwards
    const visibleSteps = steps.slice(1); // Remove intro step
    const totalVisibleSteps = visibleSteps.length;
    const currentVisibleStep = currentStep - 1; // Adjust for removed intro step
    
    // Create progress line
    const progressLine = document.createElement('div');
    progressLine.className = 'progress-stepper-line';
    // Calculate progress percentage, handling edge case when there's only one step
    const progressPercent = totalVisibleSteps > 1 
        ? (currentVisibleStep / (totalVisibleSteps - 1)) * 100 
        : 0;
    progressLine.style.width = `${progressPercent}%`;
    stepper.appendChild(progressLine);
    
    // Create step indicators (starting from step 1, displayed as step 1)
    visibleSteps.forEach((step, visibleIndex) => {
        const actualIndex = visibleIndex + 1; // Actual step index (1, 2, 3, etc.)
        const displayNumber = visibleIndex + 1; // Display number (1, 2, 3, etc.)
        
        const stepIndicator = document.createElement('div');
        stepIndicator.className = 'step-indicator';
        stepIndicator.setAttribute('role', 'button');
        stepIndicator.setAttribute('tabindex', actualIndex === currentStep ? '0' : '-1');
        stepIndicator.setAttribute('aria-label', `Step ${displayNumber}: ${t(step.nameKey)}`);
        
        if (actualIndex === currentStep) {
            stepIndicator.classList.add('current');
            stepIndicator.setAttribute('aria-current', 'step');
        } else if (actualIndex < currentStep) {
            stepIndicator.classList.add('completed');
        }
        
        // Step circle
        const circle = document.createElement('div');
        circle.className = 'step-circle';
        circle.textContent = displayNumber;
        stepIndicator.appendChild(circle);
        
        // Step label
        const label = document.createElement('div');
        label.className = 'step-label';
        label.textContent = t(step.nameKey);
        stepIndicator.appendChild(label);
        
        // Make completed steps clickable (optional - allow jumping back)
        if (actualIndex < currentStep) {
            stepIndicator.addEventListener('click', () => {
                if (actualIndex < currentStep) {
                    // Validate current step before allowing navigation
                    if (validateStep(currentStep, false)) {
                        saveStepData(currentStep);
                        currentStep = actualIndex;
                        renderCurrentStep();
                        // Scroll to top smoothly
                        scrollToStepTop();
                    }
                }
            });
            stepIndicator.addEventListener('keydown', (e) => {
                if ((e.key === 'Enter' || e.key === ' ') && actualIndex < currentStep) {
                    e.preventDefault();
                    if (validateStep(currentStep, false)) {
                        saveStepData(currentStep);
                        currentStep = actualIndex;
                        renderCurrentStep();
                        // Scroll to top smoothly
                        scrollToStepTop();
                    }
                }
            });
        }
        
        stepper.appendChild(stepIndicator);
    });
    
    progressBarContainer.appendChild(stepper);
    
    // Add screen reader announcement
    const announcement = document.createElement('div');
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    const stepName = t(steps[currentStep].nameKey) || `Step ${currentStep}`;
    // Display step number starting from 1 (not 0) - currentStep is already 1-based for display
    const displayStepNumber = currentStep; // Step 1 is displayed as 1, Step 2 as 2, etc.
    const totalSteps = totalVisibleSteps; // Total visible steps (excluding intro)
    announcement.textContent = t('progress_bar_text', { current: displayStepNumber, total: totalSteps, stepName: stepName });
    progressBarContainer.appendChild(announcement);
    
    // Remove announcement after screen reader has read it
    setTimeout(() => {
        if (announcement.parentElement) {
            announcement.remove();
        }
    }, 1000);
}

function validateStep(stepIndex, showAlerts = true) {
    if (steps[stepIndex] && typeof steps[stepIndex].validate === 'function') {
        return steps[stepIndex].validate(showAlerts);
    }
    return true; 
}

function saveStepData(stepIndex) {
    if (steps[stepIndex] && typeof steps[stepIndex].save === 'function') {
        steps[stepIndex].save();
    }
}

function handleNextStep() {
    if (!validateStep(currentStep, true)) return;
    const character = getCharacter();
    
    // Prüfe, ob wir im 'bonds' oder 'skills' Stage einer Custom Profession sind
    // In diesem Fall wird die Bestätigung in saveStep1 gemacht und die Ansicht aktualisiert
    if (currentStep === 1 && character.isCustomProfession && 
        (character.customProfessionSetupStage === 'bonds' || character.customProfessionSetupStage === 'skills')) {
        saveStepData(currentStep);
        // saveStep1 hat bereits renderCurrentStep aufgerufen, also nur scrollen
        scrollToStepTop();
        return;
    }
    
    saveStepData(currentStep);
    
    if (currentStep < steps.length - 1) {
        // Mark step container as busy during transition
        if (stepContainer) {
            stepContainer.setAttribute('aria-busy', 'true');
        }
        currentStep++;
        renderCurrentStep();
        // Scroll to top smoothly
        scrollToStepTop();
    }
}

function autoSaveCharacter() {
    const character = getCharacter();
    
    // Prepare character data for storage
    const characterName = character.personalInfo?.name || 'Unnamed Agent';
    let professionName = 'Unknown';
    if (character.professionKey) {
        if (character.professionKey === 'custom_profession') {
            professionName = character.customProfessionName || 'Custom Profession';
        } else if (PROFESSIONS[character.professionKey]) {
            professionName = PROFESSIONS[character.professionKey].nameKey;
        }
    }
    
    // Check storage limit
    if (isStorageFull() && !character.id) {
        // Storage is full and this is a new character
        const limit = getStorageLimit();
        alert(t('storage_limit_reached', { limit: limit }));
        return;
    }
    
    try {
        const characterData = {
            id: character.id || null,
            name: characterName,
            profession: professionName,
            data: JSON.parse(JSON.stringify(character)) // Deep copy
        };
        
        const savedId = saveCharacter(characterData);
        character.id = savedId;
    } catch (error) {
        console.error('Error auto-saving character:', error);
    }
}

function hasShortBondDescriptions(character) {
    if (!Array.isArray(character.bonds) || character.bonds.length === 0) {
        return false;
    }

    return character.bonds.some(bond => {
        const description = (bond?.description || '').normalize('NFKD');
        const lettersOnly = description.replace(/[^\p{L}]/gu, '');
        return lettersOnly.length <= 4;
    });
}

async function autoUploadCharacter() {
    const character = getCharacter();
    
    // Only upload if character is complete (has been saved)
    if (!character.id) {
        // Wait a bit for autoSaveCharacter to complete
        setTimeout(() => autoUploadCharacter(), 100);
        return;
    }
    
    // Prepare character data for upload
    const characterName = character.personalInfo?.name || 'Unnamed Agent';
    let professionName = 'Unknown';
    if (character.professionKey) {
        if (character.professionKey === 'custom_profession') {
            professionName = character.customProfessionName || 'Custom Profession';
        } else if (PROFESSIONS[character.professionKey]) {
            professionName = PROFESSIONS[character.professionKey].nameKey;
        }
    }
    
    if (hasShortBondDescriptions(character)) {
        console.info('Auto-upload skipped: bond descriptions must contain more than 4 letters.');
        return;
    }

    const characterData = {
        id: character.id,
        name: characterName,
        profession: professionName,
        data: JSON.parse(JSON.stringify(character)), // Deep copy
        createdDate: new Date().toISOString()
    };
    
    try {
        await uploadCharacter(characterData);
        console.log('Character automatically uploaded to database');
    } catch (error) {
        // Silently fail - don't interrupt user experience
        console.error('Error auto-uploading character to database:', error);
    }
}

function handlePreviousStep() {
    if (currentStep > 0) {
        // Mark step container as busy during transition
        if (stepContainer) {
            stepContainer.setAttribute('aria-busy', 'true');
        }
        currentStep--;
        renderCurrentStep();
        // Scroll to top smoothly
        scrollToStepTop();
    }
}

/**
 * Scroll to the top of the step content smoothly
 */
function scrollToStepTop() {
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Fallback to window scroll
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Remove busy state after transition
        setTimeout(() => {
            if (stepContainer) {
                stepContainer.removeAttribute('aria-busy');
            }
        }, 300);
    });
}

export function updateNavigationButtons() {
    // Hide navigation on intro step (step 0)
    const navigationContainer = document.getElementById('navigation-container');
    if (navigationContainer) {
        if (currentStep === 0) {
            navigationContainer.style.display = 'none';
        } else {
            navigationContainer.style.display = 'flex';
        }
    }
    
    btnBack.disabled = currentStep === 0;
    const character = getCharacter();

    if (currentStep === steps.length - 1) {
        // Summary step - show "Back to Home" button instead of "Next"
        btnNext.style.display = 'inline-block';
        btnNext.textContent = t('btn_back_to_home');
        btnNext.disabled = false;
        // Remove existing event listeners and add new one for "Back to Home"
        const newBtnNext = btnNext.cloneNode(true);
        btnNext.parentNode.replaceChild(newBtnNext, btnNext);
        btnNext = newBtnNext;
        btnNext.addEventListener('click', () => {
            returnToList();
        });
    } else {
        btnNext.style.display = 'inline-block';
        btnNext.textContent = t('btn_next_text');
        
        // Remove existing event listeners and re-add default handler
        const newBtnNext = btnNext.cloneNode(true);
        btnNext.parentNode.replaceChild(newBtnNext, btnNext);
        btnNext = newBtnNext;
        btnNext.addEventListener('click', handleNextStep);
        
        let isStepValid = validateStep(currentStep, false);

        if (currentStep === 1 && character.isCustomProfession) {
            // Im 'bonds' und 'skills' Stage ist der Button aktiv und übernimmt die Bestätigung
            btnNext.disabled = !isStepValid;
        } else {
            btnNext.disabled = !isStepValid;
        }
    }
}

export function getCurrentCharacterData() {
    return getCharacter();
}

export function initializeApp() {
    stepContainer = document.getElementById('step-content-container');
    progressBarContainer = document.getElementById('progress-bar-container');
    btnNext = document.getElementById('btn-next');
    btnBack = document.getElementById('btn-back');
    
    resetCharacter();
    
    btnNext.addEventListener('click', handleNextStep);
    btnBack.addEventListener('click', handlePreviousStep);
    
    // Initialize keyboard navigation
    initKeyboardNavigation();
    
    // Check if there's a shared character in URL - if so, set flag and don't render intro yet
    const sharedCharacterData = getCharacterFromUrl();
    if (sharedCharacterData) {
        isLoadingSharedCharacter = true; // Set flag immediately to prevent intro from rendering
    } else {
        renderCurrentStep();
    }
}

// View character function
function viewCharacter(characterId) {
    viewingCharacterId = characterId;
    currentViewMode = 'view';
    
    // Hide navigation
    if (btnNext) btnNext.style.display = 'none';
    if (btnBack) btnBack.style.display = 'none';
    if (progressBarContainer) progressBarContainer.style.display = 'none';
    
    // Render character view
    stepContainer.innerHTML = renderCharacterView(characterId);
    translateAllElements(stepContainer);
    attachCharacterViewListeners(characterId);
    
    // Attach summary listeners (for print/export buttons in summary)
    attachStep5Listeners();
}

// View character from database
async function viewDatabaseCharacter(dbId) {
    viewingCharacterId = null; // Not a local character
    currentViewMode = 'view';
    
    // Hide navigation
    if (btnNext) btnNext.style.display = 'none';
    if (btnBack) btnBack.style.display = 'none';
    if (progressBarContainer) progressBarContainer.style.display = 'none';
    
    try {
        // Get character from database
        const { getPublicCharacters } = await import('./utils/database.js');
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
        
        if (!characterDoc) {
            alert(t('character_not_found') || 'Character not found.');
            return;
        }
        
        // Prepare character data in the same format as localStorage
        const characterData = {
            id: null, // No local ID for database characters
            name: characterDoc.name,
            profession: characterDoc.profession,
            data: characterDoc.data,
            createdDate: characterDoc.createdDate || characterDoc.uploadedAt
        };
        
        // Render character view with database character data
        stepContainer.innerHTML = renderCharacterView(null, characterData);
        translateAllElements(stepContainer);
        
        // Attach listeners (without delete button for database characters)
        attachCharacterViewListeners(null, characterData);
        
        // Attach summary listeners (for print/export buttons in summary)
        attachStep5Listeners();
    } catch (error) {
        console.error('Error viewing database character:', error);
        alert(t('character_not_found') || 'Error loading character.');
    }
}

// Return to list function
function returnToList() {
    viewingCharacterId = null;
    currentViewMode = 'list';
    currentStep = 0;
    isLoadingSharedCharacter = false; // Reset flag when returning to list
    
    // Show navigation
    if (btnNext) btnNext.style.display = 'inline-block';
    if (btnBack) btnBack.style.display = 'inline-block';
    if (progressBarContainer) progressBarContainer.style.display = 'block';
    
    // Reset character and render intro
    resetCharacter();
    renderCurrentStep();
}

// Handle shared character from URL
function handleSharedCharacter(characterData) {
    try {
        // Set flag to prevent intro from rendering
        isLoadingSharedCharacter = true;
        
        // Import character with imported flag
        const characterName = characterData.personalInfo?.name || 'Unnamed Agent';
        let professionName = 'Unknown';
        if (characterData.professionKey) {
            if (characterData.professionKey === 'custom_profession') {
                professionName = characterData.customProfessionName || 'Custom Profession';
            } else if (PROFESSIONS[characterData.professionKey]) {
                professionName = PROFESSIONS[characterData.professionKey].nameKey;
            }
        }
        
        // Check if character already exists (by comparing name and profession)
        const allCharacters = getAllCharacters();
        
        // Check if this character already exists (simple check by name and profession)
        let existingCharacter = allCharacters.find(char => {
            return char.name === characterName && char.profession === professionName;
        });
        
        let characterId;
        if (existingCharacter) {
            // Character already exists, use existing ID
            characterId = existingCharacter.id;
            // Ensure it's marked as imported
            if (!existingCharacter.imported) {
                // Update the character to mark as imported
                existingCharacter.imported = true;
                existingCharacter.importedDate = new Date().toISOString();
                saveCharacter(existingCharacter);
            }
        } else {
            // Import new character
            const characterToImport = {
                name: characterName,
                profession: professionName,
                data: characterData
            };
            characterId = importCharacter(characterToImport);
        }
        
        // Clear URL hash
        window.history.replaceState(null, '', window.location.pathname);
        
        // View the imported character
        viewCharacter(characterId);
        
        // Reset flag after a short delay to allow view to render
        setTimeout(() => {
            isLoadingSharedCharacter = false;
        }, 500);
    } catch (error) {
        console.error('Error handling shared character:', error);
        isLoadingSharedCharacter = false;
        alert(t('import_error') || 'Error importing shared character');
    }
}

// Make app available globally for i18n system
window.app = {
    renderCurrentStep,
    getCurrentCharacterData,
    viewCharacter,
    viewDatabaseCharacter,
    returnToList,
    handleSharedCharacter,
    isLoadingSharedCharacter: () => isLoadingSharedCharacter,
    handleNextStep
};

