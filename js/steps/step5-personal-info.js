// Step 5: Personal Information
// This step collects personal details before showing the summary

import { getCharacter } from '../model/character.js';
import { t } from '../i18n/i18n.js';

export function renderStep5_PersonalInfo() {
    const character = getCharacter();
    const personalInfo = character.personalInfo || {};

    let html = `<div class="step" id="step5-personal-info">
        <h2 data-i18n="step5_personal_info_title"></h2>
        <div class="info-box">
            <p data-i18n="step5_personal_info_description"></p>
        </div>

        <div class="personal-info-form">
            <div class="form-group">
                <label for="character-name" data-i18n="personal_info_name_label"></label>
                <input type="text" id="character-name" class="form-input" 
                       value="${personalInfo.name || ''}" 
                       placeholder="${t('personal_info_name_placeholder')}">
            </div>

            <div class="form-group">
                <label for="character-employer" data-i18n="personal_info_employer_label"></label>
                <input type="text" id="character-employer" class="form-input" 
                       value="${personalInfo.employer || ''}" 
                       placeholder="${t('personal_info_employer_placeholder')}">
            </div>

            <div class="form-group">
                <label for="character-sex" data-i18n="personal_info_sex_label"></label>
                <input type="text" id="character-sex" class="form-input" 
                       value="${personalInfo.sex || ''}" 
                       placeholder="${t('personal_info_sex_placeholder')}">
            </div>

            <div class="form-group">
                <label for="character-nationality" data-i18n="personal_info_nationality_label"></label>
                <input type="text" id="character-nationality" class="form-input" 
                       value="${personalInfo.nationality || ''}" 
                       placeholder="${t('personal_info_nationality_placeholder')}">
            </div>

            <div class="form-group">
                <label for="character-age" data-i18n="personal_info_age_label"></label>
                <input type="number" id="character-age" class="form-input" 
                       value="${personalInfo.age || ''}" 
                       placeholder="${t('personal_info_age_placeholder')}" 
                       min="1" max="150">
            </div>

            <div class="form-group">
                <label for="character-dob" data-i18n="personal_info_dob_label"></label>
                <input type="text" id="character-dob" class="form-input" 
                       value="${personalInfo.dob || ''}" 
                       placeholder="${t('personal_info_dob_placeholder')}">
            </div>
        </div>
    </div>`;

    return html;
}

export function attachStep5_PersonalInfoListeners() {
    const character = getCharacter();
    
    // Initialize personalInfo if it doesn't exist
    if (!character.personalInfo) {
        character.personalInfo = {};
    }

    const nameInput = document.getElementById('character-name');
    const employerInput = document.getElementById('character-employer');
    const sexInput = document.getElementById('character-sex');
    const nationalityInput = document.getElementById('character-nationality');
    const ageInput = document.getElementById('character-age');
    const dobInput = document.getElementById('character-dob');

    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            character.personalInfo.name = e.target.value;
        });
    }

    if (employerInput) {
        employerInput.addEventListener('input', (e) => {
            character.personalInfo.employer = e.target.value;
        });
    }

    if (sexInput) {
        sexInput.addEventListener('input', (e) => {
            character.personalInfo.sex = e.target.value;
        });
    }

    if (nationalityInput) {
        nationalityInput.addEventListener('input', (e) => {
            character.personalInfo.nationality = e.target.value;
        });
    }

    if (ageInput) {
        ageInput.addEventListener('input', (e) => {
            character.personalInfo.age = e.target.value ? parseInt(e.target.value) : '';
        });
    }

    if (dobInput) {
        dobInput.addEventListener('input', (e) => {
            character.personalInfo.dob = e.target.value;
        });
    }
}

export function validateStep5_PersonalInfo() {
    // Personal info is optional, so validation always passes
    return true;
}

export function saveStep5_PersonalInfo() {
    // Data is saved through event listeners
    // Just ensure personalInfo object exists
    const character = getCharacter();
    if (!character.personalInfo) {
        character.personalInfo = {};
    }
}

