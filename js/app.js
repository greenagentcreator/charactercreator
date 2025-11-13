// Main application logic for Delta Green Character Creator

import { t, translateAllElements } from './i18n/i18n.js';
import { getCurrentLanguage } from './i18n/i18n.js';
import { resetCharacter, getCharacter } from './model/character.js';
import { initErrorContainer, clearErrors } from './utils/validation.js';
import { initKeyboardNavigation, focusFirstInput } from './utils/keyboard.js';
import { renderIntro } from './steps/step0-intro.js';
import { renderStep1_ProfessionSkills, validateStep1, saveStep1, attachStep1Listeners } from './steps/step1-profession.js';
import { renderStep2_Statistics, validateStep2, saveStep2, attachStep2Listeners } from './steps/step2-statistics.js';
import { renderStep3_DerivedAttributes, validateStep3, saveStep3, attachStep3Listeners } from './steps/step3-derived.js';
import { renderStep4_BondsMotivations, validateStep4, saveStep4, attachStep4Listeners } from './steps/step4-bonds.js';
import { renderStep5_Summary, validateStep5, saveStep5, attachStep5Listeners } from './steps/step5-summary.js';

let currentStep = 0;
let stepContainer, progressBarContainer, btnNext, btnBack;

// Define steps array
const steps = [
    { render: renderIntro, validate: () => true, save: () => {}, nameKey: "step_name_0" },
    { render: renderStep1_ProfessionSkills, validate: validateStep1, save: saveStep1, nameKey: "step_name_1", attachListeners: attachStep1Listeners },
    { render: renderStep2_Statistics, validate: validateStep2, save: saveStep2, nameKey: "step_name_2", attachListeners: attachStep2Listeners },
    { render: renderStep3_DerivedAttributes, validate: validateStep3, save: saveStep3, nameKey: "step_name_3", attachListeners: attachStep3Listeners },
    { render: renderStep4_BondsMotivations, validate: validateStep4, save: saveStep4, nameKey: "step_name_4", attachListeners: attachStep4Listeners },
    { render: renderStep5_Summary, validate: validateStep5, save: saveStep5, nameKey: "step_name_5", attachListeners: attachStep5Listeners }
];

function renderCurrentStep() {
    if (steps[currentStep] && typeof steps[currentStep].render === 'function') {
        const stepData = steps[currentStep];
        const stepContentOrHtml = stepData.render();
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
        updateProgressBar(); 
        updateNavigationButtons();
        // Focus first input after a short delay to ensure DOM is ready
        // Use requestAnimationFrame to ensure DOM is fully rendered
        requestAnimationFrame(() => {
            setTimeout(() => {
                focusFirstInput();
            }, 150);
        }); 
    }
}

function updateProgressBar() {
    // Clear existing content
    progressBarContainer.innerHTML = '';
    
    // Create stepper container
    const stepper = document.createElement('div');
    stepper.className = 'progress-stepper';
    stepper.setAttribute('role', 'navigation');
    stepper.setAttribute('aria-label', 'Step navigation');
    
    // Create progress line
    const progressLine = document.createElement('div');
    progressLine.className = 'progress-stepper-line';
    const progressPercent = (currentStep / (steps.length - 1)) * 100;
    progressLine.style.width = `${progressPercent}%`;
    stepper.appendChild(progressLine);
    
    // Create step indicators
    steps.forEach((step, index) => {
        const stepIndicator = document.createElement('div');
        stepIndicator.className = 'step-indicator';
        stepIndicator.setAttribute('role', 'button');
        stepIndicator.setAttribute('tabindex', index === currentStep ? '0' : '-1');
        stepIndicator.setAttribute('aria-label', `Step ${index + 1}: ${t(step.nameKey)}`);
        
        if (index === currentStep) {
            stepIndicator.classList.add('current');
            stepIndicator.setAttribute('aria-current', 'step');
        } else if (index < currentStep) {
            stepIndicator.classList.add('completed');
        }
        
        // Step circle
        const circle = document.createElement('div');
        circle.className = 'step-circle';
        circle.textContent = index + 1;
        stepIndicator.appendChild(circle);
        
        // Step label
        const label = document.createElement('div');
        label.className = 'step-label';
        label.textContent = t(step.nameKey);
        stepIndicator.appendChild(label);
        
        // Make completed steps clickable (optional - allow jumping back)
        if (index < currentStep) {
            stepIndicator.addEventListener('click', () => {
                if (index < currentStep) {
                    // Validate current step before allowing navigation
                    if (validateStep(currentStep, false)) {
                        saveStepData(currentStep);
                        currentStep = index;
                        renderCurrentStep();
                    }
                }
            });
            stepIndicator.addEventListener('keydown', (e) => {
                if ((e.key === 'Enter' || e.key === ' ') && index < currentStep) {
                    e.preventDefault();
                    if (validateStep(currentStep, false)) {
                        saveStepData(currentStep);
                        currentStep = index;
                        renderCurrentStep();
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
    announcement.textContent = t('progress_bar_text', { current: currentStep, total: steps.length - 1, stepName: stepName });
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
    btnBack.disabled = currentStep === 0;
    const character = getCharacter();

    if (currentStep === steps.length - 1) {
        btnNext.style.display = 'none';
    } else {
        btnNext.style.display = 'inline-block';
        btnNext.textContent = t('btn_next_text');
        
        let isStepValid = validateStep(currentStep, false);

        if (currentStep === 1 && character.isCustomProfession) {
            if (character.customProfessionSetupStage === 'bonds' || character.customProfessionSetupStage === 'skills') {
                btnNext.disabled = true;
            } else {
                btnNext.disabled = !isStepValid;
            }
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
    
    renderCurrentStep();
}

// Make app available globally for i18n system
window.app = {
    renderCurrentStep,
    getCurrentCharacterData
};

