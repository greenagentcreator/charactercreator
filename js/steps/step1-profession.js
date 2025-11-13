// Step 1: Profession & Skills
// This module handles profession selection, custom profession creation, and skill management

import { getCharacter, initializeCharacterSkills, generateInstanceId } from '../model/character.js';
import { ALL_SKILLS } from '../config/skills.js';
import { PROFESSIONS } from '../config/professions.js';
import { MAX_SKILL_INCREASES, SKILL_INCREASE_AMOUNT, MAX_SKILL_VALUE } from '../config/constants.js';
import { t, getCurrentLanguage, translateAllElements } from '../i18n/i18n.js';
import { updateNavigationButtons } from '../app.js';

// Helper to get character (for easier access)
// Note: getCharacter() returns a reference, so we can modify it directly
// For reads, we'll use getCharacter() directly in functions

export function renderStep1_ProfessionSkills() {
    const character = getCharacter();
    // console.log("RenderStep1 - Start. isCustom:", character.isCustomProfession, "Stage:", character.customProfessionSetupStage, "ProfKey:", character.professionKey);
    if (character.isCustomProfession) {
        if (character.customProfessionSetupStage === 'bonds') {
            return renderCustomProfession_BondSetup();
        } else if (character.customProfessionSetupStage === 'skills') {
            return renderCustomProfession_SkillAllocation();
        } else { // customProfessionSetupStage === 'done'
            let html = `<div class="step" id="step1-final-skill-increases-custom">
                <div class="info-box">
                    <p data-i18n="step1_info2"></p>
                </div>
                <h3 data-i18n="step1_increase_skills_label"></h3>
                <p style="text-align: right;"><span data-i18n="increases_chosen_label"></span> <span id="increases-chosen-count">0</span> / ${MAX_SKILL_INCREASES}</p>
                <div id="all-skills-list-container"></div>
            </div>`;
            return html;
        }
    } else { // Standard-Beruf Logik (oder keine Auswahl)
        character.isCustomProfession = false;
        character.customProfessionSetupStage = 'bonds'; // Reset custom stage

        let html = `<div class="step" id="step1-profession-standard">
            <div class="info-box">
                <p data-i18n="step1_info1"></p>
                <p data-i18n="step1_info2"></p>
            </div>
            <h2><label for="profession-select" data-i18n="step1_select_profession_label"></label></h2>
            <select id="profession-select">
                <option value="" data-i18n="select_one_option">${t('select_one_option')}</option>`;
        for (const profKey in PROFESSIONS) {
            if (PROFESSIONS[profKey] && PROFESSIONS[profKey].nameKey) {
                html += `<option value="${profKey}" ${character.professionKey === profKey ? 'selected' : ''}>${t(PROFESSIONS[profKey].nameKey)}</option>`;
            }
        }
        html += `</select>
            <div id="profession-details-container">
                <!-- Wird von renderProfessionSpecificChoices gefüllt -->
            </div>
            <div id="skill-increase-section" style="display: ${character.professionKey && !PROFESSIONS[character.professionKey]?.isCustom ? 'block' : 'none'}; margin-top: 20px;">
                <h3 data-i18n="step1_increase_skills_label"></h3>
                <p style="text-align: right;"><span data-i18n="increases_chosen_label"></span> <span id="increases-chosen-count">0</span> / ${MAX_SKILL_INCREASES}</p>
                <div id="all-skills-list-container">
                    <!-- Wird von renderAllSkillsList gefüllt -->
                </div>
            </div>
        </div>`;
        return html;
    }
}

// NEU: Render-Funktion für Custom Profession - Bond Setup
// --- Custom Profession Funktionen (müssen noch angepasst werden, um mit Instanzen zu arbeiten) ---
// --- Custom Profession Funktionen (müssen noch angepasst werden, um mit Instanzen zu arbeiten) ---
export function renderCustomProfession_BondSetup() {
    const character = getCharacter(); /* ... bleibt erstmal ähnlich ... */
     const initialTotalPoints = 400;
    character.customProfessionSkillPointBudget = initialTotalPoints - ((character.customProfessionBonds - 3) * 50);

    let html = `<div class="step" id="step1-custom-bonds">
        <h2 data-i18n="custom_prof_title_bond_setup"></h2>
        <div class="info-box">
            <h3 data-i18n="custom_prof_info_rules_title"></h3>
            <p data-i18n="custom_prof_info_default_bonds"></p>
            <p data-i18n="custom_prof_info_customize_bonds"></p>
            <p data-i18n="custom_prof_info_pick_skills"></p>
            <p data-i18n="custom_prof_info_divide_points" data-i18n-replacements='{"totalPoints": "${character.customProfessionSkillPointBudget}"}'></p>
            <p data-i18n="custom_prof_info_add_to_start"></p>
            <p data-i18n="custom_prof_info_rule_of_thumb"></p>
            <p data-i18n="custom_prof_info_max_skill"></p>
        </div>
        <div id="custom-profession-name-input-container" style="margin-top: 15px;">
            <label for="custom-profession-name" data-i18n="label_custom_profession_name"></label>
            <input type="text" id="custom-profession-name" value="${character.customProfessionName || ''}" placeholder="e.g., Occult Detective">
        </div>
        <div>
            <label data-i18n="custom_prof_label_current_bonds"></label>
            <button id="btn-decrease-bonds" class="action-button-small" ${character.customProfessionBonds <= 1 ? 'disabled' : ''}>-</button>
            <span id="custom-bonds-display" style="margin: 0 10px; font-weight: bold;">${character.customProfessionBonds}</span>
            <button id="btn-increase-bonds" class="action-button-small" ${character.customProfessionBonds >= 4 ? 'disabled' : ''}>+</button>
        </div>
        <div style="margin-top: 10px;">
            <label data-i18n="custom_prof_label_skill_point_budget"></label>
            <span id="custom-skill-budget-display" style="font-weight: bold;">${character.customProfessionSkillPointBudget}</span>
        </div>
        <div class="custom-prof-actions-container" style="margin-top: 20px;">
             <button id="btn-confirm-bonds" class="action-button" data-i18n="custom_prof_btn_confirm_bonds"></button>
        </div>
    </div>`;
    return html;
}

// NEU: Render-Funktion für Custom Profession - Skill Allocation
function renderCustomProfession_SkillAllocation() {
    const character = getCharacter();
    const budget = character.customProfessionSkillPointBudget;
    let pointsSpent = 0;
    character.customProfessionSelectedSkills.forEach(inst => pointsSpent += (inst.points || 0));
    const remainingPoints = budget - pointsSpent;
    const selectedInstancesCount = character.customProfessionSelectedSkills.length;

    let html = `<div class="step" id="step1-custom-skills">
        <h2 data-i18n="custom_prof_title_skill_allocation"></h2>
        <div class="info-box">
            <p id="custom-prof-skill-allocation-info" data-i18n="custom_prof_info_skill_allocation">
                ${t('custom_prof_info_skill_allocation', {currentBudget: budget, remainingPoints: remainingPoints})}
            </p>
             <p>${t('custom_prof_info_max_skill')}</p> <!-- Max 60% Regel -->
        </div>
        <p><span data-i18n="custom_prof_skills_selected_label_prefix"></span>
           <span id="custom-skills-selected-actual-count">${selectedInstancesCount}</span> / 10
        </p>
        <div id="custom-profession-skill-list">`;

    // Sortiere Basis-Skills für die Auswahl-Checkboxen
    const sortedBaseSkillKeys = Object.keys(ALL_SKILLS).sort((a, b) =>
        t(ALL_SKILLS[a].nameKey).localeCompare(t(ALL_SKILLS[b].nameKey), getCurrentLanguage())
    );

    sortedBaseSkillKeys.forEach(baseKey => {
        if (baseKey === "unnatural") return; // Unnatural nicht hier wählbar

        const skillDef = ALL_SKILLS[baseKey];
        const instancesOfThisBaseKey = character.customProfessionSelectedSkills.filter(inst => inst.key === baseKey);
        const isBaseSkillSelectedAtLeastOnce = instancesOfThisBaseKey.length > 0;

        html += `<div class="skill-list-item custom-skill-item-base" data-base-skill-key="${baseKey}">
                    <div class="base-skill-line"> <!-- CSS wird dies als flex formatieren -->
                        <div> <!-- Wrapper für linke Seite: Checkbox, Name, Info -->
                            <label class="inline-label" style="margin-right: 5px;">
                                <input type="checkbox" class="custom-prof-skill-select-main"
                                       data-skill-key="${baseKey}"
                                       data-is-typed="${skillDef.type ? 'true' : 'false'}"
                                       ${isBaseSkillSelectedAtLeastOnce ? 'checked' : ''}
                                       ${selectedInstancesCount >= 10 && !isBaseSkillSelectedAtLeastOnce ? 'disabled' : ''}>
                                ${t(skillDef.nameKey)}
                            </label>
                            <span class="skill-info-icon" title="${t(skillDef.descKey)}">i
                                <span class="tooltip">${t(skillDef.descKey)}</span>
                            </span>
                        </div>`;
        if (skillDef.type && isBaseSkillSelectedAtLeastOnce && selectedInstancesCount < 10) {
            html += `<button class="btn-add-another-specialization action-button-small" 
                             data-skill-key="${baseKey}"
                             title="${t('add_specialization_button_text', {skillName: t(skillDef.nameKey)})}"
                             style="font-size:0.8em; padding: 2px 5px;">+</button>`; // Text wurde zu + verkürzt für Platz
        } else {
            html += `<div></div>`; // Leeres Div für Flexbox-Ausrichtung (justify-content: space-between)
        }
        html += `   </div> <!-- Ende .base-skill-line -->
                    <div class="skill-instances-container" data-skill-key-instances="${baseKey}">`;

        instancesOfThisBaseKey.forEach(instance => {
            const currentSkillTotal = skillDef.base + (instance.points || 0);
            html += `<div class="skill-instance-controls" data-instance-temp-id="${instance.tempInstanceId}">
                        ${skillDef.type ? 
                            `<input type="text" class="custom-instance-type-input" 
                                    data-instance-temp-id="${instance.tempInstanceId}" 
                                    value="${instance.typeName || ''}" 
                                    placeholder="${t('specify_type_placeholder')}">`
                          : 
                            // Platzhalter für nicht-typisierte Skills, um Layout-Konsistenz zu wahren.
                            // Die Breite sollte ungefähr der des Typ-Eingabefelds entsprechen.
                            // CSS für .custom-instance-type-input setzt min-width: 100px;
                            `<span class="custom-instance-type-input-placeholder" style="display: inline-block; min-width: 100px; max-width:180px; flex-grow:1; flex-shrink:1; margin-right:8px;"> </span>`
                        }
                        <span>${t('custom_prof_label_assign_points')}</span>
                        <button class="custom-skill-point-btn" data-action="decrease" data-amount="10" data-instance-temp-id="${instance.tempInstanceId}">-10</button>
                        <button class="custom-skill-point-btn" data-action="decrease" data-amount="5" data-instance-temp-id="${instance.tempInstanceId}">-5</button>
                        <span class="custom-skill-assigned-points">${instance.points || 0}</span>
                        <button class="custom-skill-point-btn" data-action="increase" data-amount="5" data-instance-temp-id="${instance.tempInstanceId}">+5</button>
                        <button class="custom-skill-point-btn" data-action="increase" data-amount="10" data-instance-temp-id="${instance.tempInstanceId}">+10</button>
                        <strong class="custom-skill-total-value">${t('custom_prof_label_skill_total')} ${currentSkillTotal}% (max 60%)</strong>
                        ${instancesOfThisBaseKey.length > 1 ? // Entfernen-Button NUR anzeigen, wenn MEHR ALS EINE Instanz DIESES Basis-Skills existiert
                            `<button class="remove-custom-skill-instance-btn" 
                                     data-instance-temp-id="${instance.tempInstanceId}" 
                                     title="${t('remove_button_title')}"
                                     style="color:red; border:none; background:none; cursor:pointer; font-weight:bold; font-size:1.2em; padding:0 5px;">×</button>`
                            : ''
                        }
                     </div>`;
        });
        html += `       </div> <!-- Ende .skill-instances-container -->
                 </div>`; // Ende .custom-skill-item-base
    });
    html += `   </div> <!-- Ende #custom-profession-skill-list -->
                <div class="custom-prof-actions-container">
                    <button id="btn-confirm-custom-skills" class="action-button" data-i18n="custom_prof_btn_confirm_skills"></button>
                </div>
            </div>`;
    return html;
}

// attachStep1Listeners (Anpassung für 'done' Stage)
// attachStep1Listeners (Anpassung für Custom Stages und Dropdown-Handling)
export function attachStep1Listeners() {
    const character = getCharacter();
    const mainSelect = document.getElementById('profession-select');

    if (mainSelect) { // Gilt für Standard-Layout und wenn Custom Prof *nicht* aktiv ist
        mainSelect.removeEventListener('change', handleMainProfessionSelectChange);
        mainSelect.addEventListener('change', handleMainProfessionSelectChange);
        if (character.professionKey !== mainSelect.value) { // Sync dropdown if needed
             mainSelect.value = character.professionKey || "";
        }
    }

    if (character.isCustomProfession) {
        if (character.customProfessionSetupStage === 'bonds') {
            attachCustomBondSetupListeners();
        } else if (character.customProfessionSetupStage === 'skills') {
            attachCustomSkillAllocationListeners();
        } else { // 'done'
            renderAllSkillsList(); // Zeigt die Liste für +20% Boosts
        }
    } else if (character.professionKey && PROFESSIONS[character.professionKey] && !PROFESSIONS[character.professionKey].isCustom) {
        // Standardberuf ist ausgewählt
        renderProfessionSpecificChoices(PROFESSIONS[character.professionKey]);
        renderAllSkillsList(); // Zeigt die Liste für +20% Boosts
    } else {
        // Kein Beruf gewählt oder "Custom" aber noch nicht 'done'
        // Leere die spezifischen Details und die Skill-Boost-Liste
        const profDetailsContainer = document.getElementById('profession-details-container');
        if (profDetailsContainer) profDetailsContainer.innerHTML = '';
        const skillIncreaseSection = document.getElementById('skill-increase-section');
        if (skillIncreaseSection) skillIncreaseSection.style.display = 'none';
        const allSkillsListContainer = document.getElementById('all-skills-list-container');
        if(allSkillsListContainer) allSkillsListContainer.innerHTML = ''; // Leeren, wenn kein Beruf
    }
}
// Hilfsfunktion, um eine Skill-Instanz im character.skills Array zu finden oder zu erstellen
// Gibt die gefundene/erstellte Instanz zurück
export function findOrCreateSkillInstance(skillKey, typeName = null, isProfessional = false, profSkillValueTarget = 0, professionalSlotId = null) {
    const character = getCharacter();
    const skillDef = ALL_SKILLS[skillKey];
    if (!skillDef) {
        console.error(`CORE ERROR: Skill-Definition für Key ${skillKey} nicht in ALL_SKILLS gefunden!`);
        return null;
    }

    let instance = null;
    const normalizedTypeName = (skillDef.type && typeName && typeName.trim() !== "") ? typeName.trim() : (skillDef.type ? "" : null);

    // console.log(`--- findOrCreateSkillInstance ---`);
    // console.log(`Params: key=${skillKey}, type=${typeName}, isProf=${isProfessional}, targetVal=${profSkillValueTarget}, profSlotId=${professionalSlotId}, normType='${normalizedTypeName}'`);

    let foundExistingSpecific = false;

    // SUCHE:
    if (professionalSlotId) {
        instance = character.skills.find(s => s.key === skillKey && s.slotId === professionalSlotId);
        // if (instance) console.log(`FOCSI: Found instance by professionalSlotId '${professionalSlotId}'`);
    }

    if (!instance && skillDef.type && normalizedTypeName !== "") { // spezifischer Typ, kein Slot oder Slot nicht gefunden
        instance = character.skills.find(s => s.key === skillKey && s.typeName === normalizedTypeName && !s.slotId); // Nur nicht-Slot-gebundene
        if (instance) {
            // console.log(`FOCSI: Found instance by specific typeName '${normalizedTypeName}' (and not slot-bound)`);
            foundExistingSpecific = true; // Merken, dass wir eine exakte Typ-Übereinstimmung hatten
        }
    }

    if (!instance) { // Immer noch keine -> suche generische (type="") oder nicht-typisierte (type=null) ohne Slot
        instance = character.skills.find(s => s.key === skillKey && s.typeName === normalizedTypeName && !s.slotId);
        // if (instance) console.log(`FOCSI: Found generic/non-typed instance (key=${skillKey}, type='${normalizedTypeName}', no slotId)`);
    }

    // VERARBEITUNG:
    let createdNewInstance = false;
    if (instance) {
        const wantsSpecificProfessionalSlot = !!professionalSlotId;
        // Gilt für Choice Skills, die einen spezifischen Typ bekommen sollen
        const wantsSpecificProfessionalNonSlotType = isProfessional && skillDef.type && normalizedTypeName !== "" && !professionalSlotId;

        // Ansatz B Trigger:
        // 1. Wir wollen einen spezifischen Slot füllen, haben aber eine Instanz ohne diesen Slot gefunden.
        // 2. Wir wollen einen spezifischen Typ (nicht-Slot) professionalisieren, haben aber die generische (type=="", kein Slot) gefunden.
        if ( (wantsSpecificProfessionalSlot && instance.slotId !== professionalSlotId) ||
             (wantsSpecificProfessionalNonSlotType && instance.typeName === "" && !instance.slotId && !foundExistingSpecific) ) {
            // console.log(`FOCSI - Ansatz B / Slot Trigger: Force new. WantsSlot=${wantsSpecificProfessionalSlot}, WantsNonSlotType=${wantsSpecificProfessionalNonSlotType}, FoundInstSlot=${instance.slotId}, FoundInstType='${instance.typeName}'`);
            instance = null;
        } else {
            // console.log(`FOCSI - Update existing: Key=${skillKey}, NormType=${normalizedTypeName}, InstSlot=${instance.slotId}, InstType='${instance.typeName}', isProf=${isProfessional}`);
            if (isProfessional) {
                instance.isProfessional = true;
                // Nur typeName setzen, wenn es ein Default vom Beruf ist und die Instanz generisch war
                // oder wenn wir einen Slot haben und der übergebene typeName dafür gedacht ist (sollte "" sein initial)
                if (skillDef.type && normalizedTypeName !== "" && instance.typeName === "" && !professionalSlotId && !instance.slotId) {
                    instance.typeName = normalizedTypeName;
                }
                const valueFromProfessionOnly = Math.max(0, profSkillValueTarget - skillDef.base);
                instance.baseValueFromProfession = Math.max(instance.baseValueFromProfession || 0, valueFromProfessionOnly);
            }
            // Wert wird unten final berechnet und gekappt
        }
    }

    if (!instance) { // Keine passende Instanz gefunden ODER Neuerstellung wurde erzwungen
        // console.log(`FOCSI - Creating NEW instance for key=${skillKey}, typeName='${normalizedTypeName}', slotId='${professionalSlotId || null}'`);
        const newInstanceId = generateInstanceId(skillKey, professionalSlotId || normalizedTypeName);
        const valueFromProfessionOnlyOnCreate = isProfessional ? Math.max(0, profSkillValueTarget - skillDef.base) : 0;

        instance = {
            instanceId: newInstanceId,
            key: skillKey,
            typeName: normalizedTypeName,
            value: skillDef.base + valueFromProfessionOnlyOnCreate,
            baseValueFromProfession: valueFromProfessionOnlyOnCreate,
            increases: 0,
            isProfessional: isProfessional,
            isChoiceSkill: false,
            slotId: professionalSlotId || null
        };
        character.skills.push(instance);
        createdNewInstance = true;
    }

    // Finale Wertberechnung und Capping für die (gefundene oder neue) Instanz:
    if (instance) {
        if (createdNewInstance && professionalSlotId && typeName === "" && instance.typeName !== "") {
            // Fall: Ein neuer Slot wurde erstellt, der `typeNameToApply` war `""` (Benutzereingabe erwartet),
            // aber `normalizedTypeName` war auch `""`. Stelle sicher, dass `instance.typeName` `""` ist.
            instance.typeName = "";
        }

        // Wert basierend auf allen Komponenten berechnen
        instance.value = skillDef.base +
                         (instance.baseValueFromProfession || 0) +
                         ((instance.increases || 0) * SKILL_INCREASE_AMOUNT);

        // MAX_SKILL_VALUE (z.B. 80) Capping durch Anpassung der Increases
        if (instance.value > MAX_SKILL_VALUE) {
            // console.warn(`FOCSI: Calculated value ${instance.value} for ${instance.key} (${instance.typeName || ''}, Slot: ${instance.slotId || 'N/A'}) exceeds MAX_SKILL_VALUE ${MAX_SKILL_VALUE}. Adjusting increases.`);
            let pointsFromBaseAndProf = skillDef.base + (instance.baseValueFromProfession || 0);
            let maxPointsFromIncreases = MAX_SKILL_VALUE - pointsFromBaseAndProf;

            if (maxPointsFromIncreases < 0) maxPointsFromIncreases = 0;

            let maxAllowedIncreases = Math.floor(maxPointsFromIncreases / SKILL_INCREASE_AMOUNT);
            if (maxAllowedIncreases < 0) maxAllowedIncreases = 0;

            if ((instance.increases || 0) > maxAllowedIncreases) {
                // console.log(`   Reducing increases from ${(instance.increases || 0)} to ${maxAllowedIncreases}`);
                // Hier könnte man die "verlorenen" Increases dem globalen Pool gutschreiben
                // character.availableSkillBoosts += ((instance.increases || 0) - maxAllowedIncreases); // Beispiel
                instance.increases = maxAllowedIncreases;
            }
            // Wert final neu berechnen mit den angepassten Increases
            instance.value = skillDef.base + (instance.baseValueFromProfession || 0) + (instance.increases * SKILL_INCREASE_AMOUNT);
        }

        // Generelle Unter- und Obergrenze (99 ist das absolute Maximum im Spiel)
        instance.value = Math.min(instance.value, 99);
        instance.value = Math.max(instance.value, 0);
    }
    // console.log(`FOCSI Final instance:`, instance ? JSON.parse(JSON.stringify(instance)): "null");
    return instance;
}


// Wird von handleMainProfessionSelectChange aufgerufen, wenn ein Standardberuf gewählt wird
// Neuer Handler für das Haupt-Profession-Dropdown (um zwischen Standard und Custom zu wechseln)
export function handleMainProfessionSelectChange(event) {
    const character = getCharacter();
    const newProfessionKey = event.target.value;
    const oldProfessionKey = character.professionKey;

    if (newProfessionKey === oldProfessionKey && newProfessionKey !== "") return; // Keine echte Änderung

    character.professionKey = newProfessionKey;

    if (newProfessionKey === "custom_profession") {
        const wasNotCustomOrWasDone = oldProfessionKey !== "custom_profession" || character.customProfessionSetupStage === 'done' || !oldProfessionKey;
        character.isCustomProfession = true;
        if (wasNotCustomOrWasDone) {
            character.customProfessionSetupStage = 'bonds';
            // Reset custom profession data
            character.customProfessionBonds = 3;
            character.customProfessionSkillPointBudget = 400; // Wird in renderCustom... neu berechnet
            character.customProfessionSelectedSkills = [];
            character.customProfessionName = "";
            // Wichtig: Skills nicht komplett resetten, wenn man nur zwischen Custom Stages wechselt.
            // Ein kompletter Skill-Reset (initializeCharacterSkills) passiert nur,
            // wenn man von einem Standardberuf zu Custom wechselt oder "Select One" wählt.
            if(oldProfessionKey && oldProfessionKey !== "custom_profession") {
                initializeCharacterSkills(); // Reset skills to base if switching from a standard profession
            }
        }
    } else if (newProfessionKey) { // Ein Standardberuf wurde gewählt
        const wasCustom = character.isCustomProfession;
        character.isCustomProfession = false;
        character.customProfessionSetupStage = 'bonds'; // Reset custom stage

        // Nur Skills und Auswahlen zurücksetzen, wenn sich der Beruf tatsächlich geändert hat
        // oder man von Custom kam.
        if (oldProfessionKey !== newProfessionKey || wasCustom) {
            initializeCharacterSkills(); // Setzt alle Skill-Instanzen zurück auf Basis!
            character.orSkillChoices = {};
            character.profChoiceSkillSelections = {};
        }
        applyStandardProfessionLogic(newProfessionKey);
    } else { // "-- Select One --" wurde gewählt
        character.isCustomProfession = false;
        character.professionKey = null;
        character.customProfessionSetupStage = 'bonds';
        initializeCharacterSkills(); // Setzt Skills auf Basiswerte zurück
        character.orSkillChoices = {};
        character.profChoiceSkillSelections = {};
    }
    if (window.app && window.app.renderCurrentStep) {
        window.app.renderCurrentStep();
    }
}
// Hilfsfunktion für Standardberufslogik, ausgelagert aus handleMainProfessionSelectChange
export function applyStandardProfessionLogic(profKeyToApply) {
    const character = getCharacter();
    const profData = PROFESSIONS[profKeyToApply];
    if (!profData || profData.isCustom) return;

    // initializeCharacterSkills() wurde bereits in handleMainProfessionSelectChange aufgerufen,
    // wodurch alle Skills auf Basiswerte zurückgesetzt wurden (inkl. typeName = "" für typisierte).

    profData.baseSkills.forEach(skillInfo => {
        let keyToApply = skillInfo.key;
        let targetValueToApply = skillInfo.value;
        let typeNameToApplyOnCreate = null; // Wichtig für FOCSI
        let professionalSlotId = null;

        const skillDef = ALL_SKILLS[keyToApply];

        if (skillInfo.orSkills && skillInfo.orSkills.length > 0) {
            // Für "orSkills" wird der Typ initial leer sein, wenn der gewählte Skill typisiert ist.
            // Der Nutzer muss ihn dann ggf. in 1.3 spezifizieren, wenn er den Skill boostet.
            // Hier setzen wir die erste Option als Standard.
            const chosenOrData = skillInfo.orSkills[0];
            character.orSkillChoices[skillInfo.id] = chosenOrData.key; // Initialwahl speichern
            keyToApply = chosenOrData.key;
            targetValueToApply = chosenOrData.value;
            typeNameToApplyOnCreate = ALL_SKILLS[keyToApply]?.type ? "" : null;
        } else if (skillDef.type) {
            if (skillInfo.typeNameDefault) {
                typeNameToApplyOnCreate = skillInfo.typeNameDefault;
            } else if (skillInfo.id) { // Ein "leerer" Slot wie sci1, sci2
                professionalSlotId = skillInfo.id;
                typeNameToApplyOnCreate = ""; // Typ wird vom User in 1.2 UI eingegeben
            } else { // Typisierter Skill ohne Default und ohne Slot-ID (seltener Fall für Basis-Berufsskill)
                typeNameToApplyOnCreate = "";
            }
        } else { // Nicht-typisierter Skill
            typeNameToApplyOnCreate = null;
        }

        // findOrCreateSkillInstance kümmert sich um die Erstellung/Aktualisierung
        // Die `true` für isProfessional und der `targetValueToApply` setzen den Berufswert.
        findOrCreateSkillInstance(keyToApply, typeNameToApplyOnCreate, true, targetValueToApply, professionalSlotId);
    });
    console.log("applyStandardProfessionLogic finished for:", profKeyToApply);
}
export function attachCustomBondSetupListeners() {
    const character = getCharacter(); /* ... bleibt erstmal ähnlich ... */
    const btnDecreaseBonds = document.getElementById('btn-decrease-bonds');
    const btnIncreaseBonds = document.getElementById('btn-increase-bonds');
    const btnConfirmBonds = document.getElementById('btn-confirm-bonds');
    const customProfNameInput = document.getElementById('custom-profession-name');

    if (btnDecreaseBonds) {
        btnDecreaseBonds.onclick = () => {
            if (character.customProfessionBonds > 1) {
                character.customProfessionBonds--;
                if (window.app && window.app.renderCurrentStep) {
        window.app.renderCurrentStep();
    }
            }
        };
    }
    if (btnIncreaseBonds) {
        btnIncreaseBonds.onclick = () => {
            if (character.customProfessionBonds < 4) {
                character.customProfessionBonds++;
                if (window.app && window.app.renderCurrentStep) {
        window.app.renderCurrentStep();
    }
            }
        };
    }
    if (btnConfirmBonds) {
        btnConfirmBonds.onclick = () => {
            if (!character.customProfessionName || character.customProfessionName.trim() === "") {
                alert("Please enter a name for your custom profession."); // Oder i18n
                return;
            }
            character.customProfessionSetupStage = 'skills';
            character.customProfessionSelectedSkills = []; // Reset für Skill-Auswahl-Phase
            if (window.app && window.app.renderCurrentStep) {
        window.app.renderCurrentStep();
    }
        };
    }
    if (customProfNameInput) {
        customProfNameInput.addEventListener('input', (event) => {
            character.customProfessionName = event.target.value;
        });
    }
}
export function renderProfessionSpecificChoices(profData) {
    const character = getCharacter();
    const container = document.getElementById('profession-details-container');
    if (!container) {
        console.error("renderProfessionSpecificChoices: Container #profession-details-container NOT FOUND");
        return;
    }
    // console.log("renderProfessionSpecificChoices: CALLED for profData:", profData.nameKey);

    let detailsHtml = `<h3 data-i18n="step1_2_profession_specific_label">${t('step1_2_profession_specific_label')}</h3>`;
    detailsHtml += `<p><strong data-i18n="bonds_label">${t('bonds_label')}:</strong> ${profData.bonds}</p>`;

    // Ermittle Keys, die bereits durch "orSkill"-Auswahl belegt sind (für spätere Nutzung in Choice Skills)
    const chosenOrSkillKeys = new Set();
    profData.baseSkills.forEach(skillInfo => {
        if (skillInfo.orSkills && skillInfo.orSkills.length > 0) {
            const currentChoice = character.orSkillChoices[skillInfo.id] || skillInfo.orSkills[0].key;
            chosenOrSkillKeys.add(currentChoice);
        }
    });

    // 1. Basis-Skills des Berufs rendern
    profData.baseSkills.forEach(skillInfo => {
        if (skillInfo.orSkills && skillInfo.orSkills.length > 0) {
            // --- Fall: "OR" Skill Gruppe ---
            // console.log("Rendering orSkills for group:", skillInfo.id);
            const currentChoiceKey = character.orSkillChoices[skillInfo.id] || skillInfo.orSkills[0].key;
            detailsHtml += `<div class="profession-choice-group or-skill-group">
                                <p>${t('choose_one_label')}:</p>`;
            skillInfo.orSkills.forEach((orOption) => {
                const orSkillDef = ALL_SKILLS[orOption.key];
                if (!orSkillDef) {
                    console.error(`Render OrSkill: Skill-Definition für ${orOption.key} fehlt!`);
                    detailsHtml += `<span style="color:red;">Error: Skill '${orOption.key}' def missing</span>`;
                    return; // continue forEach
                }
                const skillName = t(orSkillDef.nameKey);
                detailsHtml += `<label class="inline-label">
                                    <input type="radio" name="orSkill_${skillInfo.id}" 
                                           value="${orOption.key}" data-group-id="${skillInfo.id}" 
                                           data-target-value="${orOption.value}" 
                                           ${currentChoiceKey === orOption.key ? 'checked' : ''}> 
                                    ${skillName} (${orOption.value}%)
                                </label> `;
            });
            detailsHtml += `</div>`;
        } else if (skillInfo.key) {
            // --- Fall: Regulärer Basis-Skill (hat einen 'key') ---
            const baseSkillDef = ALL_SKILLS[skillInfo.key];
            if (!baseSkillDef) {
                console.error(`renderProfessionSpecificChoices: Skill-Definition für Key ${skillInfo.key} fehlt.`);
                detailsHtml += `<p style="color:red;">Error: Skill definition missing for ${skillInfo.key}</p>`;
                return; // Nächster skillInfo in profData.baseSkills.forEach
            }

            if (baseSkillDef.type) { // Typisierter Basis-Skill (kann Slot oder Skill mit Default sein)
                const skillName = t(baseSkillDef.nameKey);
                const targetValue = skillInfo.value;
                let currentInstance = null;
                let uiElementIdSuffixForInput = "";

                // Finde die zugehörige Instanz im character.skills Array
                if (skillInfo.id && !skillInfo.typeNameDefault) {
                    // Dies ist ein "leerer" Slot, der durch seine ID identifiziert wird (z.B. "sci1")
                    currentInstance = character.skills.find(s => s.key === skillInfo.key && s.slotId === skillInfo.id && s.isProfessional);
                    uiElementIdSuffixForInput = skillInfo.id;
                } else {
                    // Typisierter Skill mit typeNameDefault ODER generischer typisierter Prof-Skill ohne Slot-ID
                    const expectedTypeName = skillInfo.typeNameDefault || "";
                    currentInstance = character.skills.find(s =>
                        s.key === skillInfo.key &&
                        s.isProfessional &&
                        !s.slotId &&
                        s.typeName === expectedTypeName
                    );
                    if (!currentInstance && expectedTypeName !== "" && expectedTypeName !== null) { // Fallback, falls Typ in Instanz noch leer
                        currentInstance = character.skills.find(s => s.key === skillInfo.key && s.isProfessional && !s.slotId && s.typeName === "");
                        if (currentInstance) currentInstance.typeName = expectedTypeName; // Versuche zu korrigieren
                    }
                    uiElementIdSuffixForInput = currentInstance ? currentInstance.instanceId : generateInstanceId(skillInfo.key, "prof_typed_ui");
                }

                if (!currentInstance) {
                    console.warn(`renderProfessionSpecificChoices: Instanz für professionellen Skill ${skillInfo.key} (ID: ${skillInfo.id}, Default: ${skillInfo.typeNameDefault}) nicht gefunden. Erstelle temporäre UI-Struktur.`);
                    // Erzeuge eine Dummy-Struktur, damit die UI nicht komplett bricht, aber markiere es.
                    // `handleBaseSkillTypeInputChange` wird dann wahrscheinlich nicht die richtige Instanz finden.
                    // Dies deutet auf ein Problem in `applyStandardProfessionLogic` hin.
                    currentInstance = {
                        instanceId: uiElementIdSuffixForInput, // Verwende die generierte ID
                        typeName: skillInfo.typeNameDefault || "",
                        key: skillInfo.key
                    };
                    detailsHtml += `<p style="color:orange;">Hinweis: UI für Skill '${skillName}' (${skillInfo.key}) nicht korrekt geladen (Instanz fehlt).</p>`;
                }

                detailsHtml += `<div class="profession-choice-group typed-base-skill-group">
                                    <label for="typed_base_${uiElementIdSuffixForInput}">${skillName} (${targetValue}%): </label>
                                    <input type="text" id="typed_base_${uiElementIdSuffixForInput}"
                                           class="skill-type-input base-skill-type-input"
                                           data-instance-id="${currentInstance.instanceId}" 
                                           value="${currentInstance.typeName || ""}"
                                           placeholder="${t('specify_type_placeholder')}">
                                 </div>`;
            }
            // Nicht-typisierte Basis-Skills (z.B. Firearms 50%) erfordern hier keine eigene UI-Interaktion,
            // da ihr Wert und Typ feststehen und direkt angewendet werden.
        } else {
            // Dieser Fall sollte nicht eintreten, wenn PROFESSIONS korrekt strukturiert ist
            // (d.h., jedes Element in baseSkills hat entweder .orSkills oder .key)
            console.warn("renderProfessionSpecificChoices: Ungültiges skillInfo-Objekt in baseSkills von Prof:", profData.nameKey, skillInfo);
        }
    }); // Ende profData.baseSkills.forEach

    // 2. Choice Skills (Checkboxen)
    if (profData.choiceSkills) {
        detailsHtml += `<div class="profession-choice-group choice-skill-group" style="margin-top:15px;">
                            <p>${t('choose_N_label', { N: profData.choiceSkills.count })}:</p><ul>`;
        profData.choiceSkills.options.forEach(choiceOpt => {
            // Prüfe, ob dieser Choice Skill durch eine "orSkill"-Auswahl blockiert ist
            if (chosenOrSkillKeys.has(choiceOpt.key)) {
                // Wenn blockiert, rendere diese Option nicht in der Choice-Liste
                // Alternativ: Deaktiviert anzeigen, aber das macht die Liste unübersichtlich
                return; // Nächste choiceOpt
            }

            const skillDefChoice = ALL_SKILLS[choiceOpt.key];
             if (!skillDefChoice) {
                console.error(`Render ChoiceSkill: Skill-Definition für ${choiceOpt.key} fehlt!`);
                detailsHtml += `<li><span style="color:red;">Error: Skill '${choiceOpt.key}' def missing</span></li>`;
                return; // continue forEach
            }
            const skillName = t(skillDefChoice.nameKey);
            const isSelectedAsChoice = !!character.profChoiceSkillSelections[choiceOpt.key];
            let typeNameValueForChoice = "";

            if (isSelectedAsChoice && skillDefChoice.type) {
                const choiceInstance = character.skills.find(s => s.key === choiceOpt.key && s.isChoiceSkill === true);
                typeNameValueForChoice = choiceInstance?.typeName || "";
            }

            detailsHtml += `<li>
                                <label class="inline-label">
                                    <input type="checkbox" class="prof-choice-skill-cb" 
                                           data-skill-key="${choiceOpt.key}" 
                                           data-target-value="${choiceOpt.value}"
                                           data-is-typed="${skillDefChoice.type ? 'true' : 'false'}"
                                           ${isSelectedAsChoice ? 'checked' : ''}> 
                                    ${skillName} (${choiceOpt.value}%)
                                </label>`;
            if (skillDefChoice.type) {
                detailsHtml += 
                    `<input type="text" class="skill-type-input choice-skill-type-input" ` +
                    `data-skill-key-for-choice="${choiceOpt.key}" ` +
                    `placeholder="${t('specify_type_placeholder')}" ` +
                    `value="${typeNameValueForChoice}" ` +
                    `style="display:${isSelectedAsChoice ? 'inline-block':'none'}; margin-left: 10px;">`;
            }
            detailsHtml += `</li>`;
        });
        detailsHtml += `</ul></div>`;
    }

    container.innerHTML = detailsHtml;
    translateAllElements(container); // Übersetzungen für die neu generierten Elemente
    // Beachte: attachProfessionChoiceListenersInternal erwartet jetzt `chosenOrSkillKeys` nicht mehr als direkten Parameter,
    // da die Filterung schon beim Rendern passiert. Die Listener-Funktion muss ggf. auf `character.orSkillChoices` zugreifen,
    // wenn sie die aktuelle "orSkill"-Blockierung für ihre interne Logik braucht (z.B. beim Deaktivieren von Checkboxen).
    // Für den Moment übergeben wir es weiterhin, da es in der letzten Version so war.
    attachProfessionChoiceListenersInternal(profData);
}
function attachProfessionChoiceListenersInternal(profData) {
    const character = getCharacter();
    console.log("attachProfessionChoiceListenersInternal START. character.orSkillChoices:", JSON.parse(JSON.stringify(character.orSkillChoices)));
    // Listener für "orSkill" Radio-Buttons
    document.querySelectorAll('input[type="radio"][name^="orSkill_"]').forEach(radio => {
        radio.removeEventListener('change', handleOrSkillChange); // Alte entfernen
        radio.addEventListener('change', handleOrSkillChange);
    });

    // Listener für Typ-Eingabefelder von direkten typisierten Basis-Skills (die kein typeNameDefault hatten)
    document.querySelectorAll('.base-skill-type-input').forEach(input => {
        input.removeEventListener('input', handleBaseSkillTypeInputChange); // Alte entfernen
        input.addEventListener('input', handleBaseSkillTypeInputChange);
    });

    document.querySelectorAll('.choice-skill-type-input').forEach(input => {
        input.removeEventListener('input', handleChoiceSkillTypeInputChange); // Der Input-Handler
        input.removeEventListener('blur', handleChoiceSkillTypeInputBlur);  // Der NEUE Blur-Handler
        input.addEventListener('input', handleChoiceSkillTypeInputChange);
        input.addEventListener('blur', handleChoiceSkillTypeInputBlur);
    });

    // Listener für Checkbox Choice Skills
    document.querySelectorAll('.prof-choice-skill-cb').forEach(checkbox => {
        checkbox.removeEventListener('change', handleChoiceSkillCbChange); // Alte entfernen
        checkbox.addEventListener('change', handleChoiceSkillCbChange);
        // Initialer Zustand (Deaktivierung, Typ-Input Sichtbarkeit)
        const maxChoices = profData.choiceSkills.count;
        const checkedCount = document.querySelectorAll('.prof-choice-skill-cb:checked').length;
        if (!checkbox.checked) {
            checkbox.disabled = checkedCount >= maxChoices;
            checkbox.closest('label').classList.toggle('disabled-choice', checkbox.disabled);
        }
        if (checkbox.checked && checkbox.dataset.isTyped === 'true') {
            const typeInput = checkbox.closest('li').querySelector('.choice-skill-type-input');
            if (typeInput) typeInput.style.display = 'inline-block';
        }
    });

    // Listener für Typ-Eingabefelder von Choice Skills
    document.querySelectorAll('.choice-skill-type-input').forEach(input => {
        input.removeEventListener('input', handleChoiceSkillTypeInputChange); // Alte entfernen
        input.addEventListener('input', handleChoiceSkillTypeInputChange);
    });
}
export function handleChoiceSkillTypeInputChange(event) {
    const character = getCharacter();
    const typeInput = event.target;
    const skillKeyForChoice = typeInput.dataset.skillKeyForChoice;
    // const newPartialTypeName = typeInput.value; // Wert während der Eingabe

    // console.log(`ChoiceSkillTypeInputChange (1.2): Key=${skillKeyForChoice}, Current Value='${newPartialTypeName}'`);

    // Momentan keine Datenmanipulation hier. Die Hauptlogik ist im Blur-Handler.
    // Update button state during typing to reflect validation status
    updateNavigationButtons();
}
// --- Event Handler für Profession Specific Choices ---
export function handleOrSkillChange(e) {
    const character = getCharacter();
    const selectedKey = e.target.value;
    const groupId = e.target.dataset.groupId;
    const targetValue = parseInt(e.target.dataset.targetValue);

    console.log("--- handleOrSkillChange ---");
    console.log("Event Target:", e.target);
    console.log("Selected Key:", selectedKey, "Target Value:", targetValue, "Group ID:", groupId);

    const previousChoiceKey = character.orSkillChoices[groupId];
console.log("handleOrSkillChange START. groupId:", groupId, "character.orSkillChoices for this group:", character.orSkillChoices[groupId], "Full orSkillChoices:", JSON.parse(JSON.stringify(character.orSkillChoices)));
    console.log("Previous Choice Key for group", groupId, ":", previousChoiceKey);

    if (previousChoiceKey && previousChoiceKey !== selectedKey) {
        // Wichtig: Finde die Instanz, die AKTUELL als professionell für diesen 'previousChoiceKey' gilt.
        // Ihr typeName ist für nicht-typisierte Skills 'null'.
        const oldInstance = character.skills.find(s =>
            s.key === previousChoiceKey &&
            s.isProfessional === true && // Es MUSS die professionelle Instanz sein
            (ALL_SKILLS[previousChoiceKey]?.type ? s.typeName === "" : s.typeName === null) && // Generischer Typ oder null
            !s.isChoiceSkill // Nicht Teil einer anderen Choice-Gruppe
        );

        if (oldInstance) {
            console.log("Found oldInstance to de-prof:", JSON.parse(JSON.stringify(oldInstance)));
            oldInstance.isProfessional = false;
            oldInstance.baseValueFromProfession = 0;
            oldInstance.value = ALL_SKILLS[oldInstance.key].base + ((oldInstance.increases || 0) * SKILL_INCREASE_AMOUNT);
            console.log("OldInstance after de-prof:", JSON.parse(JSON.stringify(oldInstance)));
        } else {
            console.warn(`Could not find old professional OR-instance to de-professionalize for key: ${previousChoiceKey}`);
        }
    }

    character.orSkillChoices[groupId] = selectedKey;
    const typeOfNewChoice = ALL_SKILLS[selectedKey]?.type ? "" : null;
    const newOrUpdatedInstance = findOrCreateSkillInstance(selectedKey, typeOfNewChoice, true, targetValue);
    
    console.log("New/Updated Prof OR-Instance:", newOrUpdatedInstance ? JSON.parse(JSON.stringify(newOrUpdatedInstance)) : "null");
    // console.log("All skills after or-change:", JSON.parse(JSON.stringify(character.skills)));

    renderAllSkillsList();
    updateNavigationButtons();
}
export function handleBaseSkillTypeInputChange(e) {
    const character = getCharacter();
    const instanceIdFromInput = e.target.dataset.instanceId;
    const newTypeName = e.target.value.trim();
    const skillInstance = character.skills.find(s => s.instanceId === instanceIdFromInput);

    console.log(`--- handleBaseSkillTypeInputChange (Step 1.2 Base Prof Skill) ---`);
    console.log(`Input data-instance-id: ${instanceIdFromInput}, New Type: '${newTypeName}'`);

    if (skillInstance && ALL_SKILLS[skillInstance.key].type) {
        console.log(`   Found instance: ${skillInstance.instanceId} (Key: ${skillInstance.key}, Old Type: '${skillInstance.typeName}')`);
        if (skillInstance.typeName !== newTypeName) {
            skillInstance.typeName = newTypeName;
            console.log(`   Updated instance typeName to '${newTypeName}'.`);
            // Wichtig: Die Haupt-Skill-Liste (für Schritt 1.3) muss aktualisiert werden,
            // da sich der Anzeigename (Skill + Typ) geändert haben könnte.
            renderAllSkillsList();
        }
        updateNavigationButtons(); // Validierung könnte vom Typ abhängen
    } else {
        console.warn("   Instance not found or skill not typed for instanceId from input:", instanceIdFromInput);
    }
}
export function handleChoiceSkillCbChange(e) {
    const character = getCharacter();
    const checkbox = e.target;
    const skillKey = checkbox.dataset.skillKey;
    const targetValue = parseInt(checkbox.dataset.targetValue);
    const isTypedSkillFromDefinition = ALL_SKILLS[skillKey]?.type;
    const listItem = checkbox.closest('li');
    const typeInput = listItem ? listItem.querySelector('.choice-skill-type-input') : null;

    const profData = PROFESSIONS[character.professionKey];
    if (!profData || !profData.choiceSkills) {
        // ... (Fehlerbehandlung)
        return;
    }
    const maxChoices = profData.choiceSkills.count;

    console.log(`--- handleChoiceSkillCbChange (Checkbox in Step 1.2) ---`);
    console.log(`SkillKey: ${skillKey}, Checkbox DOM state: ${checkbox.checked}`);

    if (checkbox.checked) {
        // ... (Logik für AUSWÄHLEN - bleibt wie in der Version, die für dich zuletzt funktioniert hat)
        const numCheckedAfterThisClick = document.querySelectorAll('.prof-choice-skill-cb:checked').length;
        if (numCheckedAfterThisClick > maxChoices) {
            checkbox.checked = false;
            alert(t('alert_max_choices_reached', { N: maxChoices }));
            console.log(`   Max choices (${maxChoices}) reached. Selection of ${skillKey} reverted.`);
        } else {
            character.profChoiceSkillSelections[skillKey] = true;
            if (typeInput) {
                 typeInput.style.display = 'inline-block';
                 typeInput.value = "";
            }
            if (!isTypedSkillFromDefinition) {
                console.log(`   Non-typed Choice Skill ${skillKey} selected. Calling FOCSI.`);
                const instance = findOrCreateSkillInstance(skillKey, null, true, targetValue);
                if (instance) {
                    instance.isChoiceSkill = true;
                    // console.log("   Created/Updated NON-TYPED choice instance:", JSON.parse(JSON.stringify(instance)));
                }
            } else {
                console.log(`   Typed Choice Skill ${skillKey} selected. UI prepared. Type will be finalized on input blur.`);
            }
            updateNavigationButtons(); // Update button state when choice skill is selected
        }

    } else { // SKILL WURDE GERADE ABGEWÄHLT (DOM-Zustand ist jetzt 'not checked')
        character.profChoiceSkillSelections[skillKey] = false;
        let originalTypeNameFromUI = "";
        if (typeInput) {
            originalTypeNameFromUI = typeInput.value.trim(); // Wert aus dem Input, BEVOR es geleert/versteckt wird
            typeInput.style.display = 'none';
            // typeInput.value = ""; // UI-Feld wird geleert, Wert ist schon in originalTypeNameFromUI
        }
        console.log(`   Choice Skill ${skillKey} (UI Type war: '${originalTypeNameFromUI}') deselected.`);

        const typeNameToFind = isTypedSkillFromDefinition ? originalTypeNameFromUI : null;

        const instanceIndexToDeactivate = character.skills.findIndex(s =>
            s.key === skillKey &&
            s.isChoiceSkill === true &&
            s.typeName === typeNameToFind
        );

        if (instanceIndexToDeactivate !== -1) {
            const instanceToHandle = character.skills[instanceIndexToDeactivate];
            const increasesToReturn = instanceToHandle.increases || 0;

            console.log(`   Handling deselection of Choice Skill instance: ${instanceToHandle.instanceId} (Key: ${instanceToHandle.key}, Type: '${instanceToHandle.typeName}', Current Increases: ${increasesToReturn})`);

            const skillDef = ALL_SKILLS[skillKey];

            // Bedingung für das Entfernen der Instanz:
            // Es ist ein per Definition typisierter Skill UND die Instanz hatte einen spezifischen Typ.
            if (skillDef.type && instanceToHandle.typeName && instanceToHandle.typeName.trim() !== "") {
                console.log(`       Specific TYPED instance ${instanceToHandle.instanceId} will be REMOVED.`);
                character.skills.splice(instanceIndexToDeactivate, 1); // Instanz entfernen

                if (increasesToReturn > 0) {
                    console.log(`       ${increasesToReturn} boost(s) were on this removed instance. These are now effectively available again.`);
                    // Die Boosts sind "zurückgegeben", da die Instanz weg ist.
                    // Die Zählung `totalIncreasesGlobal` in `renderAllSkillsList` wird automatisch niedriger sein.
                    // Es ist keine explizite Aktion nötig, um sie einem "Pool" hinzuzufügen,
                    // da der Pool durch `MAX_SKILL_INCREASES - totalIncreasesGlobal` definiert ist.
                }
            } else {
                // Nicht-typisierter Choice Skill ODER ein typisierter, der aus irgendeinem Grund
                // keinen spezifischen Typ hatte (sollte bei korrekter Blur-Logik nicht oft vorkommen).
                // In diesem Fall wird die Instanz nur deaktiviert, aber BEHÄLT ihre Boosts.
                console.log(`       Instance ${instanceToHandle.instanceId} is non-typed or had no specific type. Deactivating, Boosts (${increasesToReturn}) remain.`);
                instanceToHandle.isChoiceSkill = false;
                instanceToHandle.isProfessional = false;
                instanceToHandle.baseValueFromProfession = 0;
                instanceToHandle.value = skillDef.base + (increasesToReturn * SKILL_INCREASE_AMOUNT);
                instanceToHandle.value = Math.max(0, Math.min(99, instanceToHandle.value));
            }
        } else {
            console.log(`   No specific active choice instance found to deactivate for key ${skillKey} and UI type '${originalTypeNameFromUI}'.`);
            if (typeInput) typeInput.style.display = 'none';
        }
        updateNavigationButtons(); // Update button state when choice skill is deselected
    }

    // Deaktivierungslogik für ALLE Checkboxen
    const finalNumCheckedInDom = document.querySelectorAll('.prof-choice-skill-cb:checked').length;
    document.querySelectorAll('.prof-choice-skill-cb').forEach(cb => {
        if (!cb.checked) {
            cb.disabled = finalNumCheckedInDom >= maxChoices;
            cb.closest('label').classList.toggle('disabled-choice', cb.disabled);
        } else {
            cb.disabled = false;
            cb.closest('label').classList.remove('disabled-choice');
        }
    });

    renderAllSkillsList();
    updateNavigationButtons();
}

// Handler für Typ-Input-Blur bei Choice Skills in 1.2
export function handleChoiceSkillTypeInputBlur(event) {
    const character = getCharacter(); // Handler für Typ-Input-Blur bei Choice Skills in 1.2
    const typeInput = event.target;
    const skillKey = typeInput.dataset.skillKeyForChoice;
    const listItem = typeInput.closest('li');
    if (!listItem) return;
    const checkbox = listItem.querySelector('.prof-choice-skill-cb');

    if (!checkbox || !checkbox.checked || !ALL_SKILLS[skillKey]?.type) {
        updateNavigationButtons();
        return;
    }

    const newFinalTypeName = typeInput.value.trim();
    const choiceOptDef = PROFESSIONS[character.professionKey]?.choiceSkills.options.find(opt => opt.key === skillKey);
    if (!choiceOptDef) return;
    const targetValueForProfession = choiceOptDef.value; // Dies ist der Wert, den der Skill durch die Berufswahl bekommt

    console.log(`--- handleChoiceSkillTypeInputBlur (Step 1.2 Choice Type) ---`);
    console.log(`INPUT: skillKey=${skillKey}, newFinalTypeName='${newFinalTypeName}', targetValueForProf=${targetValueForProfession}`);
    const skillsBefore = JSON.parse(JSON.stringify(character.skills.filter(s => s.key === skillKey)));
    console.log("character.skills VORHER (gefiltert für " + skillKey + "):", skillsBefore);

    // Finde die Instanz, die aktuell diesen Choice Skill repräsentiert.
    // Es sollte nur eine geben. Wenn mehrere, ist das ein Fehlerzustand.
    let activeChoiceInstance = null;
    const currentChoiceInstances = character.skills.filter(s => s.key === skillKey && s.isChoiceSkill);

    if (currentChoiceInstances.length > 1) {
        console.warn(`WARNUNG: Mehr als eine Instanz für ${skillKey} war als isChoiceSkill markiert! Nehme die erste.`, currentChoiceInstances);
        activeChoiceInstance = currentChoiceInstances[0]; // Willkürliche Wahl zur Korrektur
        // Bereinige die anderen
        for (let i = 1; i < currentChoiceInstances.length; i++) {
            currentChoiceInstances[i].isChoiceSkill = false;
            currentChoiceInstances[i].isProfessional = false;
            currentChoiceInstances[i].baseValueFromProfession = 0;
            // Wert zurücksetzen
        }
    } else if (currentChoiceInstances.length === 1) {
        activeChoiceInstance = currentChoiceInstances[0];
    }

    // Was passiert, wenn es keine `activeChoiceInstance` gab, aber die Checkbox gecheckt ist
    // und jetzt ein Typ eingegeben wird? Das FOCSI unten wird eine erstellen.

    if (newFinalTypeName === "") {
        // Typ wurde explizit geleert.
        console.log(`   Typ für Choice Skill ${skillKey} wurde geleert.`);
        if (activeChoiceInstance) {
            console.log(`   Deaktiviere bisherige Choice-Instanz: ${activeChoiceInstance.instanceId} (Type: '${activeChoiceInstance.typeName}', Increases: ${activeChoiceInstance.increases || 0})`);
            activeChoiceInstance.isChoiceSkill = false;
            activeChoiceInstance.isProfessional = false;
            activeChoiceInstance.baseValueFromProfession = 0;
            activeChoiceInstance.value = ALL_SKILLS[skillKey].base + ((activeChoiceInstance.increases || 0) * SKILL_INCREASE_AMOUNT);
            // Die Instanz (mit ihrem alten Typ und Boosts) bleibt bestehen, ist aber nicht mehr Choice.
            // Sie wird nicht entfernt, auch wenn sie spezifisch war, da sie Boosts haben könnte oder der User den Typ später wieder füllt.
        }
    } else {
        // Ein spezifischer Typ wurde eingegeben/beibehalten.
        if (activeChoiceInstance) {
            // Es gab bereits eine aktive Choice-Instanz.
            if (activeChoiceInstance.typeName !== newFinalTypeName) {
                // Der Typ hat sich geändert! Wir modifizieren die bestehende aktive Choice-Instanz.
                console.log(`   Typ der aktiven Choice-Instanz ${activeChoiceInstance.instanceId} wird von '${activeChoiceInstance.typeName}' zu '${newFinalTypeName}' geändert. Boosts (${activeChoiceInstance.increases || 0}) bleiben.`);
                activeChoiceInstance.typeName = newFinalTypeName;
                // Die Professional-Werte müssen ggf. angepasst werden, falls der baseValueFromProfession sich ändert (sollte bei Choice Skills nicht der Fall sein, aber sicherheitshalber)
                activeChoiceInstance.isProfessional = true;
                activeChoiceInstance.baseValueFromProfession = Math.max(0, targetValueForProfession - ALL_SKILLS[skillKey].base);
                activeChoiceInstance.value = ALL_SKILLS[skillKey].base + activeChoiceInstance.baseValueFromProfession + ((activeChoiceInstance.increases || 0) * SKILL_INCREASE_AMOUNT);
                console.log(`   Aktualisierte Instanz:`, JSON.parse(JSON.stringify(activeChoiceInstance)));
            } else {
                // Typ ist gleich geblieben. Nichts zu tun mit der Instanz selbst, sie war schon korrekt.
                console.log(`   Typ ist gleich geblieben. Bestehende Choice-Instanz ${activeChoiceInstance.instanceId} bleibt aktiv.`);
            }
        } else {
            // Es gab KEINE vorherige aktive Choice-Instanz für diesen skillKey (oder sie wurde gerade durch Typ-Leerung deaktiviert).
            // Erstelle/finde jetzt eine Instanz für den newFinalTypeName und mache sie zum Choice Skill.
            console.log(`   Keine vorherige aktive Choice-Instanz. Suche/Erstelle Instanz für neuen Choice-Typ '${newFinalTypeName}'.`);
            const instanceForNewChoice = findOrCreateSkillInstance(skillKey, newFinalTypeName, true, targetValueForProfession);
            if (instanceForNewChoice) {
                instanceForNewChoice.isChoiceSkill = true;
                // Professionalität und Wert wurden in FOCSI gesetzt.
                console.log(`   Neue aktive Choice-Instanz: ${instanceForNewChoice.instanceId} (Type: '${instanceForNewChoice.typeName}', Value: ${instanceForNewChoice.value}, Increases: ${instanceForNewChoice.increases || 0})`);
            } else {
                console.error(`   Konnte keine Instanz für Choice Skill ${skillKey} mit Typ '${newFinalTypeName}' finden oder erstellen.`);
            }
        }
    }

    // Sicherheitsnetz: Stelle sicher, dass für diesen skillKey nur EINE Instanz isChoiceSkill ist.
    // Bevorzuge die Instanz mit dem `newFinalTypeName`, falls vorhanden und nicht leer.
    // Sonst keine.
    let finalChoiceMade = false;
    character.skills.forEach(instance => {
        if (instance.key === skillKey) {
            if (newFinalTypeName !== "" && instance.typeName === newFinalTypeName && !finalChoiceMade) {
                if (!instance.isChoiceSkill) { // Nur wenn sie es nicht schon war
                    console.log(`   KORREKTUR (Sicherheitsnetz): Setze ${instance.instanceId} (Typ '${instance.typeName}') zu isChoiceSkill=true`);
                    instance.isChoiceSkill = true;
                    instance.isProfessional = true; // Sicherstellen
                    instance.baseValueFromProfession = Math.max(0, targetValueForProfession - ALL_SKILLS[skillKey].base);
                    instance.value = ALL_SKILLS[skillKey].base + instance.baseValueFromProfession + ((instance.increases || 0) * SKILL_INCREASE_AMOUNT);
                }
                finalChoiceMade = true;
            } else {
                if (instance.isChoiceSkill) { // Wenn eine andere Instanz noch Choice ist
                    console.log(`   KORREKTUR (Sicherheitsnetz): Deaktiviere redundante Choice-Instanz ${instance.instanceId} (Typ '${instance.typeName}')`);
                    instance.isChoiceSkill = false;
                    instance.isProfessional = false;
                    instance.baseValueFromProfession = 0;
                    instance.value = ALL_SKILLS[skillKey].base + ((instance.increases || 0) * SKILL_INCREASE_AMOUNT);
                }
            }
        }
    });


    const skillsAfter = JSON.parse(JSON.stringify(character.skills.filter(s => s.key === skillKey)));
    console.log("character.skills NACHHER (gefiltert für " + skillKey + "):", skillsAfter);

    if (JSON.stringify(skillsBefore) === JSON.stringify(skillsAfter) && typeInput.value.trim() === skillsBefore.find(s=>s.isChoiceSkill)?.typeName) {
        console.log("Keine relevanten Datenänderungen, renderAllSkillsList ggf. nicht nötig.");
    } else {
        renderAllSkillsList();
    }
    updateNavigationButtons();
}
export function renderAllSkillsList() {
    const character = getCharacter();
    const listContainer = document.getElementById('all-skills-list-container');
    if (!listContainer) {
        console.warn("#all-skills-list-container nicht im DOM gefunden in renderAllSkillsList!");
        return;
    }
    listContainer.innerHTML = ''; // Leeren für Neuaufbau

    character.skillBoostsUsed = character.skillBoostsUsed || 0;
    // character.remainingBoostPool wird NICHT MEHR BENÖTIGT

    const increasesChosenEl = document.getElementById('increases-chosen-count');
    if (increasesChosenEl) { // Zeige mit einer Nachkommastelle, falls .5
        increasesChosenEl.textContent = character.skillBoostsUsed.toFixed(character.skillBoostsUsed % 1 !== 0 ? 1 : 0);
    }
    
    // Entferne die Anzeige für den alten remainingBoostPool, falls noch vorhanden
    // Da wir es nicht mehr brauchen, können wir den Code dafür einfach entfernen.
    // const oldPoolDisplay = document.getElementById('skill-boost-pool-container');
    // if (oldPoolDisplay) oldPoolDisplay.style.display = 'none';


    // Filterung und Sortierung der anzuzeigenden Skills
    const instancesToDisplayInStep13 = character.skills.filter(skillInstance => {
        const skillDef = ALL_SKILLS[skillInstance.key];
        if (!skillDef) return false;
        if (skillInstance.key === "unnatural") {
            return skillInstance.isProfessional || (skillInstance.increases || 0) > 0 || skillInstance.value > skillDef.base;
        }
        // Slot-Skills, deren Typ in 1.2 nicht gesetzt wurde, hier NICHT anzeigen
        if (skillInstance.slotId && skillInstance.isProfessional && (skillInstance.typeName === "" || skillInstance.typeName === null)) {
            return false;
        }
        return true;
    }).sort((a, b) => {
        const skillDefA = ALL_SKILLS[a.key];
        const skillDefB = ALL_SKILLS[b.key];
        // Bevorzuge Prof/Choice Skills bei gleichem Key für konsistente Auswahl
        if (a.key === b.key) {
            const aIsSpecial = a.isProfessional || a.isChoiceSkill;
            const bIsSpecial = b.isProfessional || b.isChoiceSkill;
            if (aIsSpecial && !bIsSpecial) return -1;
            if (!aIsSpecial && bIsSpecial) return 1;
            if ((a.increases || 0) > (b.increases || 0)) return -1; // Dann die mit mehr Increases
            if ((a.increases || 0) < (b.increases || 0)) return 1;
        }
        // Alphabetische Sortierung als Fallback oder für unterschiedliche Keys
        const nameA = t(skillDefA.nameKey) + (skillDefA.type && a.typeName && a.typeName.trim() !== "" ? ` (${a.typeName.trim()})` : (skillDefA.type ? ' (...)' : ''));
        const nameB = t(skillDefB.nameKey) + (skillDefB.type && b.typeName && b.typeName.trim() !== "" ? ` (${b.typeName.trim()})` : (skillDefB.type ? ' (...)' : ''));
        return nameA.localeCompare(nameB, getCurrentLanguage());
    });

    if (instancesToDisplayInStep13.length === 0 && character.professionKey) {
        listContainer.innerHTML = `<p><em>${t('step1_3_no_skills_available_or_types_needed')}</em></p>`;
    } else if (instancesToDisplayInStep13.length === 0 && !character.professionKey) {
        listContainer.innerHTML = `<p><em>${t('alert_select_profession')}</em></p>`;
    }

    const editableTypedSkillShownForKey = new Set(); // Verhindert doppelte leere, editierbare Felder pro Key

    instancesToDisplayInStep13.forEach(skillInstanceToRender => {
        const skillDef = ALL_SKILLS[skillInstanceToRender.key];
        // Wenn für diesen Basis-Key schon eine editierbare, leere Zeile gezeigt wurde,
        // und diese Instanz auch so eine wäre, überspringe sie.
        // Dies betrifft primär den Fall, wo eine Prof-Instanz (Typ geleert) und eine generische Instanz
        // desselben Keys beide typ-leer und editierbar wären. Die Sortierung oben sollte die Prof-Instanz bevorzugen.
        if ((skillInstanceToRender.typeName === "" || skillInstanceToRender.typeName === null) &&
            !skillInstanceToRender.isProfessional && !skillInstanceToRender.isChoiceSkill && (skillInstanceToRender.increases || 0) === 0 &&
            skillDef.type && skillInstanceToRender.key !== "unnatural" &&
            editableTypedSkillShownForKey.has(skillInstanceToRender.key)) {
            // console.log(`renderAllSkillsList: Überspringe redundante generische leere editierbare Zeile für ${skillInstanceToRender.key}`);
            return; // continue forEach
        }

        const item = document.createElement('div');
        item.classList.add('skill-list-item');
        item.setAttribute('data-instance-id', skillInstanceToRender.instanceId);

        let skillNameDisplaySpan = `<span class="skill-name">${t(skillDef.nameKey)}</span>`;
        let typeDisplayOrInputHtml = "";
        let isTypeEditableInStep13 = false;

        if (skillDef.type && skillInstanceToRender.key !== "unnatural") {
            // Typ ist in 1.3 editierbar, wenn:
            // 1. Generische Instanz (nicht Prof/Choice, keine Increases, Basiswert)
            // ODER
            // 2. Prof/Choice-Instanz, deren Typ aktuell leer ist (und kein Slot-Skill, dessen Typ in 1.2 festzulegen war)
            if (!skillInstanceToRender.isProfessional && !skillInstanceToRender.isChoiceSkill &&
                (skillInstanceToRender.increases || 0) === 0 && skillInstanceToRender.value === skillDef.base) {
                isTypeEditableInStep13 = true;
            } else if ((skillInstanceToRender.isProfessional || skillInstanceToRender.isChoiceSkill) &&
                       (skillInstanceToRender.typeName === "" || skillInstanceToRender.typeName === null) &&
                       !skillInstanceToRender.slotId) { // Slot-Typen werden nur in 1.2 editiert
                isTypeEditableInStep13 = true;
            }
        }

        if (isTypeEditableInStep13) {
            typeDisplayOrInputHtml = ` <input type="text" class="skill-type-input-inline" data-instance-id="${skillInstanceToRender.instanceId}" value="${skillInstanceToRender.typeName || ""}" placeholder="${t('specify_type_placeholder')}" style="width: 150px; margin-left: 8px; font-size: 0.9em; padding: 3px 5px; border: 1px solid #ccc; border-radius: 2px;">`;
            if (skillInstanceToRender.typeName === "" || skillInstanceToRender.typeName === null) {
                editableTypedSkillShownForKey.add(skillInstanceToRender.key); // Merken, dass wir eine leere editierbare gezeigt haben
            }
        } else if (skillDef.type) {
            if (skillInstanceToRender.typeName && skillInstanceToRender.typeName.trim() !== "") {
                typeDisplayOrInputHtml = ` <span class="skill-type-display">(${skillInstanceToRender.typeName.trim()})</span>`;
            } else { // Typisiert, aber Typ ist leer und nicht editierbar (z.B. Unnatural, oder Slot der in 1.2 leer blieb)
                typeDisplayOrInputHtml = ` <span class="skill-type-display" style="color: #888;">(${t('specify_type_placeholder')})</span>`;
            }
        }

        const professionalMarkerSpan = skillInstanceToRender.isProfessional ? `<em class="prof-marker" style="font-size:0.8em; color:#28a745; margin-left: 5px;">(Prof.)</em>` : '';
        const infoIconSpan = `<span class="skill-info-icon" title="${t(skillDef.descKey)}">i<span class="tooltip">${t(skillDef.descKey)}</span></span>`;
        const currentSkillValue = skillInstanceToRender.value || 0;
        const currentFullIncreasesCount = skillInstanceToRender.increases || 0;

        // --- Plus-Button Logik ---
        let plusButtonText = "+0%";
        let pointsToAddOnClick = 0;
        let costForThisBoost = 0; // WICHTIG: Wird hier korrekt bestimmt
        let plusButtonDisabled = true;
        const typeIsOkForBoost = !skillDef.type || (skillInstanceToRender.typeName && skillInstanceToRender.typeName.trim() !== "");

        if (skillInstanceToRender.key !== "unnatural" && typeIsOkForBoost && currentSkillValue < MAX_SKILL_VALUE) {
            const remainingBoostSlots = parseFloat((MAX_SKILL_INCREASES - character.skillBoostsUsed).toFixed(1)); // Mit toFixed für Präzision

            // Option 1: Ein voller +20% Boost ist möglich
            if (remainingBoostSlots >= 1.0 && (currentSkillValue + SKILL_INCREASE_AMOUNT) <= MAX_SKILL_VALUE) {
                pointsToAddOnClick = SKILL_INCREASE_AMOUNT;
                plusButtonText = `+${SKILL_INCREASE_AMOUNT}%`;
                costForThisBoost = 1.0;
                plusButtonDisabled = false;
            }
            // Option 2: Kein voller Boost mehr möglich/nötig, aber mind. ein halber Slot übrig
            else if (remainingBoostSlots >= 0.5) {
                // Wie viele Punkte passen maximal in den Skill (bis 80%) ODER sind maximal 10 (halber Boost)?
                let maxPossiblePointsForThisClick = Math.min(MAX_SKILL_VALUE - currentSkillValue, SKILL_INCREASE_AMOUNT / 2);
                
                if (maxPossiblePointsForThisClick > 0) {
                    pointsToAddOnClick = maxPossiblePointsForThisClick;
                    plusButtonText = `+${pointsToAddOnClick}%`;
                    costForThisBoost = 0.5; // Ein Teil-Boost oder das Auffüllen kostet immer 0.5 Slots
                    plusButtonDisabled = false;
                } else {
                    // Passt nichts mehr rein, auch kein Teil-Boost
                    plusButtonDisabled = true;
                }
            }
            // Wenn weniger als 0.5 Slots übrig sind, bleibt der Button deaktiviert (Standard)
        }

        // --- Minus-Button Logik mit halben Boosts ---
        let minusButtonText = "-0%";
        let pointsToDecreaseOnClick = 0;
        let boostValueToReturn = 0; // Wieviel von den 8.0 Boosts zurückgegeben wird (1.0 oder 0.5)
        let minusButtonDisabled = true;
        const naturalSkillValue = skillDef.base + (skillInstanceToRender.baseValueFromProfession || 0);

        if (currentSkillValue > naturalSkillValue && character.skillBoostsUsed > 0) {
            // Kann ein voller +20% Boost (1.0 Slot) zurückgenommen werden?
            // Bedingung: Skill hat mind. einen vollen Increase UND es gibt mind. 1.0 Boost-Slot zum Zurückgeben
            if (currentFullIncreasesCount > 0 && (currentSkillValue - SKILL_INCREASE_AMOUNT) >= naturalSkillValue && character.skillBoostsUsed >= 1.0) {
                pointsToDecreaseOnClick = SKILL_INCREASE_AMOUNT;
                minusButtonText = `-${SKILL_INCREASE_AMOUNT}%`;
                boostValueToReturn = 1.0;
                minusButtonDisabled = false;
            }
            // Kann ein Teil-Boost (0.5 Slot) zurückgenommen werden?
            // Bedingung: Skill ist um mind. X Punkte über natural UND es gibt mind. 0.5 Boost-Slot zum Zurückgeben
            else if (character.skillBoostsUsed >= 0.5) {
                // Versuche, 10 Punkte oder den Rest bis zum naturalValue zu entfernen
                let potentialDecrease = Math.min(currentSkillValue - naturalSkillValue, SKILL_INCREASE_AMOUNT / 2);
                if (potentialDecrease > 0) {
                    pointsToDecreaseOnClick = potentialDecrease;
                    minusButtonText = `-${pointsToDecreaseOnClick}%`;
                    boostValueToReturn = 0.5;
                    minusButtonDisabled = false;
                }
            }
        }
        if (pointsToDecreaseOnClick <= 0) minusButtonDisabled = true; // Sicherstellen


        let increaseCountText = "";
        if (currentFullIncreasesCount > 0) {
            increaseCountText = `(${currentFullIncreasesCount}x +${SKILL_INCREASE_AMOUNT}%)`;
        }
        // Wenn du den Wertzuwachs durch Teil-Boosts auch anzeigen willst, wird es komplexer:
        const valueFromFullIncreasesOnly = naturalSkillValue + (currentFullIncreasesCount * SKILL_INCREASE_AMOUNT);
        if (currentSkillValue > valueFromFullIncreasesOnly) {
            increaseCountText += (increaseCountText ? " " : "") + `+${currentSkillValue - valueFromFullIncreasesOnly}%`;
        }


        item.innerHTML = `
            <div class="skill-name-container">
                ${skillNameDisplaySpan}
                ${typeDisplayOrInputHtml}
                ${professionalMarkerSpan}
                ${infoIconSpan}
            </div>
            <div class="skill-value-controls">
                <span class="skill-value">${currentSkillValue}%</span>
                <span class="skill-increase-count">${increaseCountText}</span>
                <button class="skill-decrease-button" 
                        data-instance-id="${skillInstanceToRender.instanceId}" 
                        data-points-to-decrease="${pointsToDecreaseOnClick}"
                        data-boost-value-to-return="${boostValueToReturn}" 
                        ${minusButtonDisabled ? 'disabled' : ''}>${minusButtonText}</button>
                <button class="skill-increase-button" 
                        data-instance-id="${skillInstanceToRender.instanceId}" 
                        data-points-to-add="${pointsToAddOnClick}" 
                        data-cost-for-boost="${costForThisBoost}" 
                        ${plusButtonDisabled ? 'disabled' : ''}>${plusButtonText}</button>
            </div>
        `;
        listContainer.appendChild(item);
    });

    // Event Listener neu binden
    document.querySelectorAll('.skill-increase-button').forEach(button => {
        button.removeEventListener('click', handleSkillIncreaseClick);
        button.addEventListener('click', handleSkillIncreaseClick);
    });
    document.querySelectorAll('.skill-decrease-button').forEach(button => {
        button.removeEventListener('click', handleSkillDecreaseClick);
        button.addEventListener('click', handleSkillDecreaseClick);
    });
    document.querySelectorAll('.skill-type-input-inline').forEach(input => {
        input.removeEventListener('input', handleInlineTypeInputChange);
        input.removeEventListener('blur', handleInlineTypeInputBlurIfDefined);
        input.addEventListener('input', handleInlineTypeInputChange);
        input.addEventListener('blur', handleInlineTypeInputBlurIfDefined);
    });

    translateAllElements(listContainer);
}

// Neuer Handler für die Inline-Typ-Eingabefelder
export function handleInlineTypeInputChange(event) {
    const character = getCharacter();
    const instanceId = event.target.dataset.instanceId;
    const newTypeName = event.target.value;
    const skillInstance = character.skills.find(s => s.instanceId === instanceId);

    console.log(`InlineTypeChange: ID=${instanceId}, NewType='${newTypeName}'`);

    if (skillInstance && ALL_SKILLS[skillInstance.key].type) {
        skillInstance.typeName = newTypeName;
        console.log(`   Updated skillInstance.typeName to '${skillInstance.typeName}'`);

        const skillListItem = document.querySelector(`.skill-list-item[data-instance-id="${instanceId}"]`);
        if (skillListItem) {
            const plusButton = skillListItem.querySelector('.skill-increase-button');
            if (plusButton) {
                let totalIncreases = 0;
                character.skills.forEach(s => totalIncreases += (s.increases || 0));
                const skillDef = ALL_SKILLS[skillInstance.key];

                const typeStillMissingForButton = skillDef.type && (!skillInstance.typeName || skillInstance.typeName.trim() === "");
                let currentPlusDisabled = totalIncreases >= MAX_SKILL_INCREASES ||
                                       skillInstance.value >= MAX_SKILL_VALUE ||
                                       typeStillMissingForButton;
                if (skillInstance.key === "unnatural") currentPlusDisabled = true;

                console.log(`   ButtonCheck: totalInc=${totalIncreases}, val=${skillInstance.value}, typeMissing=${typeStillMissingForButton}, finalDisabled=${currentPlusDisabled}`);
                plusButton.disabled = currentPlusDisabled;
            } else {
                console.error("   Plus button not found for item " + instanceId);
            }
        } else {
            console.error("   Skill list item not found for " + instanceId);
        }
    }
}
// Die handleInlineTypeInputBlurIfDefined Funktion (deine vorherige Version,
// die das Entfernen der generischen Instanz bei leerem Typ + keine Increases beinhaltet)
export function handleInlineTypeInputBlurIfDefined(event) {
    const character = getCharacter();
    const instanceId = event.target.dataset.instanceId;
    const skillInstance = character.skills.find(s => s.instanceId === instanceId);

    if (!skillInstance) {
        console.warn("handleInlineTypeInputBlurIfDefined: Instance not found for ID:", instanceId);
        updateNavigationButtons();
        return;
    }

    const skillDef = ALL_SKILLS[skillInstance.key];
    if (!skillDef.type) {
        updateNavigationButtons();
        return;
    }

    // Speichere den ursprünglichen Typ-Wert vor der Änderung
    const originalTypeName = skillInstance.typeName || "";
    const newFinalTrimmedTypeName = event.target.value.trim();

    if (skillInstance.typeName !== newFinalTrimmedTypeName) {
        skillInstance.typeName = newFinalTrimmedTypeName;
    }
    if (event.target.value !== newFinalTrimmedTypeName) {
        event.target.value = newFinalTrimmedTypeName;
    }

    const isNowEffectivelyEmpty = skillInstance.typeName === "";
    const wasOriginallyEmpty = originalTypeName === "";
    const hadIncreasesPreviously = (skillInstance.increases || 0) > 0;
    const wasGenericInstance = !skillInstance.isProfessional && !skillInstance.isChoiceSkill;

    let reRenderNeeded = false;

    if (isNowEffectivelyEmpty) {
        if (hadIncreasesPreviously) {
            skillInstance.increases = 0;
            skillInstance.value = skillDef.base + (skillInstance.baseValueFromProfession || 0);
            skillInstance.value = Math.max(0, Math.min(99, skillInstance.value));
            reRenderNeeded = true;
        }

        // Nur entfernen, wenn der Typ vorher NICHT leer war (d.h. der Benutzer hat den Typ gelöscht)
        // Wenn der Typ vorher schon leer war, sollte die Instanz nicht entfernt werden
        if (wasGenericInstance && (skillInstance.increases || 0) === 0 && !wasOriginallyEmpty) {
            character.skills = character.skills.filter(s => s.instanceId !== instanceId);
            reRenderNeeded = true;
        }
    } else { // Typ wurde gesetzt/geändert
        // Wenn sich der Typ geändert hat, ist ein Re-Render gut, um z.B. Sortierung und Button-Status zu aktualisieren.
        if (newFinalTrimmedTypeName !== originalTypeName) {
           reRenderNeeded = true;
        }
    }

    if (reRenderNeeded) {
        renderAllSkillsList();
    } else {
        // Ggf. nur den betroffenen Button aktualisieren, wenn kein volles Re-Render nötig
        const skillListItem = document.querySelector(`.skill-list-item[data-instance-id="${instanceId}"]`);
        if (skillListItem) {
            const plusButton = skillListItem.querySelector('.skill-increase-button');
            if (plusButton) {
                let totalIncreases = 0; character.skills.forEach(s => totalIncreases += (s.increases || 0));
                const typeStillMissing = skillDef.type && (skillInstance.typeName === "" || skillInstance.typeName === null);
                plusButton.disabled = totalIncreases >= MAX_SKILL_INCREASES || skillInstance.value >= MAX_SKILL_VALUE || typeStillMissing || skillInstance.key === "unnatural";
            }
        }
    }
    updateNavigationButtons();
}

// Angepasster Handler für +20%
export function handleSkillIncreaseClick(event) {
    const character = getCharacter();
    const instanceId = event.target.dataset.instanceId;
    // Diese Werte kommen jetzt korrekt vom Button
    const pointsToAddFromButton = parseInt(event.target.dataset.pointsToAdd);
    const costForThisBoostFromButton = parseFloat(event.target.dataset.costForBoost);
    
    const skillInstance = character.skills.find(s => s.instanceId === instanceId);

    console.log("--- handleSkillIncreaseClick ---");
    console.log("Button Data: pointsToAdd=", pointsToAddFromButton, "costForThisBoost=", costForThisBoostFromButton);
    console.log("Current skillBoostsUsed BEFORE:", character.skillBoostsUsed);


    if (!skillInstance || pointsToAddFromButton <= 0 || costForThisBoostFromButton <= 0) {
        console.warn("IncreaseClick: Ungültige Instanz, Punkte oder Kosten.", skillInstance, pointsToAddFromButton, costForThisBoostFromButton);
        renderAllSkillsList(); return;
    }

    const skillDef = ALL_SKILLS[skillInstance.key];
    if (skillDef.type && (!skillInstance.typeName || skillInstance.typeName.trim() === "")) {
        alert(t('alert_type_for_skill_needed', { skillName: t(skillDef.nameKey) }));
        return;
    }
    if (skillInstance.key === "unnatural") { return; }
    if (skillInstance.value >= MAX_SKILL_VALUE) { renderAllSkillsList(); return; }

    // Prüfe, ob genügend "Boost-Slots" übrig sind
    if (parseFloat((character.skillBoostsUsed + costForThisBoostFromButton).toFixed(1)) > MAX_SKILL_INCREASES + 0.01) { // +0.01 Toleranz
        alert(t('alert_skill_increase_limit'));
        console.log(`Not enough boost slots. Current: ${character.skillBoostsUsed}, Cost: ${costForThisBoostFromButton}, Max: ${MAX_SKILL_INCREASES}`);
        renderAllSkillsList(); return;
    }

    // `pointsToAddFromButton` sollte bereits der gekappte Wert sein, den der Button anzeigt.
    // Wir müssen hier nur noch sicherstellen, dass wir nicht über MAX_SKILL_VALUE gehen,
    // falls die Button-Logik das nicht perfekt gekappt hat.
    const actualPointsToApply = Math.min(pointsToAddFromButton, MAX_SKILL_VALUE - skillInstance.value);
    if (actualPointsToApply <= 0) {
         console.log("No actual points to apply, skill might be full or button value was 0.");
         renderAllSkillsList(); return;
    }

    skillInstance.value += actualPointsToApply;
    character.skillBoostsUsed += costForThisBoostFromButton;
    character.skillBoostsUsed = parseFloat(character.skillBoostsUsed.toFixed(1)); // Korrektur von Fließkomma-Ungenauigkeiten

    // `skillInstance.increases` zählt nur, wenn ein "voller" 1.0-Slot-Boost angewendet wurde.
    if (costForThisBoostFromButton === 1.0 && actualPointsToApply === SKILL_INCREASE_AMOUNT) {
        skillInstance.increases = (skillInstance.increases || 0) + 1;
    }
    
    skillInstance.value = Math.min(skillInstance.value, MAX_SKILL_VALUE); // Finale Kappung

    console.log(`Applied ${actualPointsToApply} to ${skillInstance.key}. New value: ${skillInstance.value}. Cost: ${costForThisBoostFromButton}. Total Boosts Used: ${character.skillBoostsUsed}. Full Increases on skill: ${skillInstance.increases}`);

    const increasesChosenEl = document.getElementById('increases-chosen-count');
    if (increasesChosenEl) increasesChosenEl.textContent = character.skillBoostsUsed.toFixed(character.skillBoostsUsed % 1 !== 0 ? 1 : 0);

    renderAllSkillsList();
    updateNavigationButtons();
}

// Angepasster Handler für -20%
export function handleSkillDecreaseClick(event) {
    const character = getCharacter();
    const instanceId = event.target.dataset.instanceId;
    const pointsToDecrease = parseInt(event.target.dataset.pointsToDecrease);
    const boostValueToReturn = parseFloat(event.target.dataset.boostValueToReturn); // Kann 1.0 oder 0.5
    const skillInstance = character.skills.find(s => s.instanceId === instanceId);

    if (!skillInstance || pointsToDecrease <= 0 || boostValueToReturn <= 0) {
        // console.warn("DecreaseClick: Ungültige Instanz, Punkte oder Rückgabewert.");
        renderAllSkillsList(); return;
    }

    const skillDef = ALL_SKILLS[skillInstance.key];
    const naturalSkillValue = skillDef.base + (skillInstance.baseValueFromProfession || 0);

    if (skillInstance.value <= naturalSkillValue) { renderAllSkillsList(); return; }
    // Erlaube Reduktion, auch wenn character.skillBoostsUsed 0 ist, aber setze es nicht unter 0.
    // Die Button-Logik sollte das aber schon verhindern.

    const actualPointsDecreased = Math.min(pointsToDecrease, skillInstance.value - naturalSkillValue);
    if (actualPointsDecreased <= 0) { renderAllSkillsList(); return; }

    skillInstance.value -= actualPointsDecreased;
    character.skillBoostsUsed -= boostValueToReturn;
    character.skillBoostsUsed = Math.max(0, parseFloat(character.skillBoostsUsed.toFixed(1))); // Nicht unter 0, Fließkomma korrigieren

    // `skillInstance.increases` (volle Boosts) anpassen
    if (actualPointsDecreased === SKILL_INCREASE_AMOUNT && boostValueToReturn === 1.0 && (skillInstance.increases || 0) > 0) {
        skillInstance.increases--;
    }
    // Wenn ein Teil-Boost (der 0.5 gekostet hat) zurückgenommen wird, und dieser Teil-Boost war auf einem Skill,
    // der vorher z.B. 1.0 `increases` hatte, dann wird `increases` nicht reduziert. Das ist korrekt,
    // da `increases` nur die *vollen* +20er zählt. Die `increaseCountText`-Logik in `renderAllSkillsList`
    // versucht, den Unterschied zwischen `value` und `naturalValue + increases*20` als "Teil-Boost" darzustellen.
    
    const increasesChosenEl = document.getElementById('increases-chosen-count');
    if (increasesChosenEl) increasesChosenEl.textContent = character.skillBoostsUsed.toFixed(character.skillBoostsUsed % 1 !== 0 ? 1 : 0);

    renderAllSkillsList();
    updateNavigationButtons();
}
// NEU: Listener und Handler für Custom Profession - Skill Allocation
export function attachCustomSkillAllocationListeners() {
    const character = getCharacter(); /* TODO: Major rewrite needed */
    const skillListDiv = document.getElementById('custom-profession-skill-list');
    const confirmBtn = document.getElementById('btn-confirm-custom-skills');

    if (skillListDiv) {
        // Event Delegation für die dynamisch erstellten Elemente
        skillListDiv.addEventListener('change', (event) => {
            if (event.target.classList.contains('custom-prof-skill-select-main')) {
                handleCustomBaseSkillMainCheckboxChange(event.target); // Behandelt die Haupt-Checkboxen
            } else if (event.target.classList.contains('custom-instance-type-input')) {
                handleCustomInstanceTypeChange(event.target); // Behandelt Typ-Eingabe für eine Instanz
            }
        });

        skillListDiv.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-add-another-specialization')) {
                handleAddAnotherSpecializationClick(event.target);
            } else if (event.target.classList.contains('remove-custom-skill-instance-btn')) {
                handleRemoveCustomSkillInstanceClick(event.target);
            } else if (event.target.classList.contains('custom-skill-point-btn')) {
                handleCustomInstancePointChangeFromButton(event.target);
            }
        });
    }

    if (confirmBtn) {
        confirmBtn.removeEventListener('click', handleConfirmCustomSkills);
        confirmBtn.addEventListener('click', handleConfirmCustomSkills);
    }
    updateCustomSkillAllocationUI(); // Initialer UI-Status
}
// --- Handler für Custom Profession Skill Allocation ---
export function handleCustomBaseSkillMainCheckboxChange(checkbox) {
    const character = getCharacter();
    const baseKey = checkbox.dataset.skillKey;
    // const isTyped = checkbox.dataset.isTyped === 'true'; // Unused for now
    const isChecked = checkbox.checked;

    const existingInstances = character.customProfessionSelectedSkills.filter(inst => inst.key === baseKey);

    if (isChecked) { // Skill wurde ausgewählt
        if (character.customProfessionSelectedSkills.length >= 10 && existingInstances.length === 0) {
            checkbox.checked = false; // Verhindere Auswahl, wenn Max erreicht und dies ein *neuer* Basis-Skill wäre
            alert(t('alert_max_10_custom_skills'));
            return;
        }
        // Wenn angehakt und noch keine Instanz dieses Basis-Skills existiert, füge eine hinzu.
        if (existingInstances.length === 0) {
            character.customProfessionSelectedSkills.push({
                key: baseKey,
                typeName: "", // Typ initial leer
                points: 0,
                tempInstanceId: generateInstanceId(baseKey, "custom_0") // Eindeutige temporäre ID
            });
        }
    } else { // Skill wurde abgewählt (Haupt-Checkbox)
        // Entferne ALLE Instanzen dieses Basis-Skills aus der Auswahl
        character.customProfessionSelectedSkills = character.customProfessionSelectedSkills.filter(
            inst => inst.key !== baseKey
        );
    }
    if (window.app && window.app.renderCurrentStep) {
        window.app.renderCurrentStep();
    } // Um die UI komplett neu zu zeichnen (inkl. Instanzen-Container)
}


export function handleCustomBaseSkillSelectChange(checkbox) {
    const character = getCharacter();
    const baseKey = checkbox.dataset.skillKey;
    const isTyped = checkbox.dataset.isTyped === 'true';
    const isChecked = checkbox.checked;

    const existingInstancesOfThisBaseKey = character.customProfessionSelectedSkills.filter(inst => inst.key === baseKey);

    if (isChecked) {
        if (character.customProfessionSelectedSkills.length >= 10) {
            checkbox.checked = false; // Verhindern
            alert(t('alert_max_10_custom_skills'));
            return;
        }
        // Wenn angehakt und noch keine Instanz dieses Basis-Skills existiert, füge eine hinzu.
        if (existingInstancesOfThisBaseKey.length === 0) {
            character.customProfessionSelectedSkills.push({
                key: baseKey,
                typeName: "", 
                points: 0,
                tempInstanceId: generateInstanceId(baseKey, "custom_0") 
            });
        }
    } else {
        // Wenn abgewählt, entferne ALLE Instanzen dieses Basis-Skills
        character.customProfessionSelectedSkills = character.customProfessionSelectedSkills.filter(
            inst => inst.key !== baseKey
        );
    }
    if (window.app && window.app.renderCurrentStep) {
        window.app.renderCurrentStep();
    } // Um die Instanzenliste und die UI neu zu zeichnen
}
export function handleAddAnotherSpecializationClick(button) {
    const character = getCharacter();
    const baseKey = button.dataset.skillKey;
    if (character.customProfessionSelectedSkills.length >= 10) {
        alert(t('alert_max_10_custom_skills'));
        return;
    }
    // Füge eine neue, leere Instanz für diesen Basis-Skill hinzu
    const count = character.customProfessionSelectedSkills.filter(i => i.key === baseKey).length;
    character.customProfessionSelectedSkills.push({
        key: baseKey,
        typeName: "",
        points: 0,
        tempInstanceId: generateInstanceId(baseKey, `custom_${count}`)
    });
    if (window.app && window.app.renderCurrentStep) {
        window.app.renderCurrentStep();
    } // UI neu zeichnen
}   
export function handleRemoveCustomSkillInstanceClick(button) {
    const character = getCharacter();
    const tempIdToRemove = button.dataset.instanceTempId;
    character.customProfessionSelectedSkills = character.customProfessionSelectedSkills.filter(
        inst => inst.tempInstanceId !== tempIdToRemove
    );
    if (window.app && window.app.renderCurrentStep) {
        window.app.renderCurrentStep();
    } // UI neu zeichnen
}
export function handleCustomInstanceTypeChange(inputField) {
    const character = getCharacter();
    const tempId = inputField.dataset.instanceTempId;
    const instance = character.customProfessionSelectedSkills.find(inst => inst.tempInstanceId === tempId);
    if (instance) {
        instance.typeName = inputField.value.trim();
    }
    // Kein renderCurrentStep() hier, da es bei jedem Tastendruck feuern würde.
    // updateNavigationButtons() wird durch die Punktänderung oder beim Verlassen des Feldes wichtiger.
    // Für den Moment reicht es, wenn die Validierung beim Bestätigen greift.
    updateNavigationButtons(); // Um "Confirm" Button ggf. zu (de)aktivieren
}

export function handleCustomInstancePointChangeFromButton(button) {
    const character = getCharacter();
    const tempId = button.dataset.instanceTempId;
    const instance = character.customProfessionSelectedSkills.find(inst => inst.tempInstanceId === tempId);
    if (!instance) return;

    const action = button.dataset.action;
    const amount = parseInt(button.dataset.amount);
    const skillDef = ALL_SKILLS[instance.key];
    let currentPoints = instance.points || 0;
    let newPoints = currentPoints;

    let totalPointsSpentCurrently = 0;
    character.customProfessionSelectedSkills.forEach(s => totalPointsSpentCurrently += (s.points || 0));

    if (action === "increase") {
        // Prüfen, ob Budget überschritten würde
        if ((totalPointsSpentCurrently - currentPoints + (currentPoints + amount)) > character.customProfessionSkillPointBudget) {
            // Hier könnte man eine subtilere Meldung geben oder den Button einfach deaktiviert lassen.
            // Für den Moment: keine Erhöhung, wenn Budget nicht reicht.
            return;
        }
        // Prüfen, ob Skill-Maximum (60%) überschritten würde
        if ((skillDef.base + currentPoints + amount) > 60) {
            if (skillDef.base + currentPoints < 60) { // Nur erhöhen, wenn noch nicht bei 60
                newPoints = 60 - skillDef.base;
            } else {
                return; // Bereits bei 60 oder drüber (sollte nicht passieren)
            }
        } else {
            newPoints = currentPoints + amount;
        }
    } else if (action === "decrease") {
        newPoints = Math.max(0, currentPoints - amount);
    }

    instance.points = newPoints;
    updateCustomSkillAllocationUI(); // Aktualisiert die UI-Teile für diese Instanz und das Gesamtbudget
}



export function handleCustomSkillTypeInputChange(inputField) {
    const character = getCharacter();
    const skillKey = inputField.dataset.skillKey;
    if (character.customProfessionSelectedSkills[skillKey]) {
        character.customProfessionSelectedSkills[skillKey].typeName = inputField.value.trim();
    }
    updateNavigationButtons(); // Validierung für "Weiter"-Knopf (Confirm Custom Skills) prüfen
}

// handleCustomSkillPointChange (die verbesserte Version aus der vorherigen Antwort)
export function handleCustomSkillPointChange(button) {
    const character = getCharacter();
    const skillKey = button.dataset.skillKey;
    const action = button.dataset.action; 
    const amount = parseInt(button.dataset.amount); 

    if (!character.customProfessionSelectedSkills[skillKey] && action === "increase") {
        // Dies sollte nicht passieren, wenn Skill nicht ausgewählt ist, aber als Sicherheitsnetz
        character.customProfessionSelectedSkills[skillKey] = { points: 0, typeName: "" };
    } else if (!character.customProfessionSelectedSkills[skillKey]) {
        return;
    }


    let currentPoints = character.customProfessionSelectedSkills[skillKey].points;
    const baseValue = ALL_SKILLS[skillKey].base;
    let newPoints = currentPoints; 

    if (action === "increase") {
        let totalSpent = 0;
        Object.values(character.customProfessionSelectedSkills).forEach(s => totalSpent += (s.points || 0));
        
        if (totalSpent - currentPoints + (currentPoints + amount) > character.customProfessionSkillPointBudget) {
            // console.log("Budget limit for increase");
            updateCustomSkillAllocationUI(); // Nur UI neu zeichnen
            return; 
        }
        
        if ((baseValue + currentPoints + amount) > 60) {
            if (baseValue + currentPoints < 60) { // Nur anpassen, wenn es noch nicht 60 ist
                newPoints = 60 - baseValue; 
            } else { // Ist schon bei 60 oder drüber (sollte nicht passieren)
                updateCustomSkillAllocationUI();
                return;
            }
        } else {
            newPoints = currentPoints + amount;
        }
    } else if (action === "decrease") {
        if (currentPoints - amount < 0) {
            newPoints = 0;
        } else {
            newPoints = currentPoints - amount;
        }
    } else { return; }

    if (newPoints < 0) newPoints = 0; // Doppelte Sicherung
    if ((baseValue + newPoints) > 60) newPoints = 60 - baseValue; // Doppelte Sicherung


    if (newPoints !== currentPoints) {
        character.customProfessionSelectedSkills[skillKey].points = newPoints;
    }
    
    updateCustomSkillAllocationUI(); 
}
export function handleCustomInstancePointChange(instanceIndex, action, amount) {
    const character = getCharacter();
    const instance = character.customProfessionSelectedSkills[instanceIndex];
    if (!instance) return;

    let currentPoints = instance.points;
    const baseValue = ALL_SKILLS[instance.key].base;
    let newPoints = currentPoints;

    if (action === "increase") {
        let totalSpent = 0;
        character.customProfessionSelectedSkills.forEach(s => totalSpent += (s.points || 0));
        if ((totalSpent - currentPoints + (currentPoints + amount)) > character.customProfessionSkillPointBudget) {
            return; 
        }
        if ((baseValue + currentPoints + amount) > 60) {
            if (baseValue + currentPoints < 60) newPoints = 60 - baseValue;
            else return;
        } else {
            newPoints = currentPoints + amount;
        }
    } else if (action === "decrease") {
        newPoints = currentPoints - amount < 0 ? 0 : currentPoints - amount;
    }

    if ((baseValue + newPoints) > 60) newPoints = 60 - baseValue; // Doppelte Sicherung
    if (newPoints < 0) newPoints = 0;

    if (newPoints !== currentPoints) {
        instance.points = newPoints;
    }
    updateCustomSkillAllocationUI();
}

// updateCustomSkillAllocationUI muss jetzt die Liste der Instanzen aktualisieren
// updateCustomSkillAllocationUI muss ggf. leicht angepasst werden,
// um mit `data-instance-temp-id` und der neuen Struktur zu arbeiten.
// Die Logik für das Aktualisieren der Texte und Button-Disabled-Status bleibt ähnlich.
export function updateCustomSkillAllocationUI() {
    const character = getCharacter(); // Aktualisiert Zähler und Button-Status
    const budget = character.customProfessionSkillPointBudget;
    let pointsSpent = 0;
    character.customProfessionSelectedSkills.forEach(inst => pointsSpent += (inst.points || 0));
    const remainingPoints = budget - pointsSpent;
    const numSelectedInstances = character.customProfessionSelectedSkills.length;

    const infoP = document.getElementById('custom-prof-skill-allocation-info');
    if (infoP) {
        infoP.innerHTML = t("custom_prof_info_skill_allocation", { currentBudget: budget, remainingPoints: remainingPoints });
    }
    const countSpan = document.getElementById('custom-skills-selected-actual-count');
    if (countSpan) countSpan.textContent = numSelectedInstances;

    // Deaktiviere Haupt-Checkboxes, wenn 10 Skills gewählt sind und die Box nicht schon gecheckt ist
    document.querySelectorAll('.custom-prof-skill-select-main').forEach(cb => {
        const isBaseRepresented = character.customProfessionSelectedSkills.some(inst => inst.key === cb.dataset.skillKey);
        cb.disabled = numSelectedInstances >= 10 && !isBaseRepresented;
        cb.closest('label').classList.toggle('disabled-choice', cb.disabled);

        // Add-Specialization Button Logik
        const baseItemDiv = cb.closest('.custom-skill-item-base');
        const addSpecButton = baseItemDiv.querySelector('.btn-add-another-specialization');
        if (addSpecButton) {
             const skillDef = ALL_SKILLS[addSpecButton.dataset.skillKey];
             addSpecButton.style.display = (skillDef.type && isBaseRepresented) ? 'inline-block' : 'none';
             addSpecButton.disabled = numSelectedInstances >= 10; // Auch hier deaktivieren
        }
    });


    // Aktualisiere die Controls für jede gerenderte Instanz
    document.querySelectorAll('.skill-instance-controls').forEach(itemDiv => {
        const tempId = itemDiv.dataset.instanceTempId;
        const instance = character.customProfessionSelectedSkills.find(inst => inst.tempInstanceId === tempId);
        if (!instance) { // Sollte nicht passieren, wenn renderCurrentStep() die Liste baut
            itemDiv.style.display = 'none'; // Verstecken, falls doch
            return;
        }

        const skillDef = ALL_SKILLS[instance.key];
        const currentPoints = instance.points || 0;
        const currentTotal = skillDef.base + currentPoints;

        const assignedPointsSpan = itemDiv.querySelector('.custom-skill-assigned-points');
        if (assignedPointsSpan) assignedPointsSpan.textContent = currentPoints;

        const totalValueSpan = itemDiv.querySelector('.custom-skill-total-value');
        if (totalValueSpan) totalValueSpan.innerHTML = `${t('custom_prof_label_skill_total')} ${currentTotal}% (max 60%)`;

        // +/- Buttons für Punkte
        itemDiv.querySelectorAll('.custom-skill-point-btn').forEach(btn => {
            const action = btn.dataset.action;
            const amount = parseInt(btn.dataset.amount);
            if (action === "decrease") {
                btn.disabled = currentPoints < amount; // Deaktiviere, wenn nicht genug Punkte zum Abziehen da sind
            } else if (action === "increase") {
                btn.disabled = (skillDef.base + currentPoints + amount > 60) || (remainingPoints < amount && (currentPoints + amount > instance.points));
            }
        });
    });
    updateNavigationButtons(); // Wichtig für den "Confirm Custom Skills" Button
}


export function handleConfirmCustomSkills() {
    const character = getCharacter();
    if (!validateStep1(true)) { // Nutze validateStep1 für die Prüfung
        return;
    }

    // 1. Setze die Haupt-Skill-Liste zurück (initializeCharacterSkills macht das)
    // ABER: Wir wollen die generischen Instanzen behalten.
    // Stattdessen: Gehe durch character.customProfessionSelectedSkills
    // und erstelle/aktualisiere die entsprechenden Instanzen in character.skills
    
    // Markiere alle aktuellen Skills als nicht-professionell, bevor Custom Skills angewendet werden.
    // (Dies ist wichtig, falls man von einem Standard-Beruf zu Custom wechselt und dann bestätigt)
    character.skills.forEach(s => {
        s.isProfessional = false;
        s.baseValueFromProfession = 0;
        // Neuberechnung des Wertes, falls Increases vorhanden sind
        s.value = ALL_SKILLS[s.key].base + ((s.increases || 0) * SKILL_INCREASE_AMOUNT);
    });


    character.customProfessionSelectedSkills.forEach(customInstance => {
        const skillKey = customInstance.key;
        const typeName = customInstance.typeName; // Kann leer sein, wenn nicht typisiert oder Nutzer nichts eingab
        const pointsFromCustom = customInstance.points || 0;
        const targetValue = ALL_SKILLS[skillKey].base + pointsFromCustom; // Zielwert inkl. Basis

        // `findOrCreateSkillInstance` kümmert sich um die Erstellung/Aktualisierung.
        // Wichtig: Da wir Ansatz B folgen, wird für typisierte Skills mit explizitem typeName eine neue Instanz erstellt,
        // wenn noch keine exakt passende existiert. Die generische Instanz (mit typeName="") bleibt unberührt.
        const mainSkillInstance = findOrCreateSkillInstance(skillKey, typeName, true, targetValue);
        // `isProfessional` und `baseValueFromProfession` werden in `findOrCreateSkillInstance` gesetzt.
        // Der Wert wird dort auch basierend auf targetValue und base berechnet.
    });

    character.customProfessionSetupStage = 'done';
    if (window.app && window.app.renderCurrentStep) {
        window.app.renderCurrentStep();
    } // Zeigt jetzt die +20% Skill-Boost-Liste an
}


// VALIDATE STEP 1 (ERWEITERT für alle Phasen)
// --- Validate & Save Step 1 ---
export function validateStep1(showAlerts = true) {
    const character = getCharacter();
    console.log("--- validateStep1 --- ProfKey:", character.professionKey, "isCustom:", character.isCustomProfession, "CustomStage:", character.customProfessionSetupStage);

    if (!character.professionKey) {
        if (showAlerts) alert(t('alert_select_profession'));
        console.log("validateStep1 FAIL: No professionKey");
        return false;
    }

    if (character.isCustomProfession) {
        if (character.customProfessionSetupStage === 'bonds') {
            if (!character.customProfessionName || character.customProfessionName.trim() === "") {
                if (showAlerts) alert("Please enter a name for your custom profession."); // i18n
                return false; // Verhindert das Fortfahren über den "Confirm Bonds" Button, wenn kein Name
            }
            return true; // "Next" Button ist hier deaktiviert, Validierung für internen Button
        } else if (character.customProfessionSetupStage === 'skills') {
            if (character.customProfessionSelectedSkills.length !== 10) {
                if (showAlerts) alert(t('alert_max_10_custom_skills'));
                return false;
            }
            let pointsSpent = 0;
            character.customProfessionSelectedSkills.forEach(inst => pointsSpent += (inst.points || 0));
            if (pointsSpent !== character.customProfessionSkillPointBudget) {
                if (showAlerts) alert(t('alert_distribute_all_custom_points', {
                    totalBudget: character.customProfessionSkillPointBudget,
                    remainingPoints: character.customProfessionSkillPointBudget - pointsSpent
                }));
                return false;
            }
            for (const customInstance of character.customProfessionSelectedSkills) {
                const skillDef = ALL_SKILLS[customInstance.key];
                if ((skillDef.base + (customInstance.points || 0)) > 60) {
                    if (showAlerts) alert(t('alert_custom_skill_max_60', { skillName: t(skillDef.nameKey) }));
                    return false;
                }
                if (skillDef.type && (!customInstance.typeName || customInstance.typeName.trim() === "")) {
                    if (showAlerts) alert(t('alert_specify_type_for_custom_skill', { skillName: t(skillDef.nameKey) }));
                    return false;
                }
            }
            return true; // Validierung für "Confirm Custom Skills" Button
        }
        // Für 'done' Stage (also +20% Boosts) gibt es keine spezielle Custom-Validierung mehr,
        // die den "Next" Button blockieren würde, außer den allgemeinen Skill-Boost-Regeln.
    } else { // Standardberuf
        const profData = PROFESSIONS[character.professionKey];
        if (!profData) return false;

        // Prüfe Typen für Basis-Skills des Berufs, die typisiert sind und keinen Default haben
        for (const skillInfo of profData.baseSkills) {
            if (ALL_SKILLS[skillInfo.key]?.type && !skillInfo.typeNameDefault && !skillInfo.orSkills) {
                // Finde die Instanz, die für diesen Slot erstellt wurde (sollte eine generische sein)
                const instance = character.skills.find(s => s.key === skillInfo.key && s.isProfessional && (s.typeName === "" || s.typeName === null));
                if (instance && (instance.typeName === "" || instance.typeName === null)) {
                    if (showAlerts) alert(t('alert_type_for_skill_needed', { skillName: t(ALL_SKILLS[skillInfo.key].nameKey) }));
                    return false;
                }
            }
            // Für orSkills: Der Typ wird als "" angenommen, wenn typisiert und muss in der +20% Liste spezifiziert werden.
        }
        // Prüfe, ob die erforderliche Anzahl von Choice Skills ausgewählt wurde
        if (profData.choiceSkills) {
            const requiredChoices = profData.choiceSkills.count;
            const selectedChoicesCount = Object.values(character.profChoiceSkillSelections || {}).filter(selected => selected === true).length;
            
            if (selectedChoicesCount < requiredChoices) {
                if (showAlerts) {
                    alert(t('choose_N_label', { N: requiredChoices }) + '. ' + (requiredChoices === 1 ? 'Please select one choice skill.' : `Please select ${requiredChoices} choice skills.`));
                }
                return false;
            }
            
            // Prüfe Typen für ausgewählte Choice Skills
            for (const choiceKey in character.profChoiceSkillSelections) {
                if (character.profChoiceSkillSelections[choiceKey] && ALL_SKILLS[choiceKey]?.type) {
                    const choiceInstance = character.skills.find(s => s.key === choiceKey && s.isChoiceSkill);
                    // Wenn keine Instanz existiert oder die Instanz keinen Typ hat, ist die Validierung fehlgeschlagen
                    if (!choiceInstance || (choiceInstance.typeName === "" || choiceInstance.typeName === null)) {
                        if (showAlerts) alert(t('alert_type_for_skill_needed', { skillName: t(ALL_SKILLS[choiceKey].nameKey) }));
                        return false;
                    }
                }
            }
        }
    }
    // Allgemeine Validierung für die +20% Boost Phase (gilt für Standard und Custom 'done')
    if (!character.isCustomProfession || (character.isCustomProfession && character.customProfessionSetupStage === 'done')) {
        // let totalIncreases = 0;
        // character.skills.forEach(s => totalIncreases += (s.increases || 0)); // Diese Zählung ist jetzt nicht mehr die richtige für die 8 Boosts

        // Verwende stattdessen character.skillBoostsUsed
        // Check if we're on step 1 (validation happens when user clicks Next on step 1)
        if (character.skillBoostsUsed < MAX_SKILL_INCREASES) {
            if (showAlerts) { 
                const message = t('confirm_incomplete_skill_boosts', { maxBoosts: MAX_SKILL_INCREASES });
                const confirmContinue = confirm(message);
                if (!confirmContinue) {
                    console.log("validateStep1 FAIL: User chose not to continue with incomplete boosts.");
                    return false;
                }
            }
            // Wenn showAlerts false ist (interne Prüfung für Button-Status), dann ist es okay,
            // aber für den "Next"-Klick wollen wir die Bestätigung.
            // Für den Button-Status: Wenn weniger als 8, ist der Next-Button erstmal aktiv,
            // erst beim Klick kommt die Bestätigung. Das ist gängige Praxis.
        }

        // Sicherstellen, dass alle geboosteten typisierten Skills einen Typ haben
        for (const skillInst of character.skills) {
            const skillDef = ALL_SKILLS[skillInst.key];
            const needsTypeFilledIn = skillDef.type && (skillInst.typeName === "" || skillInst.typeName === null);
            const isRelevantForTyping = skillInst.isProfessional || skillInst.isChoiceSkill || (skillInst.increases || 0) > 0;

            if (needsTypeFilledIn && isRelevantForTyping) {
                if (showAlerts) alert(t('alert_type_for_skill_needed', { skillName: t(skillDef.nameKey) }));
                console.log(`validateStep1 FAIL: Type needed for relevant skill. Key: ${skillInst.key}, Name: '${skillInst.typeName}', Prof: ${skillInst.isProfessional}, Choice: ${skillInst.isChoiceSkill}, Inc: ${skillInst.increases}`);
                return false;
            }
        }
    }
    console.log("validateStep1 PASS");
    return true;
}

export function saveStep1() {
    const character = getCharacter();
    // Die meisten Daten (Berufswahl, Skill-Instanzen, Custom-Prof-Daten)
    // sind bereits im `character`-Objekt durch die Event-Handler.
    // Für Custom Berufe: `handleConfirmCustomSkills` überträgt die ausgewählten Skills in die Haupt-Skill-Liste.
    // Hier ist nichts weiter zu tun.
}