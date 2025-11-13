// Step 2: Statistics
// This module handles statistic generation methods (array, roll, point buy, manual) and assignment

import { getCharacter } from '../model/character.js';
import { STAT_ARRAYS, STAT_KEYS } from '../config/constants.js';
import { t, translateAllElements } from '../i18n/i18n.js';
import { updateNavigationButtons } from '../app.js';
import { showInlineError, showFieldError } from '../utils/validation.js';

export function renderStep2_Statistics() {
    const character = getCharacter();
    const TOTAL_POINT_BUY_POINTS = 72;

    let html = `<div class="step" id="step2-statistics">
        <h2 data-i18n="step_name_2"></h2>
        <div class="info-box">
            <p data-i18n="step2_info_stats"></p>
            <ul>`;
    STAT_KEYS.forEach(key => {
        html += `<li><strong>${t('stat_' + key.toLowerCase() + '_name')}</strong>: <span data-i18n="stat_${key.toLowerCase()}_desc"></span></li>`;
    });
    html += `</ul></div>

        <h3 data-i18n="step2_select_method_label"></h3>
        <div id="stat-method-selection" style="margin-bottom: 20px;">
            <label class="inline-label">
                <input type="radio" name="stat-method" value="array" ${character.statGenerationMethod === 'array' ? 'checked' : ''}>
                <span data-i18n="stat_method_array"></span>
            </label>
            <label class="inline-label">
                <input type="radio" name="stat-method" value="roll" ${character.statGenerationMethod === 'roll' ? 'checked' : ''}>
                <span data-i18n="stat_method_roll"></span>
            </label>
            <label class="inline-label">
                <input type="radio" name="stat-method" value="pointbuy" ${character.statGenerationMethod === 'pointbuy' ? 'checked' : ''}>
                <span data-i18n="stat_method_pointbuy"></span>
            </label>
            <label class="inline-label">
                <input type="radio" name="stat-method" value="manual" ${character.statGenerationMethod === 'manual' ? 'checked' : ''}>
                <span data-i18n="stat_method_manual"></span>
            </label>
        </div>

        <div id="stat-array-choice-container" style="display: ${character.statGenerationMethod === 'array' ? 'block' : 'none'};">
            <h4 data-i18n="step2_select_array_sublabel"></h4>
            <div id="stat-array-selection">`;
    STAT_ARRAYS.forEach((arr, index) => {
        const isChecked = character.statArrayChoice === index && character.statGenerationMethod === 'array';
        const replacementsJsonString = JSON.stringify({values: arr.join(', ')});
        html += `<label class="inline-label">
                    <input type="radio" name="stat-array-option" value="${index}" ${isChecked ? 'checked' : ''}>
                    <span data-i18n="stat_array_option_label" data-i18n-replacements='${replacementsJsonString}'>
                        ${t('stat_array_option_label', {values: arr.join(', ')})}
                    </span>
                 </label><br>`;
    });
    html += `   </div>
        </div>

        <div id="stat-roll-container" style="display: ${character.statGenerationMethod === 'roll' ? 'block' : 'none'};">
            <button id="btn-roll-stats" class="action-button" data-i18n="btn_roll_stats_text"></button>
            <div id="rolled-stats-display" style="margin-top: 10px; font-weight: bold; font-size: 1.1em;">`;
    if (character.statGenerationMethod === 'roll' && character.rolledStatValues.length === 6) {
        html += `<span data-i18n="rolled_values_label"></span> ${character.rolledStatValues.join(', ')}`;
    } else if (character.statGenerationMethod === 'roll') {
        html += `<span data-i18n="click_to_roll_stats_label"></span>`;
    }
    html += `   </div>
        </div>

        <div id="stat-pointbuy-container" style="display: ${character.statGenerationMethod === 'pointbuy' ? 'block' : 'none'};">
            <div class="info-box">
                <p data-i18n="pointbuy_info_text" data-i18n-replacements='{"totalPoints": "${TOTAL_POINT_BUY_POINTS}"}'></p>
            </div>
                        <div id="pointbuy-summary" style="margin-bottom:15px; font-weight:bold; font-size: 1.1em; padding: 10px; background-color: #f9f9f9; border: 1px solid #eee; border-radius: 3px;">
                            <span id="pointbuy-summary-text" data-i18n="pointbuy_points_summary_label"></span>
                        </div>
            <div id="pointbuy-stat-inputs">`;
    STAT_KEYS.forEach(key => {
        const currentValue = character.stats[key] || 3;
        html += `<div class="pointbuy-stat-row" style="display:flex; align-items:center; margin-bottom:10px; padding-bottom:10px; border-bottom: 1px dotted #eee;">
                    <label for="pointbuy-${key}" style="width:180px; margin-bottom:0; font-weight:bold;">${t('stat_' + key.toLowerCase() + '_name')}:</label>
                    <button class="stat-adjust-button" data-stat-key="${key}" data-action="decrease" data-type="pointbuy" ${currentValue <= 3 ? 'disabled' : ''}>-</button>
                    <span class="stat-value-display" id="pointbuy-${key}">${currentValue}</span>
                    <button class="stat-adjust-button" data-stat-key="${key}" data-action="increase" data-type="pointbuy" ${currentValue >= 18 ? 'disabled' : ''}>+</button>
                    <span class="stat-percentile" id="pointbuy-percentile-${key}" style="font-weight:bold; min-width:40px; text-align:right;">(${currentValue * 5}%)</span>
                 </div>`;
    });
    html += `       </div>
        </div>

        <div id="stat-manual-entry-container" style="display: ${character.statGenerationMethod === 'manual' ? 'block' : 'none'};">
            <div class="info-box">
                <p data-i18n="manual_entry_info_text"></p>
            </div>
            <div id="manual-entry-stat-inputs">`;
    STAT_KEYS.forEach(key => {
        const currentValue = character.stats[key] || 10;
        html += `<div class="manual-entry-stat-row" style="display:flex; align-items:center; margin-bottom:10px; padding-bottom:10px; border-bottom: 1px dotted #eee;">
                    <label for="manual-${key}" style="width:180px; margin-bottom:0; font-weight:bold;">${t('stat_' + key.toLowerCase() + '_name')}:</label>
                    <button class="stat-adjust-button" data-stat-key="${key}" data-action="decrease" data-type="manual" ${currentValue <= 3 ? 'disabled' : ''}>-</button>
                    <span class="stat-value-display" id="manual-${key}">${currentValue}</span>
                    <button class="stat-adjust-button" data-stat-key="${key}" data-action="increase" data-type="manual" ${currentValue >= 18 ? 'disabled' : ''}>+</button>
                    <span class="stat-percentile" id="manual-percentile-${key}" style="font-weight:bold; min-width:40px; text-align:right;">(${currentValue * 5}%)</span>
                 </div>`;
    });
    html += `       </div>
        </div>

        <h3 id="step2-subheader-assign-features" 
            data-i18n="${(character.statGenerationMethod === 'pointbuy' || character.statGenerationMethod === 'manual') ? 'step2_define_features_label' : 'step2_assign_stats_label'}" 
            style="margin-top: 25px; border-top: 1px solid #ddd; padding-top: 20px;">
        </h3>
        <div class="info-box" style="margin-top: 10px;">
            <p data-i18n="step2_info_distinguishing_feature"></p>
        </div>
        <div id="stat-assignment-or-features-container">
        </div>
    </div>`;
    return html;
}
export function manualEntryButtonDelegationHandler(event) {
    if (event.target.classList.contains('stat-adjust-button') && event.target.dataset.type === 'manual') {
        handleStatAdjustButtonClick(event.target);
    }
}

export function handleStatAdjustButtonClick(buttonElement) {
    const character = getCharacter();
    const statKey = buttonElement.dataset.statKey;
    const action = buttonElement.dataset.action;
    const type = buttonElement.dataset.type; // 'pointbuy' oder 'manual'
    const currentValue = character.stats[statKey] || (type === 'pointbuy' ? 3 : 10);
    
    let newValue = currentValue;
    if (action === 'increase') {
        newValue = Math.min(18, currentValue + 1);
    } else if (action === 'decrease') {
        newValue = Math.max(3, currentValue - 1);
    }
    
    // Für PointBuy: Prüfe, ob der neue Wert den Gesamtpool überschreiten würde
    if (type === 'pointbuy') {
        const TOTAL_POINT_BUY_POINTS = 72;
        let currentTotalWithoutThisStat = 0;
        STAT_KEYS.forEach(key => {
            if (key !== statKey) {
                currentTotalWithoutThisStat += (character.stats[key] || 3);
            }
        });
        
        if ((currentTotalWithoutThisStat + newValue) > TOTAL_POINT_BUY_POINTS) {
            // Berechne den maximal möglichen Wert
            let maxPossibleValue = TOTAL_POINT_BUY_POINTS - currentTotalWithoutThisStat;
            maxPossibleValue = Math.min(maxPossibleValue, 18);
            maxPossibleValue = Math.max(maxPossibleValue, 3);
            newValue = Math.min(newValue, maxPossibleValue);
        }
    }
    
    character.stats[statKey] = newValue;
    
    // UI aktualisieren
    if (type === 'pointbuy') {
        updatePointBuyUI();
    } else {
        updateManualEntryUI();
    }
    updateNavigationButtons();
}

export function updateManualEntryUI() {
    const character = getCharacter();
    console.log("--- updateManualEntryUI CALLED ---");
    // Aktualisiere die Prozentwerte
    STAT_KEYS.forEach(key => {
        const statValue = character.stats[key] || 3;
        const percentileDisplay = document.getElementById(`manual-percentile-${key}`);
        if (percentileDisplay) {
            percentileDisplay.textContent = `(${statValue * 5}%)`;
        } else {
            console.warn(`updateManualEntryUI - #manual-percentile-${key} span NOT FOUND!`);
        }
        // Wert-Anzeige synchronisieren
        const valueDisplay = document.getElementById(`manual-${key}`);
        if (valueDisplay && parseInt(valueDisplay.textContent) !== statValue) {
            valueDisplay.textContent = statValue;
        }
        
        // Button-Status aktualisieren
        const decreaseButton = document.querySelector(`.stat-adjust-button[data-stat-key="${key}"][data-action="decrease"][data-type="manual"]`);
        const increaseButton = document.querySelector(`.stat-adjust-button[data-stat-key="${key}"][data-action="increase"][data-type="manual"]`);
        if (decreaseButton) {
            decreaseButton.disabled = statValue <= 3;
        }
        if (increaseButton) {
            increaseButton.disabled = statValue >= 18;
        }
    });
    
    // UI für Distinguishing Features aktualisieren/rendern
    // Wir können hier updatePointBuyDistinguishingFeaturesUI wiederverwenden, da die Logik gleich ist
    // oder eine spezifischere/umbenannte Funktion erstellen.
    // Nennen wir sie allgemeiner:
    updateDistinguishingFeaturesUI(); // Statt updatePointBuyDistinguishingFeaturesUI
    updateNavigationButtons();
}

// Umbenannte/Generische Funktion für Feature UI
export function updateDistinguishingFeaturesUI() {
    const character = getCharacter();
    const container = document.getElementById('stat-assignment-or-features-container');
    if (!container) return;
    
    // Nur Features anzeigen, wenn Methode PointBuy oder Manual ist
    if (character.statGenerationMethod !== 'pointbuy' && character.statGenerationMethod !== 'manual') {
        container.innerHTML = ''; // Leeren, wenn nicht PointBuy/Manual
        return;
    }
    container.innerHTML = ''; // Leeren für Neuaufbau der Features

    STAT_KEYS.forEach(key => {
        const statValue = character.stats[key] || 0;
        if (statValue !== 0 && (statValue < 9 || statValue > 12)) {
            let featureHtml = `<div class="distinguishing-feature-input-container manual-feature-row">
                                <label for="feature-${key}" class="distinguishing-feature-label" style="width:150px;">${t('stat_' + key.toLowerCase() + '_name')} - ${t('distinguishing_feature_label')}</label>
                                <input type="text" id="feature-${key}" class="distinguishing-feature-input" data-stat-key="${key}" 
                                       placeholder="${t('distinguishing_feature_placeholder')}" 
                                       value="${character.distinguishingFeatures[key] || ''}" style="flex-grow:1;">
                            </div>`;
            container.innerHTML += featureHtml;
        }
    });
    translateAllElements(container);
}
export function calculateTotalPointsSpentInPointBuy() {
    const character = getCharacter();
    let totalSpent = 0;
    STAT_KEYS.forEach(key => {
        totalSpent += (character.stats[key] || 0); // Nimmt den Wert direkt aus character.stats
    });
    console.log("calculateTotalPointsSpentInPointBuy - Total Spent:", totalSpent, "Current Stats:", JSON.parse(JSON.stringify(character.stats)));
    return totalSpent;
}
export function handlePointBuyInputChange(inputElement) {
    const character = getCharacter();
    const statKey = inputElement.dataset.statKey;
    const oldValue = character.stats[statKey] || 3; // Der Wert *vor* der aktuellen Änderung
    let attemptedNewValue = parseInt(inputElement.value);
    const TOTAL_POINT_BUY_POINTS = 72;

    console.log(`--- handlePointBuyInputChange for ${statKey} --- Attempted: ${attemptedNewValue}, Old: ${oldValue}`);

    // 1. Grundlegende Validierung für den eingegebenen Wert (3-18)
    if (isNaN(attemptedNewValue)) {
        inputElement.value = oldValue; // Zurücksetzen, wenn keine Zahl
        // updatePointBuyUI(); // UI muss nicht aktualisiert werden, da keine gültige Änderung
        return;
    }
    if (attemptedNewValue < 3) {
        inputElement.value = 3;
        attemptedNewValue = 3;
    } else if (attemptedNewValue > 18) {
        inputElement.value = 18;
        attemptedNewValue = 18;
    }

    // 2. Prüfe die Auswirkungen auf den Gesamtpunktepool
    let currentTotalWithoutThisStat = 0;
    STAT_KEYS.forEach(key => {
        if (key !== statKey) {
            currentTotalWithoutThisStat += (character.stats[key] || 3);
        }
    });

    const pointsNeededForThisChange = attemptedNewValue - oldValue; // Wie viele Punkte diese Änderung *mehr* kostet (kann negativ sein)
    const currentPointsSpentOverall = calculateTotalPointsSpentInPointBuy() - oldValue; // Gesamtpunkte ohne den alten Wert dieses Stats
    
    // Wenn der neue Wert den Gesamtpool von 72 sprengen würde:
    if ((currentTotalWithoutThisStat + attemptedNewValue) > TOTAL_POINT_BUY_POINTS) {
        // Berechne den maximal möglichen Wert für diesen Stat, ohne 72 zu überschreiten
        let maxPossibleValueForThisStat = TOTAL_POINT_BUY_POINTS - currentTotalWithoutThisStat;
        maxPossibleValueForThisStat = Math.min(maxPossibleValueForThisStat, 18); // Darf 18 nicht überschreiten
        maxPossibleValueForThisStat = Math.max(maxPossibleValueForThisStat, 3);   // Darf 3 nicht unterschreiten

        console.log(`PointBuy Change for ${statKey} to ${attemptedNewValue} would exceed total. Limiting to ${maxPossibleValueForThisStat}`);
        attemptedNewValue = maxPossibleValueForThisStat;
        inputElement.value = attemptedNewValue; // Korrigiere den Input im UI
    }

    // Setze den (ggf. korrigierten) neuen Wert
    character.stats[statKey] = attemptedNewValue;
    console.log(`   ${statKey} set to ${character.stats[statKey]}`);

    updatePointBuyUI(); // Aktualisiert Zähler, Prozente und Feature-Anzeige
    updateNavigationButtons(); // Validierung könnte sich geändert haben
}

export function handlePointBuyAdjustClick(buttonElement) {
    const character = getCharacter();
    const statKey = buttonElement.dataset.statKey;
    const amount = parseInt(buttonElement.dataset.amount);
    const inputElement = document.getElementById(`pointbuy-${statKey}`);
    
    let currentValue = character.stats[statKey] || 3;
    let newValue = currentValue + amount;

    newValue = Math.max(3, Math.min(18, newValue));

    character.stats[statKey] = newValue;
    if (inputElement) inputElement.value = newValue; // UI synchronisieren
    updatePointBuyUI();
    updateNavigationButtons();
}

export function updatePointBuyUI() {
    const character = getCharacter();
    console.log("--- updatePointBuyUI CALLED ---");
    const TOTAL_POINT_BUY_POINTS = 72;

    // 1. Berechne die aktuell ausgegebenen Punkte
    let pointsSpent = 0;
    STAT_KEYS.forEach(key => {
        // Nimm den Wert aus character.stats; falls nicht vorhanden oder NaN, nutze 3 (Minimalwert)
        const statVal = parseInt(character.stats[key]); // Sicherstellen, dass es eine Zahl ist
        pointsSpent += (isNaN(statVal) ? 3 : statVal);
    });
    console.log("updatePointBuyUI - Calculated pointsSpent:", pointsSpent, "Based on character.stats:", JSON.parse(JSON.stringify(character.stats)));

    const pointsRemaining = TOTAL_POINT_BUY_POINTS - pointsSpent;
    console.log("updatePointBuyUI - Points Remaining:", pointsRemaining);

    // 2. Aktualisiere die Hauptanzeige für Punkte
    const pointbuySummaryText = document.getElementById('pointbuy-summary-text');
    if (pointbuySummaryText) {
        console.log("updatePointBuyUI - Found #pointbuy-summary-text span.");
        // Erstelle den Text für die Zusammenfassung dynamisch
        const summaryText = t('pointbuy_points_summary_label', {
            spent: pointsSpent,
            total: TOTAL_POINT_BUY_POINTS,
            remaining: pointsRemaining // pointsRemaining ist das, was noch *zu verteilen* ist
        });
        console.log("updatePointBuyUI - New summary text content:", summaryText);

        // Setze den Text des Summary-Spans
        pointbuySummaryText.setAttribute('data-i18n-replacements', JSON.stringify({
            spent: pointsSpent,
            total: TOTAL_POINT_BUY_POINTS,
            remaining: pointsRemaining
        }));
        pointbuySummaryText.textContent = summaryText;
        console.log("updatePointBuyUI - Updated #pointbuy-summary-text span.");
    }
    
    // Farbliche Hervorhebung des gesamten Summary-Divs
    const pointbuySummaryDiv = document.getElementById('pointbuy-summary');
    if (pointbuySummaryDiv) {
        if (pointsSpent === TOTAL_POINT_BUY_POINTS) {
            pointbuySummaryDiv.style.color = 'green';
            pointbuySummaryDiv.style.borderColor = 'green';
            console.log("updatePointBuyUI - Summary color set to green (target met).");
        } else if (pointsSpent > TOTAL_POINT_BUY_POINTS) {
            pointbuySummaryDiv.style.color = 'red';
            pointbuySummaryDiv.style.borderColor = 'red';
            console.log("updatePointBuyUI - Summary color set to red (overspent).");
        } else { // pointsSpent < TOTAL_POINT_BUY_POINTS
            pointbuySummaryDiv.style.color = 'orange'; // Oder deine Standardfarbe
            pointbuySummaryDiv.style.borderColor = 'orange'; // Oder deine Standardfarbe
            console.log("updatePointBuyUI - Summary color set to orange (points remaining).");
        }
    } else {
        console.error("updatePointBuyUI - #pointbuy-summary div NOT FOUND!");
    }

    // 3. Aktualisiere die Prozentwerte und synchronisiere Input-Felder
    STAT_KEYS.forEach(key => {
        const statValue = character.stats[key] || 3; // Nimm den aktuellen Wert, oder 3 als Fallback
        console.log(`updatePointBuyUI - Processing stat ${key}: value = ${statValue}`);

        // Prozentwert aktualisieren
        const percentileDisplay = document.getElementById(`pointbuy-percentile-${key}`); // KORREKTE ID
        if (percentileDisplay) {
            percentileDisplay.textContent = `(${statValue * 5}%)`;
        } else {
            console.warn(`updatePointBuyUI - #pointbuy-percentile-${key} span NOT FOUND!`);
        }

        // Wert-Anzeige synchronisieren
        const valueDisplay = document.getElementById(`pointbuy-${key}`);
        if (valueDisplay) {
            if (parseInt(valueDisplay.textContent) !== statValue) {
                console.log(`updatePointBuyUI - Syncing value display pointbuy-${key} to ${statValue}`);
                valueDisplay.textContent = statValue;
            }
        } else {
             console.warn(`updatePointBuyUI - #pointbuy-${key} value display NOT FOUND!`);
        }
        
        // Button-Status aktualisieren
        const TOTAL_POINT_BUY_POINTS = 72;
        let currentTotalWithoutThisStat = 0;
        STAT_KEYS.forEach(otherKey => {
            if (otherKey !== key) {
                currentTotalWithoutThisStat += (character.stats[otherKey] || 3);
            }
        });
        const canIncrease = (currentTotalWithoutThisStat + statValue + 1) <= TOTAL_POINT_BUY_POINTS && statValue < 18;
        const canDecrease = statValue > 3;
        
        const decreaseButton = document.querySelector(`.stat-adjust-button[data-stat-key="${key}"][data-action="decrease"][data-type="pointbuy"]`);
        const increaseButton = document.querySelector(`.stat-adjust-button[data-stat-key="${key}"][data-action="increase"][data-type="pointbuy"]`);
        if (decreaseButton) {
            decreaseButton.disabled = !canDecrease;
        }
        if (increaseButton) {
            increaseButton.disabled = !canIncrease;
        }
    });
    
    // 4. UI für Distinguishing Features basierend auf den aktuellen Stats aktualisieren/rendern
    console.log("updatePointBuyUI - Calling updatePointBuyDistinguishingFeaturesUI().");
    updatePointBuyDistinguishingFeaturesUI();

    // 5. Navigationsbuttons-Status aktualisieren
    console.log("updatePointBuyUI - Calling updateNavigationButtons().");
    updateNavigationButtons();
    console.log("--- updatePointBuyUI FINISHED ---");
}

export function updatePointBuyDistinguishingFeaturesUI() {
    const character = getCharacter();
    const container = document.getElementById('stat-assignment-or-features-container');
    if (!container) return;
    container.innerHTML = ''; // Leeren

    STAT_KEYS.forEach(key => {
        const statValue = character.stats[key] || 0;
        if (statValue !== 0 && (statValue < 9 || statValue > 12)) {
            let featureHtml = `<div class="distinguishing-feature-input-container pointbuy-feature-row">
                                <label for="feature-${key}" class="distinguishing-feature-label" style="width:150px;">${t('stat_' + key.toLowerCase() + '_name')} - ${t('distinguishing_feature_label')}</label>
                                <input type="text" id="feature-${key}" class="distinguishing-feature-input" data-stat-key="${key}" 
                                       placeholder="${t('distinguishing_feature_placeholder')}" 
                                       value="${character.distinguishingFeatures[key] || ''}" style="flex-grow:1;">
                            </div>`;
            container.innerHTML += featureHtml;
        }
    });
    translateAllElements(container);
}
// Dann in attachStep2Listeners:
export function attachStep2Listeners() {
    const character = getCharacter();
    const methodRadios = document.querySelectorAll('input[name="stat-method"]');
    methodRadios.forEach(radio => {
        radio.removeEventListener('change', handleStatMethodChange);
        radio.addEventListener('change', handleStatMethodChange);
    });

    const arrayOptionRadios = document.querySelectorAll('input[name="stat-array-option"]');
    arrayOptionRadios.forEach(radio => {
        radio.removeEventListener('change', handleSpecificArraySelectionChange);
        radio.addEventListener('change', handleSpecificArraySelectionChange);
    });

    const btnRoll = document.getElementById('btn-roll-stats');
    if (btnRoll) {
        btnRoll.removeEventListener('click', handleRollStatsClick);
        btnRoll.addEventListener('click', handleRollStatsClick);
    }

    const pointbuyContainer = document.getElementById('stat-pointbuy-container');
    if (pointbuyContainer) {
        pointbuyContainer.removeEventListener('click', pointBuyButtonDelegationHandler);
        pointbuyContainer.addEventListener('click', pointBuyButtonDelegationHandler);
    }

    const manualEntryContainer = document.getElementById('stat-manual-entry-container');
    if (manualEntryContainer) {
        manualEntryContainer.removeEventListener('click', manualEntryButtonDelegationHandler);
        manualEntryContainer.addEventListener('click', manualEntryButtonDelegationHandler);
    }
    
    const assignmentOrFeaturesContainer = document.getElementById('stat-assignment-or-features-container');
    if (assignmentOrFeaturesContainer) {
        assignmentOrFeaturesContainer.removeEventListener('input', sharedFeatureInputDelegationHandler);
        assignmentOrFeaturesContainer.addEventListener('input', sharedFeatureInputDelegationHandler);

        assignmentOrFeaturesContainer.removeEventListener('change', sharedStatSelectDelegationHandler);
        assignmentOrFeaturesContainer.addEventListener('change', sharedStatSelectDelegationHandler);
    }

    if (character.statGenerationMethod === 'array') {
        if (character.statArrayChoice !== null) {
            updateStatAssignmentUI();
        } else {
            if (assignmentOrFeaturesContainer) assignmentOrFeaturesContainer.innerHTML = `<p>${t('alert_select_stat_array')}</p>`;
        }
    } else if (character.statGenerationMethod === 'roll') {
        if (character.rolledStatValues.length === 6) {
            updateStatAssignmentUI();
        } else {
            if (assignmentOrFeaturesContainer) assignmentOrFeaturesContainer.innerHTML = `<p>${t('click_to_roll_stats_label')}</p>`;
        }
    } else if (character.statGenerationMethod === 'pointbuy') {
        updatePointBuyUI();
    } else if (character.statGenerationMethod === 'manual') {
        updateManualEntryUI();
    } else {
        if (assignmentOrFeaturesContainer) assignmentOrFeaturesContainer.innerHTML = `<p>${t('step2_select_method_prompt')}</p>`;
    }
    updateNavigationButtons();
}
export function pointBuyButtonDelegationHandler(event) {
    if (event.target.classList.contains('stat-adjust-button') && event.target.dataset.type === 'pointbuy') {
        handleStatAdjustButtonClick(event.target);
    }
}

export function sharedFeatureInputDelegationHandler(event) {
    const character = getCharacter(); // Neuer Name
     if (event.target.classList.contains('distinguishing-feature-input')) {
        const statKey = event.target.dataset.statKey;
        character.distinguishingFeatures[statKey] = event.target.value;
    }
}

export function sharedStatSelectDelegationHandler(event) {
    const character = getCharacter(); // Neuer Name
    if (event.target.classList.contains('stat-value-select')) {
        handleStatValueAssignmentChange(event.target);
    }
}

export function handleStatMethodChange(event) {
    const character = getCharacter();
    const newMethod = event.target.value;
    if (character.statGenerationMethod === newMethod && newMethod !== "") return;

    character.statGenerationMethod = newMethod;
    character.statArrayChoice = null;
    character.rolledStatValues = [];
    character.statAssignments = {};
    character.distinguishingFeatures = {};

    if (newMethod === 'pointbuy') {
        STAT_KEYS.forEach(key => { character.stats[key] = 3; });
    } else if (newMethod === 'manual') {
        STAT_KEYS.forEach(key => { character.stats[key] = 10; });
    } else {
        STAT_KEYS.forEach(key => character.stats[key] = 0);
    }
    if (window.app && window.app.renderCurrentStep) {
        window.app.renderCurrentStep();
    }
}


export function handleSpecificArraySelectionChange(event) {
    const character = getCharacter();
    // Dieser Handler ist für die Radio-Buttons der vordefinierten Arrays
    character.statArrayChoice = parseInt(event.target.value);
    // Reset Zuweisungen, wenn neues Array gewählt wird
    character.statAssignments = {};
    STAT_KEYS.forEach(key => character.stats[key] = 0);
    character.distinguishingFeatures = {};
    updateStatAssignmentUI();
    updateNavigationButtons();
}

export function handleRollStatsClick() {
    const character = getCharacter();
    generateRolledStatsArray(); // Generiert und speichert Werte in character.rolledStatValues, resettet Zuweisungen
    
    // Anzeige der gewürfelten Werte aktualisieren
    const displayDiv = document.getElementById('rolled-stats-display');
    if (displayDiv) {
        displayDiv.innerHTML = `<span data-i18n="rolled_values_label">${t('rolled_values_label')}</span> ${character.rolledStatValues.join(', ')}`;
        translateAllElements(displayDiv); // Für den Fall, dass das Label neu übersetzt werden muss
    }
    updateStatAssignmentUI(); // Baut die Dropdowns für die Zuweisung neu auf
    updateNavigationButtons();
}

export function handleStatValueAssignmentChange(selectElement) {
    const character = getCharacter();
    const statKey = selectElement.dataset.statKey;
    const selectedValue = selectElement.value === "" ? null : parseInt(selectElement.value);

    // Alte Zuweisung für diesen Stat entfernen, falls vorhanden und Wert geändert wird
    const oldAssignedValue = character.statAssignments[statKey];
    character.statAssignments[statKey] = selectedValue; // Neue Zuweisung speichern

    // Haupt-Stat im character-Objekt aktualisieren
    character.stats[statKey] = selectedValue !== null ? selectedValue : 0;

    updateStatAssignmentUI(); // Um Dropdowns und Anzeigen zu aktualisieren
    updateNavigationButtons();
}

export function updateStatAssignmentUI() {
    const character = getCharacter();
    console.log("--- updateStatAssignmentUI CALLED --- Method:", character.statGenerationMethod, "ArrayChoice:", character.statArrayChoice, "RolledValuesLen:", character.rolledStatValues.length);
    const container = document.getElementById('stat-assignment-or-features-container');
    if (!container) {
        console.error("updateStatAssignmentUI: Container #stat-assignment-or-features-container NOT FOUND");
        return;
    }

    let sourceArrayForAssignment = null;
    if (character.statGenerationMethod === 'array' && character.statArrayChoice !== null) {
        sourceArrayForAssignment = STAT_ARRAYS[character.statArrayChoice];
    } else if (character.statGenerationMethod === 'roll' && character.rolledStatValues.length === 6) {
        sourceArrayForAssignment = character.rolledStatValues;
    }
    console.log("updateStatAssignmentUI - sourceArrayForAssignment:", JSON.parse(JSON.stringify(sourceArrayForAssignment)));

    if (!sourceArrayForAssignment) {
        console.log("updateStatAssignmentUI - sourceArrayForAssignment IS NULL or empty. Displaying prompt.");
        if (character.statGenerationMethod === 'array') {
            container.innerHTML = `<p>${t('alert_select_stat_array')}</p>`;
        } else if (character.statGenerationMethod === 'roll') {
            container.innerHTML = `<p>${t('click_to_roll_stats_label')}</p>`;
        } else {
            container.innerHTML = `<p>${t('step2_select_method_prompt')}</p>`;
        }
        translateAllElements(container); // Wichtig für die Prompts
        updateNavigationButtons();
        return;
    }

    console.log("updateStatAssignmentUI - Clearing container and preparing to build rows.");
    container.innerHTML = ''; // Leere für Neuaufbau

    const chosenArrayBaseForLogic = sourceArrayForAssignment; // Umbenennen für Klarheit in der bestehenden Logik

    STAT_KEYS.forEach(currentStatKey => { // Für jeden Stat (STR, CON, etc.), für den wir ein Dropdown bauen
        console.log(`updateStatAssignmentUI - Building row for ${currentStatKey}`); // NEUER LOG
        const currentAssignedValueForThisStat = character.statAssignments[currentStatKey];
        const statValue = character.stats[currentStatKey] || 0;
        const percentile = statValue * 5;
        const showFeatureInput = statValue !== 0 && (statValue < 9 || statValue > 12);

        let workingArray = [...chosenArrayBaseForLogic];
        STAT_KEYS.forEach(otherStatKey => {
            if (otherStatKey !== currentStatKey) {
                const valAssignedToOtherStat = character.statAssignments[otherStatKey];
                if (valAssignedToOtherStat !== null && valAssignedToOtherStat !== undefined) {
                    const indexToRemove = workingArray.indexOf(valAssignedToOtherStat);
                    if (indexToRemove > -1) {
                        workingArray.splice(indexToRemove, 1);
                    }
                }
            }
        });
        const sortedWorkingArray = [...workingArray].sort((a, b) => b - a);

        let rowHtml = `<div class="stat-allocation-row">
            <label for="stat-select-${currentStatKey}">${t('stat_' + currentStatKey.toLowerCase() + '_name')}</label>
            <select id="stat-select-${currentStatKey}" class="stat-value-select" data-stat-key="${currentStatKey}">
                <option value="">-- ${t('select_one_option')} --</option>`;

        sortedWorkingArray.forEach(val => {
            rowHtml += `<option value="${val}" ${currentAssignedValueForThisStat === val ? 'selected' : ''}>${val}</option>`;
        });

        rowHtml += `</select>
            <span class="stat-percentile" id="percentile-${currentStatKey}">${percentile}%</span>
        </div>`; // Ende .stat-allocation-row

        // Stelle sicher, dass die ID hier `percentile-${currentStatKey}` ist (OHNE "pointbuy-")
        // für Array/Roll, das scheinst du schon so zu haben.

        if (showFeatureInput) {
             rowHtml += `<div class="distinguishing-feature-input-container">
                            <label for="feature-${currentStatKey}" class="distinguishing-feature-label">${t('distinguishing_feature_label')}</label>
                            <input type="text" id="feature-${currentStatKey}" class="distinguishing-feature-input" data-stat-key="${currentStatKey}"
                                   placeholder="${t('distinguishing_feature_placeholder')}"
                                   value="${character.distinguishingFeatures[currentStatKey] || ''}">
                        </div>`;
        }
        // console.log(`updateStatAssignmentUI - Generated rowHtml for ${currentStatKey}:`, rowHtml.substring(0,100) + "..."); // Logge nur einen Teil
        container.innerHTML += rowHtml; // Füge die Zeile zum Container hinzu
    });
    console.log("updateStatAssignmentUI - Finished building rows. Final container innerHTML length:", container.innerHTML.length);
    translateAllElements(container);
    updateNavigationButtons(); // Wichtig
}
function rollDie(sides = 6) {
    return Math.floor(Math.random() * sides) + 1;
}

export function roll4d6DropLowest() {
    const character = getCharacter();
    const rolls = [rollDie(), rollDie(), rollDie(), rollDie()];
    rolls.sort((a, b) => a - b); // Sortiere aufsteigend
    rolls.shift(); // Entferne den niedrigsten (ersten)
    return rolls.reduce((sum, current) => sum + current, 0); // Summiere die restlichen drei
}


export function generateRolledStatsArray() {
    const character = getCharacter();
    character.rolledStatValues = [];
    for (let i = 0; i < 6; i++) {
        character.rolledStatValues.push(roll4d6DropLowest());
    }
    // Sortiere die gewürfelten Werte optional absteigend für konsistente Anzeige/Vergleichbarkeit
    character.rolledStatValues.sort((a, b) => b - a);
    
    // Wichtig: Wenn neue Stats gewürfelt werden, müssen alte Zuweisungen und Stats zurückgesetzt werden!
    character.statAssignments = {};
    STAT_KEYS.forEach(key => character.stats[key] = 0);
    character.distinguishingFeatures = {};
}

export function validateStep2(showAlerts = true) {
    const character = getCharacter();
    if (!character.statGenerationMethod) {
        if (showAlerts) {
            const methodRadios = document.querySelectorAll('input[name="stat-generation-method"]');
            if (methodRadios.length > 0) {
                showInlineError(t('alert_select_stat_method'));
            } else {
                showInlineError(t('alert_select_stat_method'));
            }
        }
        return false;
    }

    let sourceArrayForValidation = null;

    if (character.statGenerationMethod === 'array') {
        if (character.statArrayChoice === null) {
            if (showAlerts) showInlineError(t('alert_select_stat_array'));
            return false;
        }
        sourceArrayForValidation = STAT_ARRAYS[character.statArrayChoice];
    } else if (character.statGenerationMethod === 'roll') {
        if (character.rolledStatValues.length !== 6) {
            if (showAlerts) showInlineError(t('click_to_roll_stats_label'));
            return false;
        }
        sourceArrayForValidation = character.rolledStatValues;
    } else if (character.statGenerationMethod === 'pointbuy') {
        const TOTAL_POINT_BUY_POINTS = 72;
        const pointsSpent = calculateTotalPointsSpentInPointBuy();
        if (pointsSpent !== TOTAL_POINT_BUY_POINTS) {
            if (showAlerts) showInlineError(t('pointbuy_error_total_points', { spent: pointsSpent, total: TOTAL_POINT_BUY_POINTS }));
            return false;
        }
        let invalidStatFound = false;
        STAT_KEYS.forEach(key => {
            const val = character.stats[key] || 0;
            if (val < 3 || val > 18) { invalidStatFound = true; }
        });
        if (invalidStatFound) {
            if (showAlerts) showInlineError(t('pointbuy_error_stat_range'));
            return false;
        }
        return true;
    } else if (character.statGenerationMethod === 'manual') {
        let invalidStatFoundManual = false;
        STAT_KEYS.forEach(key => {
            const val = character.stats[key] || 0;
            if (val < 3 || val > 18) { invalidStatFoundManual = true; }
        });
        if (invalidStatFoundManual) {
            if (showAlerts) showInlineError(t('manual_entry_error_stat_range'));
            return false;
        }
        return true;
    } else {
        if (showAlerts) showInlineError(t('alert_select_stat_method'));
        return false;
    }

    const assignedStatValues = Object.values(character.statAssignments);
    if (assignedStatValues.some(val => val === null || val === undefined) || assignedStatValues.length < STAT_KEYS.length) {
        if (showAlerts) showInlineError(t('alert_assign_all_stats'));
        return false;
    }

    const chosenArraySorted = [...sourceArrayForValidation].sort((a, b) => a - b);
    const currentAssignmentsSorted = [...assignedStatValues].sort((a, b) => a - b);

    if (chosenArraySorted.length !== currentAssignmentsSorted.length) {
        return false;
    }
    for (let i = 0; i < chosenArraySorted.length; i++) {
        if (chosenArraySorted[i] !== currentAssignmentsSorted[i]) {
            if (showAlerts) showInlineError(t('alert_unique_stat_values'));
            return false;
        }
    }
    return true;
}

export function saveStep2() {
    const character = getCharacter();
    // Die Werte sind bereits in character.stats und character.distinguishingFeatures durch die Handler.
    // character.statAssignments ist ein Hilfsobjekt für die UI-Logik dieses Schritts.
    // console.log("Step 2 Data Saved:", JSON.parse(JSON.stringify(character.stats)), JSON.parse(JSON.stringify(character.distinguishingFeatures)));
}