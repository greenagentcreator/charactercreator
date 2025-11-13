// Step 4: Bonds & Motivations
// This module handles bonds and motivations input

import { getCharacter } from '../model/character.js';
import { PROFESSIONS } from '../config/professions.js';
import { t } from '../i18n/i18n.js';
import { updateNavigationButtons } from '../app.js';
import { showInlineError, showFieldError } from '../utils/validation.js';

export function renderStep4_BondsMotivations() {
    const character = getCharacter();
    // 1. Bestimme die Anzahl der Bonds und den Startwert
    let numberOfBonds = 0;
    const chaScore = character.stats.CHA || 0; // Fallback auf 0, falls CHA noch nicht gesetzt

    if (character.isCustomProfession) {
        numberOfBonds = character.customProfessionBonds;
    } else if (character.professionKey && PROFESSIONS[character.professionKey]) {
        numberOfBonds = PROFESSIONS[character.professionKey].bonds;
    } else {
        // Fallback, sollte nicht oft eintreten, wenn Schritt 1 valide ist
        // Man könnte hier auch eine Standardanzahl nehmen oder eine Warnung ausgeben.
        // Für den Moment: 0, dann wird keine Bond-Eingabe gerendert, wenn kein Beruf.
    }

    // 2. Stelle sicher, dass das character.bonds Array die korrekte Länge hat
    // und die Scores initialisiert sind.
    // Wir erstellen das Array neu, um die richtige Anzahl sicherzustellen.
    // Bereits eingegebene Beschreibungen versuchen wir zu erhalten.
    const oldBonds = [...character.bonds]; // Kopie der alten Bonds
    character.bonds = [];
    for (let i = 0; i < numberOfBonds; i++) {
        character.bonds.push({
            description: oldBonds[i]?.description || "", // Behalte alte Beschreibung, wenn möglich
            score: chaScore // Setze Score basierend auf aktuellem CHA
        });
    }
    
    // Stelle sicher, dass character.motivations ein Array von 5 Strings ist
    if (!Array.isArray(character.motivations) || character.motivations.length !== 5) {
        const oldMotivations = Array.isArray(character.motivations) ? [...character.motivations] : [];
        character.motivations = ["", "", "", "", ""];
        for(let i=0; i < 5; i++) {
            if(oldMotivations[i]) character.motivations[i] = oldMotivations[i];
        }
    }


    let html = `<div class="step" id="step4-bonds-motivations">
        <h2 data-i18n="step4_title_bonds_motivations"></h2>
        <div class="info-box">
            <p data-i18n="step4_info_bonds_mot_intro"></p>
        </div>

        <!-- === BONDS === -->
        <h3 data-i18n="step4_1_bonds_title"></h3>
        <div class="info-box">
            <p data-i18n="step4_info_bonds1"></p>
            <p data-i18n="step4_info_bonds2"></p>
            <p data-i18n="step4_info_bonds3"></p>
            <p data-i18n="step4_info_bonds4"></p>
            <strong data-i18n="bond_examples_label"></strong>
            <p><small data-i18n="bond_examples_list"></small></p>
        </div>`;

    if (numberOfBonds > 0) {
        html += `<p data-i18n="num_bonds_for_profession" data-i18n-replacements='{"count":"${numberOfBonds}"}'>${t('num_bonds_for_profession', {count: numberOfBonds})}</p>`;
        html += `<div id="bonds-input-container">`;
        for (let i = 0; i < numberOfBonds; i++) {
            html += `<div class="bond-entry">
                        <label for="bond-desc-${i}" data-i18n="bond_label_number" data-i18n-replacements='{"number":"${i + 1}"}'>${t('bond_label_number', {number: i+1})}</label>
                        <input type="text" id="bond-desc-${i}" class="bond-description-input" data-bond-index="${i}" 
                               value="${character.bonds[i]?.description || ''}" 
                               placeholder="${t('bond_description_placeholder')}">
                        <span data-i18n="bond_score_label"></span> <span>${chaScore}</span>
                     </div>`;
        }
        html += `</div>`;
    } else {
        html += `<p><em>No bonds available for the current profession selection or CHA score not yet set.</em></p>`; // Fallback-Text
    }
    
    html += `<!-- === MOTIVATIONS === -->
        <h3 data-i18n="step4_2_motivations_title" style="margin-top: 30px;"></h3>
        <div class="info-box">
            <p data-i18n="step4_info_motivations1"></p>
            <p data-i18n="step4_info_motivations2"></p>
            <p data-i18n="step4_info_motivations3"></p>
        </div>
        <div id="motivations-input-container">`;
    for (let i = 0; i < 5; i++) {
        html += `<div class="motivation-entry">
                    <label for="motivation-${i}" data-i18n="motivation_label_number" data-i18n-replacements='{"number":"${i + 1}"}'>${t('motivation_label_number', {number: i+1})}</label>
                    <input type="text" id="motivation-${i}" class="motivation-input" data-motivation-index="${i}" 
                           value="${character.motivations[i] || ''}" 
                           placeholder="${t('motivation_placeholder')}">
                 </div>`;
    }
    html += `</div></div>`;
    return html;
}

export function attachStep4Listeners() {
    const character = getCharacter();
    const bondsContainer = document.getElementById('bonds-input-container');
    if (bondsContainer) {
        bondsContainer.addEventListener('input', (event) => {
            if (event.target.classList.contains('bond-description-input')) {
                const index = parseInt(event.target.dataset.bondIndex);
                if (character.bonds[index]) {
                    character.bonds[index].description = event.target.value;
                    updateNavigationButtons(); // Update button state when bond description changes
                }
            }
        });
    }

    const motivationsContainer = document.getElementById('motivations-input-container');
    if (motivationsContainer) {
        motivationsContainer.addEventListener('input', (event) => {
            if (event.target.classList.contains('motivation-input')) {
                const index = parseInt(event.target.dataset.motivationIndex);
                if (character.motivations && character.motivations[index] !== undefined) {
                    character.motivations[index] = event.target.value;
                    // Note: Motivations are optional, so we don't need to update navigation buttons here
                }
            }
        });
    }
}

export function validateStep4(showAlerts = true) {
    const character = getCharacter();
    // Check if all bonds have descriptions
    if (character.bonds && character.bonds.length > 0) {
        for (let i = 0; i < character.bonds.length; i++) {
            if (!character.bonds[i].description || character.bonds[i].description.trim() === "") {
                if (showAlerts) {
                    const bondInput = document.getElementById(`bond-${i}-description`);
                    if (bondInput) {
                        showFieldError(bondInput, t('alert_define_bonds'));
                    } else {
                        showInlineError(t('alert_define_bonds'));
                    }
                }
                return false;
            }
        }
    }
    return true;
}

export function saveStep4() {
    const character = getCharacter();
    // Die Daten (Bond-Beschreibungen, Bond-Scores, Motivationen) werden bereits
    // durch die Event-Listener (für Beschreibungen/Motivationen) und beim Rendern
    // (für Scores und Anzahl der Bonds) im character-Objekt aktualisiert.
    // Hier könnte man noch einmal sicherstellen, dass die Bond-Scores aktuell sind.
    const chaScore = character.stats.CHA || 0;
    character.bonds.forEach(bond => bond.score = chaScore);
    // console.log("Step 4 Data Saved:", JSON.parse(JSON.stringify(character.bonds)), JSON.parse(JSON.stringify(character.motivations)));
}
// STEP 5: SUMMARY