// Step 5: Summary
// This module displays the final character summary with print/download functionality

import { getCharacter } from '../model/character.js';
import { calculateDerivedAttributes } from '../model/character.js';
import { ALL_SKILLS } from '../config/skills.js';
import { PROFESSIONS } from '../config/professions.js';
import { STAT_KEYS } from '../config/constants.js';
import { t, getCurrentLanguage } from '../i18n/i18n.js';

export function renderStep5_Summary() {
    const character = getCharacter();
    calculateDerivedAttributes();
    let professionDisplayName = t('not_selected');
    if (character.professionKey) {
        if (character.professionKey === 'custom_profession') {
            professionDisplayName = character.customProfessionName.trim() !== "" ? character.customProfessionName : t(PROFESSIONS.custom_profession.nameKey);
        } else if (PROFESSIONS[character.professionKey]) {
            professionDisplayName = t(PROFESSIONS[character.professionKey].nameKey);
        } else {
            professionDisplayName = character.professionKey.replace(/_/g, ' ');
        }
    }

    let html = `<div class="step" id="step5-summary">
        <h2 data-i18n="summary_title"></h2>

        <div class="summary-block summary-block-personal-data">
            <h3 class="summary-block-title" data-i18n="summary_section_personal_details"></h3>
            <div class="summary-personal-grid">
                <div><strong data-i18n="summary_label_name"></strong> <span class="placeholder-field long"></span></div>
                <div><strong data-i18n="summary_label_profession"></strong> <span class="value-field">${professionDisplayName}</span></div>
                <div><strong data-i18n="summary_label_employer"></strong> <span class="placeholder-field long"></span></div>
                <div><strong data-i18n="summary_label_nationality"></strong> <span class="placeholder-field"></span></div>
                <div><strong data-i18n="summary_label_sex"></strong> <span class="placeholder-field short"></span></div>
                <div><strong data-i18n="summary_label_age_dob"></strong> <span class="placeholder-field"></span></div>
            </div>
        </div>

        <div class="summary-grid-stats-psych">
            <div class="summary-block summary-block-statistical-data">
                <h3 class="summary-block-title" data-i18n="summary_label_statistical_data"></h3>
                <h4 class="summary-subsection-title" data-i18n="summary_section_statistics"></h4>
                <table class="summary-table summary-stats-table">
                    <thead>
                        <tr>
                            <th data-i18n="summary_col_statistic"></th>
                            <th data-i18n="summary_col_score"></th>
                            <th data-i18n="summary_col_x5"></th>
                            <th data-i18n="summary_col_features"></th>
                        </tr>
                    </thead>
                    <tbody>`;
    STAT_KEYS.forEach(key => {
        const statName = t('stat_' + key.toLowerCase() + '_name').replace(/\s\(.*\)/, '');
        const statValue = character.stats[key] || 0;
        const percentile = statValue * 5;
        const feature = character.distinguishingFeatures[key] || "---";
        html += `<tr>
                    <td>${statName} (${key})</td>
                    <td class="value-cell">${statValue}</td>
                    <td class="value-cell">${percentile}%</td>
                    <td>${feature}</td>
                 </tr>`;
    });
    html += `       </tbody>
                </table>
                <h4 class="summary-subsection-title" data-i18n="summary_section_derived_attr"></h4>
                <table class="summary-table summary-derived-table">
                    <thead>
                        <tr>
                            <th data-i18n="summary_col_derived_attribute"></th>
                            <th data-i18n="summary_col_maximum_value"></th>
                            <th data-i18n="summary_col_current_value"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-i18n="attr_hp_name"></td>
                            <td class="value-cell">${character.derivedAttributes.HP}</td>
                            <td class="placeholder-cell"></td>
                        </tr>
                        <tr>
                            <td data-i18n="attr_wp_name"></td>
                            <td class="value-cell">${character.derivedAttributes.WP}</td>
                            <td class="placeholder-cell"></td>
                        </tr>
                        <tr>
                            <td data-i18n="attr_san_name"></td>
                            <td class="value-cell">${character.derivedAttributes.SAN}</td>
                            <td class="placeholder-cell"></td>
                        </tr>
                        <tr>
                            <td data-i18n="attr_bp_name"></td>
                            <td class="value-cell">${character.derivedAttributes.BP}</td>
                            <td class="placeholder-cell"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="summary-block summary-block-psychological-data">
                <h3 class="summary-block-title" data-i18n="summary_label_psychological_data"></h3>
                <h4 class="summary-subsection-title" data-i18n="summary_section_bonds"></h4>
                <ul class="summary-list">`;
    if (character.bonds && character.bonds.length > 0) {
        character.bonds.forEach((bond) => {
            html += `<li><strong>${bond.description || `(${t('not_defined')})`}</strong>: <span class="value-highlight">${bond.score}</span></li>`;
        });
    } else { html += `<li><em>${t('not_defined')}</em></li>`; }
    html += `       </ul>
                <h4 class="summary-subsection-title" data-i18n="summary_section_motivations"></h4>
                <ul class="summary-list">`;
    const definedMotivations = character.motivations.filter(m => m && m.trim() !== "");
    if (definedMotivations.length > 0) {
        definedMotivations.forEach((motivation) => { html += `<li>${motivation}</li>`; });
    } else { html += `<li><em>${t('not_defined')}</em></li>`; }
    html += `       </ul>
            </div>
        </div>

        <div class="summary-block summary-block-skills">
            <h3 class="summary-block-title" data-i18n="summary_section_skills"></h3>
            <div class="summary-skills-multicolumn">`;
    
    // === BEGINN DER KORRIGIERTEN SKILL-AUSGABE ===
    // Erstelle eine Map aller Skill-Instanzen gruppiert nach Skill-Key
    const skillInstancesByKey = new Map();
    if (Array.isArray(character.skills)) {
        character.skills.forEach(skillInstance => {
            if (!skillInstancesByKey.has(skillInstance.key)) {
                skillInstancesByKey.set(skillInstance.key, []);
            }
            skillInstancesByKey.get(skillInstance.key).push(skillInstance);
        });
    }

    const allCharacterSkills = [];
    
    // Iteriere durch ALL_SKILLS, um alle verfügbaren Skills anzuzeigen
    for (const skillKey in ALL_SKILLS) {
        if (!ALL_SKILLS.hasOwnProperty(skillKey)) continue;
        
        const baseSkillData = ALL_SKILLS[skillKey];
        const instances = skillInstancesByKey.get(skillKey) || [];
        
        if (baseSkillData.type) {
            // Für typisierte Skills: Zeige alle Instanzen mit typeName
            if (instances.length > 0) {
                instances.forEach(skillInstance => {
                    let displayName = t(baseSkillData.nameKey);
                    if (skillInstance.typeName && skillInstance.typeName.trim() !== "") {
                        displayName += ` (${skillInstance.typeName.trim()})`;
                    }
                    allCharacterSkills.push({ 
                        name: displayName, 
                        value: skillInstance.value, 
                        base: baseSkillData.base 
                    });
                });
            } else {
                // Zeige auch typisierte Skills ohne Instanzen (mit Basiswert)
                const displayName = t(baseSkillData.nameKey);
                allCharacterSkills.push({ 
                    name: displayName, 
                    value: baseSkillData.base, 
                    base: baseSkillData.base 
                });
            }
        } else {
            // Für nicht-typisierte Skills: Zeige eine Instanz (oder Basiswert)
            if (instances.length > 0) {
                const skillInstance = instances[0]; // Nimm die erste Instanz
                const displayName = t(baseSkillData.nameKey);
                allCharacterSkills.push({ 
                    name: displayName, 
                    value: skillInstance.value, 
                    base: baseSkillData.base 
                });
            } else {
                // Zeige auch nicht-typisierte Skills ohne Instanzen (mit Basiswert)
                const displayName = t(baseSkillData.nameKey);
                allCharacterSkills.push({ 
                    name: displayName, 
                    value: baseSkillData.base, 
                    base: baseSkillData.base 
                });
            }
        }
    }
    
    allCharacterSkills.sort((a, b) => a.name.localeCompare(b.name, getCurrentLanguage()));

    if (allCharacterSkills.length > 0) {
        html += `<ul class="skills-flat-list">`; // Nur EINE UL mit dieser Klasse
        allCharacterSkills.forEach(skill => {
            const isModified = skill.value !== skill.base;
            const baseDisplayValue = (skill.base > 0 || isModified) ? `(${skill.base}%)` : ""; // Zeige Basis nur wenn >0 oder wenn modifiziert
            const baseDisplaySpan = isModified ? ` <span class="base-value">${baseDisplayValue}</span>` : "";
            const displayValue = isModified ? `<strong>${skill.value}%</strong>${baseDisplaySpan}` : `${skill.value}%`;
            html += `<li>${skill.name}: ${displayValue}</li>`;
        });
        html += `</ul>`;
    } else { 
        html += `<p><em>${t('no_skills_available')}</em></p>`; 
    }
    // === ENDE DER KORRIGIERTEN SKILL-AUSGABE ===

    html += `   </div>
        </div>

        <div class="summary-actions" style="margin-top: 30px;">
            <button id="btn-print-summary" class="action-button" data-i18n="btn_print_summary"></button>
        </div>
    </div>`;
    return html;
}

export function attachStep5Listeners() {
    const btnPrint = document.getElementById('btn-print-summary');
    if (btnPrint) {
        btnPrint.addEventListener('click', () => {
            window.print();
        });
    }

    // const btnDownload = document.getElementById('btn-download-txt');
    // if (btnDownload) {
    //     btnDownload.addEventListener('click', generateAndDownloadTxtSummary);
    // }
}

// function generateAndDownloadTxtSummary() {
//     let summaryText = `${t('summary_title')}\n\n`;

//     summaryText += `== ${t('summary_section_personal_details')} ==\n`;
//     summaryText += `${t('summary_placeholder_name')}\n`;
//     summaryText += `${t('summary_placeholder_age')}\n`;
//     summaryText += `${t('summary_placeholder_sex')}\n\n`;

//     summaryText += `== ${t('summary_section_profession')} ==\n`;
//     let professionDisplayNameTxt = t('not_selected');
//     if (character.professionKey) {
//         if (character.professionKey === 'custom_profession') {
//             professionDisplayNameTxt = character.customProfessionName.trim() !== "" ? character.customProfessionName : t(PROFESSIONS.custom_profession.nameKey);
//         } else if (PROFESSIONS[character.professionKey]) {
//             professionDisplayNameTxt = t(PROFESSIONS[character.professionKey].nameKey);
//         } else {
//             professionDisplayNameTxt = character.professionKey.replace(/_/g, ' ');
//         }
//     }
//     summaryText += `${professionDisplayNameTxt}\n\n`;

//     summaryText += `== ${t('summary_section_statistics')} ==\n`;
//     STAT_KEYS.forEach(key => {
//         const statName = t('stat_' + key.toLowerCase() + '_name');
//         const statValue = character.stats[key] || 0;
//         const percentile = statValue * 5;
//         const feature = character.distinguishingFeatures[key] || "";
//         summaryText += `${statName}: ${statValue} (${percentile}%) ${feature ? `(${feature})` : ''}\n`;
//     });
//     summaryText += "\n";

//     summaryText += `== ${t('summary_section_derived_attr')} ==\n`;
//     summaryText += `${t('attr_hp_name')}: ${character.derivedAttributes.HP}\n`;
//     summaryText += `${t('attr_wp_name')}: ${character.derivedAttributes.WP}\n`;
//     summaryText += `${t('attr_san_name')}: ${character.derivedAttributes.SAN}\n`;
//     summaryText += `${t('attr_bp_name')}: ${character.derivedAttributes.BP}\n\n`;

//     summaryText += `== ${t('summary_section_skills')} ==\n`;
//     const relevantSkills = []; // Dieselbe Logik wie in renderStep5_Summary
//     for (const skillKey in character.skills) { /* ... */ } // (Code kopieren)
//     // ... (Schleife kopieren und anpassen für Textausgabe)
//      for (const skillKey in character.skills) {
//         const skill = character.skills[skillKey];
//         const baseSkillData = ALL_SKILLS[skillKey];
//         if (skill.value > baseSkillData.base || skill.increases > 0 || skill.isProfessional || skill.isChoiceSkill || (baseSkillData.type && skill.typeName)) {
//             let displayName = t(baseSkillData.nameKey);
//             if (baseSkillData.type && skill.typeName && skill.typeName.trim() !== "") {
//                 displayName += ` (${skill.typeName.trim()})`;
//             }
//             relevantSkills.push({ name: displayName, value: skill.value });
//         }
//     }
//     relevantSkills.sort((a, b) => a.name.localeCompare(b.name, currentLanguage));
//     if (relevantSkills.length > 0) {
//         relevantSkills.forEach(skill => {
//             summaryText += `${skill.name}: ${skill.value}%\n`;
//         });
//     } else {
//         summaryText += `(${t('not_defined')})\n`;
//     }
//     summaryText += "\n";


//     summaryText += `== ${t('summary_section_bonds')} ==\n`;
//     if (character.bonds && character.bonds.length > 0) {
//         character.bonds.forEach((bond, index) => {
//             summaryText += `${t('bond_label_number', {number: index + 1})}: ${bond.description || `(${t('not_defined')})`} - Score: ${bond.score}\n`;
//         });
//     } else {
//         summaryText += `(${t('not_defined')})\n`;
//     }
//     summaryText += "\n";

//     summaryText += `== ${t('summary_section_motivations')} ==\n`;
//     const definedMotivations = character.motivations.filter(m => m && m.trim() !== "");
//     if (definedMotivations.length > 0) {
//         definedMotivations.forEach((motivation) => {
//             summaryText += `- ${motivation}\n`;
//         });
//     } else {
//         summaryText += `(${t('not_defined')})\n`;
//     }

//     // Download initiieren
//     const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", "delta_green_character.txt");
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
// }

export function validateStep5() { return true; }
export function saveStep5() { /* Nichts zu speichern */ }
