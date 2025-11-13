// Step 4.3: Traumatic Background
// This module handles traumatic background selection

import { getCharacter } from '../model/character.js';
import { PROFESSIONS } from '../config/professions.js';
import { ALL_SKILLS } from '../config/skills.js';
import { t } from '../i18n/i18n.js';
import { updateNavigationButtons } from '../app.js';
import { findSkillInstance, modifySkillValue, calculateDerivedAttributes } from '../model/character.js';

// Remove all traumatic background effects
function removeTraumaticBackgroundEffects() {
    const character = getCharacter();
    const oldBg = character.traumaticBackground;
    if (!oldBg) return;

    // Store base POW before removing effects if it was Captivity
    if (oldBg === 'captivity' && character.basePOW !== null) {
        character.stats.POW = character.basePOW;
        character.basePOW = null;
    }

    // Remove skill modifications
    if (oldBg === 'extreme_violence' || oldBg === 'captivity' || oldBg === 'hard_experience') {
        modifySkillValue('occult', -10); // Remove +10% occult
    } else if (oldBg === 'things_man_was_not_meant_to_know') {
        modifySkillValue('occult', -20); // Remove +20% occult
        modifySkillValue('unnatural', -10); // Remove +10% Unnatural
    }

    // Remove Hard Experience skill bonuses
    if (oldBg === 'hard_experience' && character.traumaticBackgroundEffects?.hardExperienceSkills) {
        character.traumaticBackgroundEffects.hardExperienceSkills.forEach(skillKey => {
            if (skillKey) {
                modifySkillValue(skillKey, -10);
            }
        });
    }
    
    // Restore removed bond if Hard Experience was selected (regardless of what we're switching to)
    if (oldBg === 'hard_experience' && character.traumaticBackgroundEffects?.removedBondIndex !== undefined && 
        character.traumaticBackgroundEffects?.removedBond !== undefined) {
        const removedIndex = character.traumaticBackgroundEffects.removedBondIndex;
        const removedBond = character.traumaticBackgroundEffects.removedBond;
        // Restore the bond at the original position
        // Rebuild complete bonds array to ensure correct insertion
        const allBonds = [...character.bonds];
        allBonds.splice(removedIndex, 0, removedBond);
        character.bonds = allBonds;
    }

    // Restore CHA for Extreme Violence
    if (oldBg === 'extreme_violence') {
        character.stats.CHA += 3;
        // Update all bond scores
        const chaScore = character.stats.CHA || 0;
        character.bonds.forEach(bond => bond.score = chaScore);
    }

    // Clear adaptations and disorder
    character.adaptations = [];
    character.disorder = null;
    character.traumaticBackgroundEffects = {};
    character.traumaticBackgroundEffects._effectsApplied = false;
}

// Apply traumatic background effects
function applyTraumaticBackgroundEffects(backgroundType) {
    const character = getCharacter();
    if (!backgroundType || backgroundType === 'none') {
        removeTraumaticBackgroundEffects();
        character.traumaticBackground = null;
        calculateDerivedAttributes();
        return;
    }

    // Store base POW for Captivity (POW reduction doesn't affect SAN)
    if (backgroundType === 'captivity' && character.basePOW === null) {
        character.basePOW = character.stats.POW;
    }

    // Apply skill modifications
    if (backgroundType === 'extreme_violence' || backgroundType === 'captivity' || backgroundType === 'hard_experience') {
        modifySkillValue('occult', 10); // +10% occult
    } else if (backgroundType === 'things_man_was_not_meant_to_know') {
        modifySkillValue('occult', 20); // +20% occult
        modifySkillValue('unnatural', 10); // +10% Unnatural
    }

    // Apply stat modifications
    if (backgroundType === 'extreme_violence') {
        character.stats.CHA = Math.max(3, character.stats.CHA - 3); // -3 CHA
        // Update all bond scores
        const chaScore = character.stats.CHA || 0;
        character.bonds.forEach(bond => bond.score = chaScore);
        character.adaptations = ['Adapted to Violence'];
    } else if (backgroundType === 'captivity') {
        character.stats.POW = Math.max(3, character.stats.POW - 3); // -3 POW (doesn't affect SAN)
        character.adaptations = ['Adapted to helplessness'];
    }

    // Apply Hard Experience effects (skills will be applied when selected)
    if (backgroundType === 'hard_experience') {
        if (!character.traumaticBackgroundEffects.hardExperienceSkills) {
            character.traumaticBackgroundEffects.hardExperienceSkills = ['', '', '', ''];
        }
    }

    character.traumaticBackground = backgroundType;
    character.traumaticBackgroundEffects._effectsApplied = true;
    calculateDerivedAttributes();
}

export function renderStep4_TraumaticBackground() {
    const character = getCharacter();
    
    // Ensure traumatic background effects are applied if a background is already selected
    if (character.traumaticBackground && !character.traumaticBackgroundEffects._effectsApplied) {
        applyTraumaticBackgroundEffects(character.traumaticBackground);
        character.traumaticBackgroundEffects._effectsApplied = true;
    }
    
    // Get number of bonds for Hard Experience bond removal dropdown
    let numberOfBonds = 0;
    if (character.isCustomProfession) {
        numberOfBonds = character.customProfessionBonds;
    } else if (character.professionKey && PROFESSIONS[character.professionKey]) {
        numberOfBonds = PROFESSIONS[character.professionKey].bonds;
    } else {
        // Fallback: use current bonds array length + removed bond if any
        numberOfBonds = character.bonds.length;
        if (character.traumaticBackgroundEffects?.removedBondIndex !== undefined) {
            numberOfBonds += 1; // Add back the removed bond
        }
    }

    let html = `<div class="step" id="step4-traumatic-background">
        <h2 data-i18n="step4_3_traumatic_background_title"></h2>
        <div class="info-box">
            <p data-i18n="step4_3_traumatic_background_info"></p>
        </div>
        <div class="info-box warning-box">
            <p data-i18n="step4_traumatic_background_warning"></p>
        </div>
        <div id="traumatic-background-container">
            <div class="traumatic-background-option">
                <input type="radio" id="traumatic-background-none" name="traumatic-background" value="none" 
                       ${!character.traumaticBackground ? 'checked' : ''}>
                <label for="traumatic-background-none" data-i18n="traumatic_background_none"></label>
            </div>
            <div class="traumatic-background-option">
                <input type="radio" id="traumatic-background-extreme-violence" name="traumatic-background" value="extreme_violence"
                       ${character.traumaticBackground === 'extreme_violence' ? 'checked' : ''}>
                <label for="traumatic-background-extreme-violence" data-i18n="traumatic_background_extreme_violence"></label>
                <p class="traumatic-background-description" data-i18n="traumatic_background_extreme_violence_desc"></p>
            </div>
            <div class="traumatic-background-option">
                <input type="radio" id="traumatic-background-captivity" name="traumatic-background" value="captivity"
                       ${character.traumaticBackground === 'captivity' ? 'checked' : ''}>
                <label for="traumatic-background-captivity" data-i18n="traumatic_background_captivity"></label>
                <p class="traumatic-background-description" data-i18n="traumatic_background_captivity_desc"></p>
            </div>
            <div class="traumatic-background-option">
                <input type="radio" id="traumatic-background-hard-experience" name="traumatic-background" value="hard_experience"
                       ${character.traumaticBackground === 'hard_experience' ? 'checked' : ''}>
                <label for="traumatic-background-hard-experience" data-i18n="traumatic_background_hard_experience"></label>
                <p class="traumatic-background-description" data-i18n="traumatic_background_hard_experience_desc"></p>
                <div id="hard-experience-skills-container" class="traumatic-background-subsection" 
                     style="display: ${character.traumaticBackground === 'hard_experience' ? 'block' : 'none'}; margin-top: 10px;">
                    <p data-i18n="hard_experience_skill_selection_label"></p>
                    <div class="hard-experience-bond-removal">
                        <label for="hard-experience-bond-remove" data-i18n="hard_experience_bond_removal_label"></label>
                        <select id="hard-experience-bond-remove" class="hard-experience-bond-dropdown">
                            <option value="">${t('select_one_option')}</option>`;
    
    // Add bond removal dropdown options
    const removedBondIndex = character.traumaticBackgroundEffects?.removedBondIndex;
    const removedBond = character.traumaticBackgroundEffects?.removedBond;
    
    // First, rebuild the complete bonds array (including removed bond) to get correct original indices
    // Create an array of the original size, then fill in bonds at their correct positions
    const allBondsComplete = [];
    
    // Initialize array with empty bonds or placeholders
    for (let i = 0; i < numberOfBonds; i++) {
        allBondsComplete.push(null);
    }
    
    // Fill in current bonds - they should be in order, just missing the removed one
    if (character.bonds && character.bonds.length > 0) {
        let currentBondIndex = 0;
        for (let originalIndex = 0; originalIndex < numberOfBonds; originalIndex++) {
            // Skip the removed bond's position
            if (removedBondIndex === originalIndex) {
                continue;
            }
            // Place current bond at this original position
            if (currentBondIndex < character.bonds.length) {
                allBondsComplete[originalIndex] = character.bonds[currentBondIndex];
                currentBondIndex++;
            }
        }
    }
    
    // Insert removed bond at its original position if it exists
    if (removedBond && removedBondIndex !== undefined && removedBondIndex < numberOfBonds) {
        allBondsComplete[removedBondIndex] = removedBond;
    }
    
    // Replace any null entries with placeholder bonds
    for (let i = 0; i < allBondsComplete.length; i++) {
        if (allBondsComplete[i] === null) {
            allBondsComplete[i] = { 
                description: `${t('bond_label_number', {number: i + 1})}`, 
                score: 0 
            };
        }
    }
    
    // Now create dropdown options with correct original indices
    allBondsComplete.forEach((bond, originalIndex) => {
        const isSelected = removedBondIndex === originalIndex ? 'selected' : '';
        const bondDesc = bond.description || `${t('bond_label_number', {number: originalIndex + 1})}`;
        html += `<option value="${originalIndex}" ${isSelected}>${bondDesc}</option>`;
    });
    
    html += `</select></div>`;
    
    // Add 4 skill selection dropdowns for Hard Experience
    const selectedSkills = character.traumaticBackgroundEffects?.hardExperienceSkills || ['', '', '', ''];
    for (let i = 0; i < 4; i++) {
        const selectedSkill = selectedSkills[i] || '';
        html += `<div class="hard-experience-skill-select">
                    <label for="hard-experience-skill-${i}" data-i18n="hard_experience_skill_label" data-i18n-replacements='{"number":"${i + 1}"}'>${t('hard_experience_skill_label', {number: i + 1})}</label>
                    <select id="hard-experience-skill-${i}" class="hard-experience-skill-dropdown" data-skill-index="${i}">
                        <option value="">${t('select_one_option')}</option>`;
        
        // Add all skills except Unnatural and already selected skills (from other dropdowns)
        for (const skillKey in ALL_SKILLS) {
            if (skillKey !== 'unnatural' && ALL_SKILLS.hasOwnProperty(skillKey)) {
                // Skip if this skill is selected in another dropdown
                const isSelectedInOther = selectedSkills.some((sk, idx) => idx !== i && sk === skillKey);
                if (isSelectedInOther) continue;
                
                const skillName = t(ALL_SKILLS[skillKey].nameKey);
                const isSelected = selectedSkill === skillKey ? 'selected' : '';
                html += `<option value="${skillKey}" ${isSelected}>${skillName}</option>`;
            }
        }
        html += `</select></div>`;
    }
    
    html += `</div>
            </div>
            <div class="traumatic-background-option">
                <input type="radio" id="traumatic-background-things-man" name="traumatic-background" value="things_man_was_not_meant_to_know"
                       ${character.traumaticBackground === 'things_man_was_not_meant_to_know' ? 'checked' : ''}>
                <label for="traumatic-background-things-man" data-i18n="traumatic_background_things_man"></label>
                <p class="traumatic-background-description" data-i18n="traumatic_background_things_man_desc"></p>
                <div id="things-man-disorder-container" class="traumatic-background-subsection"
                     style="display: ${character.traumaticBackground === 'things_man_was_not_meant_to_know' ? 'block' : 'none'}; margin-top: 10px;">
                    <label for="disorder-input" data-i18n="disorder_label"></label>
                    <input type="text" id="disorder-input" class="disorder-input" 
                           value="${character.disorder || ''}" 
                           placeholder="${t('disorder_placeholder')}">
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

export function attachStep4_3Listeners() {
    const character = getCharacter();

    // Traumatic background radio button listeners
    const traumaticBackgroundRadios = document.querySelectorAll('input[name="traumatic-background"]');
    traumaticBackgroundRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            const newBg = selectedValue === 'none' ? null : selectedValue;
            
            // Remove old effects
            removeTraumaticBackgroundEffects();
            
            // Apply new effects
            if (newBg) {
                applyTraumaticBackgroundEffects(newBg);
            } else {
                character.traumaticBackground = null;
                calculateDerivedAttributes();
            }

            // Show/hide conditional UI elements
            const hardExperienceContainer = document.getElementById('hard-experience-skills-container');
            const thingsManContainer = document.getElementById('things-man-disorder-container');
            
            if (hardExperienceContainer) {
                hardExperienceContainer.style.display = newBg === 'hard_experience' ? 'block' : 'none';
            }
            if (thingsManContainer) {
                thingsManContainer.style.display = newBg === 'things_man_was_not_meant_to_know' ? 'block' : 'none';
            }

            // Re-render to update bond scores if CHA changed
            if (newBg === 'extreme_violence' || character.traumaticBackground === 'extreme_violence') {
                if (window.app && window.app.renderCurrentStep) {
                    window.app.renderCurrentStep(true); // Skip focus
                }
            }
        });
    });

    // Hard Experience skill selection listeners
    const hardExperienceSkillDropdowns = document.querySelectorAll('.hard-experience-skill-dropdown');
    hardExperienceSkillDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', (event) => {
            const skillIndex = parseInt(event.target.dataset.skillIndex);
            const selectedSkill = event.target.value;
            
            // Remove old skill bonus if there was one
            const oldSkill = character.traumaticBackgroundEffects?.hardExperienceSkills?.[skillIndex];
            if (oldSkill && oldSkill !== selectedSkill) {
                modifySkillValue(oldSkill, -10);
            }
            
            // If the new skill was selected in another dropdown, remove it from there first
            if (selectedSkill) {
                const currentSelections = character.traumaticBackgroundEffects?.hardExperienceSkills || ['', '', '', ''];
                const otherIndex = currentSelections.findIndex((sk, idx) => idx !== skillIndex && sk === selectedSkill);
                if (otherIndex !== -1) {
                    // Remove the skill from the other dropdown
                    modifySkillValue(selectedSkill, -10);
                    character.traumaticBackgroundEffects.hardExperienceSkills[otherIndex] = '';
                    // Update the other dropdown UI
                    const otherDropdown = document.getElementById(`hard-experience-skill-${otherIndex}`);
                    if (otherDropdown) {
                        otherDropdown.value = '';
                    }
                }
                
                // Apply new skill bonus
                modifySkillValue(selectedSkill, 10);
            }
            
            // Update stored selections
            if (!character.traumaticBackgroundEffects.hardExperienceSkills) {
                character.traumaticBackgroundEffects.hardExperienceSkills = ['', '', '', ''];
            }
            character.traumaticBackgroundEffects.hardExperienceSkills[skillIndex] = selectedSkill;
            
            // Re-render to update all dropdowns (to show/hide skills based on selections)
            if (window.app && window.app.renderCurrentStep) {
                window.app.renderCurrentStep(true);
            }
        });
    });

    // Disorder input listener
    const disorderInput = document.getElementById('disorder-input');
    if (disorderInput) {
        disorderInput.addEventListener('input', (event) => {
            character.disorder = event.target.value;
        });
    }

    // Hard Experience bond removal listener
    const bondRemoveDropdown = document.getElementById('hard-experience-bond-remove');
    if (bondRemoveDropdown) {
        bondRemoveDropdown.addEventListener('change', (event) => {
            const selectedIndex = event.target.value === '' ? null : parseInt(event.target.value);
            
            // Get the original number of bonds (before any removal)
            let originalBondCount = 0;
            if (character.isCustomProfession) {
                originalBondCount = character.customProfessionBonds;
            } else if (character.professionKey && PROFESSIONS[character.professionKey]) {
                originalBondCount = PROFESSIONS[character.professionKey].bonds;
            } else {
                // Fallback: current bonds + removed bond if any
                originalBondCount = character.bonds.length;
                if (character.traumaticBackgroundEffects?.removedBondIndex !== undefined) {
                    originalBondCount += 1;
                }
            }
            
            // Rebuild the complete bonds array (including any previously removed bond)
            const allBonds = [];
            const removedBondIndex = character.traumaticBackgroundEffects?.removedBondIndex;
            const removedBond = character.traumaticBackgroundEffects?.removedBond;
            
            // Add all current bonds
            for (let i = 0; i < character.bonds.length; i++) {
                allBonds.push(character.bonds[i]);
            }
            
            // Insert removed bond at its original position if it exists
            if (removedBond && removedBondIndex !== undefined) {
                allBonds.splice(removedBondIndex, 0, removedBond);
            }
            
            // Now handle the new selection
            if (selectedIndex === null) {
                // No bond selected - restore all bonds
                character.bonds = [...allBonds];
                character.traumaticBackgroundEffects.removedBondIndex = undefined;
                character.traumaticBackgroundEffects.removedBond = undefined;
            } else {
                // A bond is selected for removal
                if (selectedIndex >= 0 && selectedIndex < allBonds.length) {
                    // Store the bond to be removed
                    character.traumaticBackgroundEffects.removedBond = allBonds[selectedIndex];
                    character.traumaticBackgroundEffects.removedBondIndex = selectedIndex;
                    
                    // Remove it from the array
                    allBonds.splice(selectedIndex, 1);
                    character.bonds = [...allBonds];
                }
            }
            
            // Re-render to update UI
            if (window.app && window.app.renderCurrentStep) {
                window.app.renderCurrentStep(true);
            }
        });
    }
}

export function validateStep4_3() {
    // Traumatic background is optional, so validation always passes
    return true;
}

export function saveStep4_3() {
    // Data is saved through event listeners
    // Just ensure effects are applied
    const character = getCharacter();
    if (character.traumaticBackground && !character.traumaticBackgroundEffects._effectsApplied) {
        applyTraumaticBackgroundEffects(character.traumaticBackground);
    }
}

