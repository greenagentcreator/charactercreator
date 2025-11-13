// Main application logic for Delta Green Character Creator

import { t, translateAllElements } from './i18n/i18n.js';
import { getCurrentLanguage } from './i18n/i18n.js';
import { resetCharacter, getCharacter } from './model/character.js';
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
        translateAllElements(stepContainer);
        if (stepData.attachListeners) {
            stepData.attachListeners();
        }
        updateProgressBar(); 
        updateNavigationButtons(); 
    }
}

function updateProgressBar() {
    const stepName = t(steps[currentStep].nameKey) || `Step ${currentStep}`;
    progressBarContainer.textContent = t('progress_bar_text', { current: currentStep, total: steps.length - 1, stepName: stepName });
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
        currentStep++;
        renderCurrentStep();
    }
}

function handlePreviousStep() {
    if (currentStep > 0) {
        currentStep--;
        renderCurrentStep();
    }
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
    
    renderCurrentStep();
}

// Make app available globally for i18n system
window.app = {
    renderCurrentStep,
    getCurrentCharacterData
};

