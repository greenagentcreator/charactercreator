// Main application logic for Delta Green Character Creator

import { t, translateAllElements } from './i18n/i18n.js?v=99fd89c';
import { getCurrentLanguage } from './i18n/i18n.js?v=99fd89c';
import { resetCharacter, getCharacter, setCharacter } from './model/character.js?v=99fd89c';
import { initErrorContainer, clearErrors, validateImportedCharacter } from './utils/validation.js?v=99fd89c';
import { initKeyboardNavigation } from './utils/keyboard.js?v=99fd89c';
import { renderIntro, attachIntroListeners, syncLibraryLanguageFilterWithUi } from './steps/step0-intro.js?v=99fd89c';
import { renderStep1_ProfessionSkills, validateStep1, saveStep1, attachStep1Listeners } from './steps/step1-profession.js?v=99fd89c';
import { renderStep2_Statistics, validateStep2, saveStep2, attachStep2Listeners } from './steps/step2-statistics.js?v=99fd89c';
import { renderStep3_DerivedAttributes, validateStep3, saveStep3, attachStep3Listeners } from './steps/step3-derived.js?v=99fd89c';
import { renderStep4_BondsMotivations, validateStep4, saveStep4, attachStep4Listeners } from './steps/step4-bonds.js?v=99fd89c';
import { renderStep4_TraumaticBackground, validateStep4_3, saveStep4_3, attachStep4_3Listeners } from './steps/step4-traumatic-background.js?v=99fd89c';
import { renderStep5_PersonalInfo, validateStep5_PersonalInfo, saveStep5_PersonalInfo, attachStep5_PersonalInfoListeners } from './steps/step5-personal-info.js?v=99fd89c';
import { renderStep5_Summary, validateStep5, saveStep5, attachStep5Listeners } from './steps/step5-summary.js?v=99fd89c';
import { saveCharacter, isStorageFull, getStorageLimit, importCharacter } from './utils/storage.js?v=99fd89c';
import { PROFESSIONS } from './config/professions.js?v=99fd89c';
import { renderCharacterView, attachCharacterViewListeners, prepareSheetSummaryForPrint, triggerSheetPrint } from './steps/step-character-view.js?v=99fd89c';
import { confirmLeaveSheetIfDirty, isLeavingSheetView, resetSheetEditState } from './utils/sheet-autosave.js?v=99fd89c';
import { captureSheetBaseline } from './utils/sheet-baseline.js?v=99fd89c';
import { getCharacterFromUrl } from './utils/sharing.js?v=99fd89c';
import { normalizeSheetCharacterFields } from './utils/sheet-edit.js?v=99fd89c';
import { uploadCharacter } from './utils/database.js?v=99fd89c';
import { initAppHistory, syncAppHistory, appStateFromUrl, isNavigatingFromHistory } from './utils/app-history.js?v=99fd89c';
import { loadAppNavigationState } from './utils/app-session.js?v=99fd89c';
import {
    saveUnfinishedDraft,
    resolveUnfinishedDraftForResume,
    removeUnfinishedDraft,
    clearActiveUnfinishedDraftReference,
    getUnfinishedDraftById
} from './utils/unfinished-drafts.js?v=99fd89c';
import { completeAppLoading } from './utils/app-loading.js?v=99fd89c';

let currentStep = 0;
let stepContainer, progressBarContainer, btnNext, btnBack;
let currentViewMode = 'creation'; // 'creation', 'sheet', 'list'
let viewingCharacterId = null;
let viewingDatabaseId = null;
let activeDraftId = null;
let isLoadingSharedCharacter = false; // Flag to prevent intro from rendering when loading shared character
let isRestoringNavigation = false;
let scrollToCharacterIdOnHome = null;

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

/**
 * @param {boolean} preserveScroll - When true (default), keep window scroll position after in-step UI refresh
 */
async function renderCurrentStep(preserveScroll = true) {
    console.log('app.js: renderCurrentStep() called, currentStep:', currentStep, 'isLoadingSharedCharacter:', isLoadingSharedCharacter);

    if (isLoadingSharedCharacter || isRestoringNavigation) {
        console.log('app.js: Skipping render - loading shared character or restoring navigation');
        return;
    }

    if (currentViewMode === 'sheet') {
        if (stepContainer) {
            translateAllElements(stepContainer);
        }
        return;
    }

    const scrollYToRestore = preserveScroll ? window.scrollY : null;
    
    if (steps[currentStep] && typeof steps[currentStep].render === 'function') {
        const stepData = steps[currentStep];
        console.log('app.js: Rendering step', currentStep, 'render function:', stepData.render.name);
        
        try {
            const stepContentOrHtml = await stepData.render();
            console.log('app.js: Step render returned:', typeof stepContentOrHtml, stepContentOrHtml ? (typeof stepContentOrHtml === 'string' ? stepContentOrHtml.substring(0, 100) + '...' : 'Node') : 'empty');
            
            // Don't render if we started loading a shared character while waiting for async render
            if (isLoadingSharedCharacter) {
                console.log('app.js: Skipping render - started loading shared character during async render');
                return;
            }
            
            if (typeof stepContentOrHtml === 'string') {
                console.log('app.js: Setting innerHTML, length:', stepContentOrHtml.length);
                if (stepContainer) {
                    stepContainer.innerHTML = stepContentOrHtml;
                    console.log('app.js: innerHTML set successfully');
                } else {
                    console.error('app.js: stepContainer is null!');
                }
            } else if (stepContentOrHtml instanceof Node) {
                console.log('app.js: Appending Node');
                if (stepContainer) {
                    stepContainer.innerHTML = ''; 
                    stepContainer.appendChild(stepContentOrHtml);
                } else {
                    console.error('app.js: stepContainer is null!');
                }
            } else {
                console.warn('app.js: Step render returned unexpected type:', typeof stepContentOrHtml);
            }
        } catch (error) {
            console.error('app.js: Error rendering step:', error);
            completeAppLoading();
        }
        // Initialize error container for the new step
        clearErrors();
        initErrorContainer();
        translateAllElements(stepContainer);
        if (stepData.attachListeners) {
            stepData.attachListeners();
        }
        
        updateProgressBar(); 
        updateNavigationButtons();

        let scrollToSavedCharacter = false;
        if (currentStep === 0 && scrollToCharacterIdOnHome) {
            scrollToSavedCharacter = true;
            scrollToCharacterOnHome(scrollToCharacterIdOnHome);
            scrollToCharacterIdOnHome = null;
        }

        if (preserveScroll && !scrollToSavedCharacter) {
            if (scrollYToRestore !== null) {
                requestAnimationFrame(() => {
                    window.scrollTo({ top: scrollYToRestore, behavior: 'instant' });
                });
            }
        } else if (!scrollToSavedCharacter) {
            scrollToStepTop();
        }

        if (!isLoadingSharedCharacter) {
            completeAppLoading();
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
                    if (validateStep(currentStep, true)) {
                        saveStepData(currentStep);
                        currentStep = actualIndex;
                        renderCurrentStep(false);
                        pushAppHistory();
                    }
                }
            });
            stepIndicator.addEventListener('keydown', (e) => {
                if ((e.key === 'Enter' || e.key === ' ') && actualIndex < currentStep) {
                    e.preventDefault();
                    if (validateStep(currentStep, true)) {
                        saveStepData(currentStep);
                        currentStep = actualIndex;
                        renderCurrentStep(false);
                        pushAppHistory();
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
    persistCreationDraftIfCreating();
}

function persistCreationDraftIfCreating() {
    if (currentViewMode !== 'creation' || currentStep <= 0) {
        return;
    }
    activeDraftId = saveUnfinishedDraft(currentStep, getCharacter(), activeDraftId);
}

function clearActiveCreationDraft() {
    if (activeDraftId) {
        removeUnfinishedDraft(activeDraftId);
    }
    activeDraftId = null;
    clearActiveUnfinishedDraftReference();
}

function applyUnfinishedDraftToSession(draft) {
    if (!draft) {
        return false;
    }
    activeDraftId = draft.id;
    setCharacter(JSON.parse(JSON.stringify(draft.character)));
    return true;
}

function handleNextStep() {
    if (!validateStep(currentStep, true)) return;
    const character = getCharacter();

    if (currentStep === 0) {
        activeDraftId = null;
        clearActiveUnfinishedDraftReference();
    }
    
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
        renderCurrentStep(false);
        pushAppHistory();
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
        const dataCopy = JSON.parse(JSON.stringify(character));
        if (!dataCopy.sheetBaseline) {
            dataCopy.sheetBaseline = captureSheetBaseline(dataCopy);
        }

        const characterData = {
            id: character.id || null,
            name: characterName,
            profession: professionName,
            data: dataCopy
        };
        
        const savedId = saveCharacter(characterData);
        character.id = savedId;
        if (!character.sheetBaseline) {
            character.sheetBaseline = dataCopy.sheetBaseline;
        }
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

const SHARE_TO_LIBRARY_PREF_KEY = 'shareToLibraryPreference';

function getShareToLibraryPreference() {
    return localStorage.getItem(SHARE_TO_LIBRARY_PREF_KEY) !== 'false';
}

export function isShareToLibraryEnabled() {
    const checkbox = document.getElementById('share-to-library');
    if (checkbox) {
        return checkbox.checked;
    }
    return getShareToLibraryPreference();
}

async function autoUploadCharacter() {
    if (!isShareToLibraryEnabled()) {
        return;
    }

    const character = getCharacter();

    if (!character.id) {
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
        language: getCurrentLanguage(),
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
        renderCurrentStep(false);
        pushAppHistory();
    }
}

function getAppNavigationState() {
    if (currentViewMode === 'sheet') {
        if (viewingDatabaseId) {
            return { mode: 'view-db', dbId: viewingDatabaseId };
        }
        return { mode: 'view-local', characterId: viewingCharacterId };
    }
    if (currentStep === 0) {
        return { mode: 'home', step: 0 };
    }
    return { mode: 'create', step: currentStep, draftId: activeDraftId || undefined };
}

function pushAppHistory(replace = false) {
    syncAppHistory(getAppNavigationState(), { replace });
    persistCreationDraftIfCreating();
}

function showCreationChrome() {
    if (btnNext) btnNext.style.display = 'inline-block';
    if (btnBack) btnBack.style.display = 'inline-block';
}

function hideCreationChrome() {
    const navigationContainer = document.getElementById('navigation-container');
    if (navigationContainer) {
        navigationContainer.style.display = 'none';
    }
    if (btnNext) btnNext.style.display = 'none';
    if (btnBack) btnBack.style.display = 'none';
    if (progressBarContainer) progressBarContainer.style.display = 'none';
}

async function applyNavigationFromHistory(state) {
    const navState = state?.mode ? state : { mode: 'home', step: 0 };

    if (isLeavingSheetView(navState, viewingCharacterId)) {
        const canLeave = await confirmLeaveSheetIfDirty();
        if (!canLeave) {
            pushAppHistory(true);
            return;
        }
        resetSheetEditState();
    }

    switch (navState.mode) {
        case 'home':
            viewingCharacterId = null;
            viewingDatabaseId = null;
            currentViewMode = 'list';
            currentStep = 0;
            isLoadingSharedCharacter = false;
            activeDraftId = null;
            clearActiveUnfinishedDraftReference();
            showCreationChrome();
            resetCharacter();
            await renderCurrentStep(false);
            break;
        case 'create': {
            viewingCharacterId = null;
            viewingDatabaseId = null;
            currentViewMode = 'creation';
            const requestedStep = Math.min(Math.max(0, navState.step ?? 0), steps.length - 1);
            const draft = resolveUnfinishedDraftForResume(navState.draftId);

            if (requestedStep > 0 && !draft) {
                await applyNavigationFromHistory({ mode: 'home', step: 0 });
                break;
            }

            if (draft) {
                applyUnfinishedDraftToSession(draft);
            } else {
                resetCharacter();
            }

            currentStep = requestedStep > 0 ? requestedStep : 1;
            showCreationChrome();
            await renderCurrentStep(false);
            persistCreationDraftIfCreating();
            break;
        }
        case 'view-local':
            if (navState.characterId) {
                renderLocalCharacterView(navState.characterId);
            } else {
                await applyNavigationFromHistory({ mode: 'home', step: 0 });
            }
            break;
        case 'view-db':
            if (navState.dbId) {
                await renderDatabaseCharacterView(navState.dbId);
            } else {
                await applyNavigationFromHistory({ mode: 'home', step: 0 });
            }
            break;
        default:
            await applyNavigationFromHistory({ mode: 'home', step: 0 });
    }
}

function scrollToCharacterOnHome(characterId) {
    if (!characterId) return;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const card = document.querySelector(
                `#home-section-mine .character-card[data-character-id="${characterId}"]`
            );
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            document.getElementById('home-section-mine')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function scheduleScrollToCharacterOnHome(characterId) {
    scrollToCharacterIdOnHome = characterId || null;
}

function saveAgentAndOpenSheet() {
    if (!validateStep(currentStep, true)) return;

    saveStepData(currentStep);
    autoSaveCharacter();
    clearActiveCreationDraft();

    const savedId = getCharacter().id;
    if (!savedId) return;

    autoUploadCharacter();
    openCharacterSheet(savedId);
}

function openCharacterSheet(characterId) {
    renderLocalCharacterView(characterId);
    if (!isNavigatingFromHistory()) {
        pushAppHistory();
    }
}

/** Scroll to the top of the step content smoothly */
function scrollToStepTop() {
    requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            if (stepContainer) {
                stepContainer.removeAttribute('aria-busy');
            }
        }, 300);
    });
}

export function updateNavigationButtons() {
    if (currentViewMode === 'sheet') {
        hideCreationChrome();
        return;
    }

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
    if (btnBack) {
        btnBack.setAttribute('aria-label', t('aria_prev_step'));
    }

    if (currentStep === steps.length - 1) {
        btnNext.style.display = 'inline-block';
        btnNext.textContent = t('btn_save_and_edit');
        btnNext.disabled = false;
        btnNext.removeAttribute('aria-disabled');
        btnNext.setAttribute('aria-label', t('aria_save_and_edit'));
        const newBtnNext = btnNext.cloneNode(true);
        btnNext.parentNode.replaceChild(newBtnNext, btnNext);
        btnNext = newBtnNext;
        btnNext.addEventListener('click', saveAgentAndOpenSheet);
    } else {
        btnNext.style.display = 'inline-block';
        btnNext.textContent = t('btn_next_text');
        
        // Remove existing event listeners and re-add default handler
        const newBtnNext = btnNext.cloneNode(true);
        btnNext.parentNode.replaceChild(newBtnNext, btnNext);
        btnNext = newBtnNext;
        btnNext.addEventListener('click', handleNextStep);
        btnNext.disabled = false;
        btnNext.removeAttribute('aria-disabled');
        btnNext.setAttribute('aria-label', t('aria_next_step'));
    }
}

export function getCurrentCharacterData() {
    return getCharacter();
}

async function restoreAppNavigationOnLoad() {
    isRestoringNavigation = true;
    try {
        const urlState = appStateFromUrl();
        const sessionState = loadAppNavigationState();
        let urlNavState = urlState || sessionState;

        if (urlNavState && sessionState) {
            urlNavState = {
                ...sessionState,
                ...urlState,
                draftId: urlState?.draftId || sessionState.draftId
            };
        }

        if (urlNavState) {
            syncAppHistory(urlNavState, { replace: true });

            if (urlNavState.mode === 'home') {
                resetCharacter();
                activeDraftId = null;
            } else if (urlNavState.mode === 'create') {
                const draft = resolveUnfinishedDraftForResume(urlNavState.draftId);
                if (draft) {
                    applyUnfinishedDraftToSession(draft);
                } else if ((urlNavState.step ?? 0) > 0) {
                    syncAppHistory({ mode: 'home', step: 0 }, { replace: true });
                    resetCharacter();
                    activeDraftId = null;
                    await renderCurrentStep(false);
                    return;
                } else {
                    resetCharacter();
                }
            }

            await applyNavigationFromHistory(urlNavState);
            return;
        }

        resetCharacter();
        activeDraftId = null;
        syncAppHistory({ mode: 'home', step: 0 }, { replace: true });
        await renderCurrentStep(false);
    } finally {
        isRestoringNavigation = false;
    }
}

function bindCreationDraftPersistence() {
    window.addEventListener('beforeunload', () => {
        persistCreationDraftIfCreating();
    });
}

export async function initializeApp() {
    console.log('app.js: initializeApp() called');

    stepContainer = document.getElementById('step-content-container');
    progressBarContainer = document.getElementById('progress-bar-container');
    btnNext = document.getElementById('btn-next');
    btnBack = document.getElementById('btn-back');

    console.log('app.js: DOM elements found:', {
        stepContainer: !!stepContainer,
        progressBarContainer: !!progressBarContainer,
        btnNext: !!btnNext,
        btnBack: !!btnBack
    });

    btnNext.addEventListener('click', handleNextStep);
    btnBack.addEventListener('click', handlePreviousStep);

    initKeyboardNavigation();
    initAppHistory(applyNavigationFromHistory);
    bindCreationDraftPersistence();

    const sharedCharacterData = getCharacterFromUrl();
    if (sharedCharacterData) {
        console.log('app.js: Shared character detected, skipping intro render');
        isLoadingSharedCharacter = true;
        resetCharacter();
    } else {
        await restoreAppNavigationOnLoad();
    }
}

async function continueUnfinishedDraft(draftId) {
    const draft = getUnfinishedDraftById(draftId);
    if (!draft) {
        return;
    }

    applyUnfinishedDraftToSession(draft);
    viewingCharacterId = null;
    viewingDatabaseId = null;
    currentViewMode = 'creation';
    currentStep = Math.min(Math.max(1, draft.step), steps.length - 1);
    isLoadingSharedCharacter = false;

    showCreationChrome();
    await renderCurrentStep(false);
    pushAppHistory();
}

async function discardUnfinishedDraft(draftId) {
    const draft = getUnfinishedDraftById(draftId);
    if (!draft) {
        return;
    }

    const { showConfirmDialog } = await import('./utils/modal.js?v=99fd89c');
    const confirmed = await showConfirmDialog({
        title: t('discard_unfinished_title'),
        message: t('confirm_discard_unfinished', { name: draft.name }),
        confirmLabel: t('btn_discard_unfinished'),
        cancelLabel: t('modal_cancel'),
        danger: true
    });

    if (!confirmed) {
        return;
    }

    removeUnfinishedDraft(draftId);
    if (activeDraftId === draftId) {
        activeDraftId = null;
    }

    if (currentStep === 0 && currentViewMode !== 'sheet') {
        await renderCurrentStep(true);
    }
}

// View character function
function renderLocalCharacterView(characterId) {
    viewingCharacterId = characterId;
    viewingDatabaseId = null;
    currentViewMode = 'sheet';

    hideCreationChrome();

    stepContainer.innerHTML = renderCharacterView(characterId);
    translateAllElements(stepContainer);
    attachCharacterViewListeners(characterId);
    scrollToStepTop();
    completeAppLoading();
}

function viewCharacter(characterId) {
    renderLocalCharacterView(characterId);
    if (!isNavigatingFromHistory()) {
        pushAppHistory();
    }
}

function viewCharacterAndPrint(characterId) {
    viewCharacter(characterId);
    requestAnimationFrame(() => {
        window.setTimeout(() => {
            triggerSheetPrint();
        }, 400);
    });
}

// View character from database
async function renderDatabaseCharacterView(dbId) {
    viewingCharacterId = null;
    viewingDatabaseId = dbId;
    currentViewMode = 'sheet';

    hideCreationChrome();

    try {
        const { getPublicCharacterById } = await import('./utils/database.js?v=99fd89c');
        const characterDoc = await getPublicCharacterById(dbId);

        if (!characterDoc) {
            alert(t('character_not_found') || 'Character not found.');
            await applyNavigationFromHistory({ mode: 'home', step: 0 });
            return;
        }

        const characterData = {
            id: null,
            dbId: characterDoc.id,
            name: characterDoc.name,
            profession: characterDoc.profession,
            data: characterDoc.data,
            createdDate: characterDoc.createdDate || characterDoc.uploadedAt
        };

        stepContainer.innerHTML = renderCharacterView(null, characterData);
        translateAllElements(stepContainer);
        attachCharacterViewListeners(null, characterData);
        scrollToStepTop();
        completeAppLoading();
    } catch (error) {
        console.error('Error viewing database character:', error);
        alert(t('character_not_found') || 'Error loading character.');
        await applyNavigationFromHistory({ mode: 'home', step: 0 });
    }
}

async function viewDatabaseCharacter(dbId) {
    await renderDatabaseCharacterView(dbId);
    if (!isNavigatingFromHistory()) {
        pushAppHistory();
    }
}

// Return to list function
async function returnToList() {
    if (currentViewMode === 'sheet' && viewingCharacterId) {
        const canLeave = await confirmLeaveSheetIfDirty();
        if (!canLeave) {
            return;
        }
    }

    resetSheetEditState();
    viewingCharacterId = null;
    viewingDatabaseId = null;
    currentViewMode = 'list';
    currentStep = 0;
    isLoadingSharedCharacter = false;

    showCreationChrome();

    resetCharacter();
    renderCurrentStep(false);
    if (!isNavigatingFromHistory()) {
        pushAppHistory();
    }
}

function resolveProfessionNameForImport(characterData) {
    if (characterData.professionKey === 'custom_profession') {
        return characterData.customProfessionName || 'Custom Profession';
    }
    if (characterData.professionKey && PROFESSIONS[characterData.professionKey]) {
        return PROFESSIONS[characterData.professionKey].nameKey;
    }
    return 'Unknown';
}

async function failSharedCharacterImport(message) {
    isLoadingSharedCharacter = false;
    alert(message || t('import_error') || 'Error importing shared character');
    await restoreAppNavigationOnLoad();
}

// Handle shared character from URL — always import into local storage
export async function processSharedCharacterLink(characterData) {
    if (!characterData) {
        return;
    }

    isLoadingSharedCharacter = true;

    const validation = validateImportedCharacter(characterData);
    if (!validation.valid) {
        await failSharedCharacterImport(
            `${t('import_error') || 'Error importing character'}: ${validation.error}`
        );
        return;
    }

    if (isStorageFull()) {
        await failSharedCharacterImport(t('storage_limit_reached', { limit: getStorageLimit() }));
        return;
    }

    try {
        const importPayload = JSON.parse(JSON.stringify(characterData));
        normalizeSheetCharacterFields(importPayload);

        const characterName = importPayload.personalInfo?.name || 'Unnamed Agent';
        const characterId = importCharacter({
            name: characterName,
            profession: resolveProfessionNameForImport(importPayload),
            data: importPayload
        });

        if (!characterId) {
            await failSharedCharacterImport();
            return;
        }

        syncAppHistory({ mode: 'view-local', characterId }, { replace: true });
        renderLocalCharacterView(characterId);

        setTimeout(() => {
            isLoadingSharedCharacter = false;
        }, 300);
    } catch (error) {
        console.error('Error handling shared character:', error);
        await failSharedCharacterImport();
    }
}

function handleSharedCharacter(characterData) {
    processSharedCharacterLink(characterData);
}

// Make app available globally for i18n system
window.app = {
    renderCurrentStep,
    getCurrentCharacterData,
    viewCharacter,
    viewCharacterAndPrint,
    viewDatabaseCharacter,
    returnToList,
    handleSharedCharacter,
    processSharedCharacterLink,
    isLoadingSharedCharacter: () => isLoadingSharedCharacter,
    isRestoringNavigation: () => isRestoringNavigation,
    isInSheetView: () => currentViewMode === 'sheet',
    handleNextStep,
    continueUnfinishedDraft,
    discardUnfinishedDraft,
    scheduleScrollToCharacterOnHome,
    uploadToLibraryIfEnabled: () => autoUploadCharacter(),
    prepareSheetForPrint: prepareSheetSummaryForPrint,
    triggerSheetPrint,
    syncLibraryLanguageFilterWithUi
};

