// Step 5: Summary
// This module displays the final character summary with print/download functionality

import { getCharacter } from '../model/character.js?v=09f6897';
import { calculateDerivedAttributes } from '../model/character.js?v=09f6897';
import { ALL_SKILLS } from '../config/skills.js?v=09f6897';
import { PROFESSIONS } from '../config/professions.js?v=09f6897';
import { STAT_KEYS } from '../config/constants.js?v=09f6897';
import { t, getCurrentLanguage } from '../i18n/i18n.js?v=09f6897';
import { escapeHtml, normalizeSheetCharacterFields, getBondScoreMax } from '../utils/sheet-edit.js?v=09f6897';

function renderPersonalSection(character, professionDisplayName, isEditable) {
    const pi = character.personalInfo || {};
    if (!isEditable) {
        return `
        <div class="summary-block summary-block-personal-data">
            <h3 class="summary-block-title" data-i18n="summary_section_personal_details"></h3>
            <div class="summary-personal-grid">
                <div><strong data-i18n="summary_label_name"></strong> <span class="value-field">${escapeHtml(pi.name || '')}</span></div>
                <div><strong data-i18n="summary_label_profession"></strong> <span class="value-field">${escapeHtml(professionDisplayName)}</span></div>
                <div><strong data-i18n="summary_label_employer"></strong> <span class="value-field">${escapeHtml(pi.employer || '')}</span></div>
                <div><strong data-i18n="summary_label_nationality"></strong> <span class="value-field">${escapeHtml(pi.nationality || '')}</span></div>
                <div><strong data-i18n="summary_label_sex"></strong> <span class="value-field">${escapeHtml(pi.sex || '')}</span></div>
                <div><strong data-i18n="summary_label_age_dob"></strong> <span class="value-field">${escapeHtml(pi.age ? pi.age + (pi.dob ? ' / ' + pi.dob : '') : (pi.dob || ''))}</span></div>
            </div>
        </div>`;
    }

    return `
        <div class="summary-block summary-block-personal-data">
            <h3 class="summary-block-title" data-i18n="summary_section_personal_details"></h3>
            <div class="summary-personal-grid summary-personal-grid-editable">
                <label class="sheet-field"><span data-i18n="summary_label_name"></span><input type="text" class="sheet-edit-input" data-sheet-field="personal-name" value="${escapeHtml(pi.name || '')}" autocomplete="off"></label>
                <div class="sheet-field sheet-field-readonly"><span data-i18n="summary_label_profession"></span><span class="value-field">${escapeHtml(professionDisplayName)}</span></div>
                <label class="sheet-field"><span data-i18n="summary_label_employer"></span><input type="text" class="sheet-edit-input" data-sheet-field="personal-employer" value="${escapeHtml(pi.employer || '')}" autocomplete="off"></label>
                <label class="sheet-field"><span data-i18n="summary_label_nationality"></span><input type="text" class="sheet-edit-input" data-sheet-field="personal-nationality" value="${escapeHtml(pi.nationality || '')}" autocomplete="off"></label>
                <label class="sheet-field"><span data-i18n="summary_label_sex"></span><input type="text" class="sheet-edit-input" data-sheet-field="personal-sex" value="${escapeHtml(pi.sex || '')}" autocomplete="off"></label>
                <label class="sheet-field"><span data-i18n="summary_label_age_dob"></span><span class="sheet-field-split"><input type="text" class="sheet-edit-input" data-sheet-field="personal-age" value="${escapeHtml(pi.age || '')}" placeholder="${escapeHtml(t('personal_info_age_placeholder'))}" autocomplete="off"><input type="text" class="sheet-edit-input" data-sheet-field="personal-dob" value="${escapeHtml(pi.dob || '')}" placeholder="${escapeHtml(t('personal_info_dob_placeholder'))}" autocomplete="off"></span></label>
            </div>
        </div>`;
}

function renderStatsRows(character, isEditable) {
    const colScore = escapeHtml(t('summary_col_score'));
    const colX5 = escapeHtml(t('summary_col_x5'));
    const colFeatures = escapeHtml(t('summary_col_features'));
    let rows = '';
    STAT_KEYS.forEach((key) => {
        const statName = t('stat_' + key.toLowerCase() + '_name').replace(/\s\(.*\)/, '');
        const statValue = character.stats[key] || 0;
        const percentile = statValue * 5;
        const feature = character.distinguishingFeatures[key] || '';
        if (isEditable) {
            rows += `<tr>
                <td><span class="sheet-roll-target" data-roll-type="stat" data-stat-key="${key}" role="button" tabindex="0">${escapeHtml(statName)} (${key})</span></td>
                <td class="value-cell" data-col-label="${colScore}"><input type="number" class="sheet-edit-input sheet-edit-input-stat" data-sheet-field="stat-${key}" min="3" max="18" value="${statValue || ''}"></td>
                <td class="value-cell" data-col-label="${colX5}" data-sheet-x5="${key}">${statValue ? percentile + '%' : '—'}</td>
                <td data-col-label="${colFeatures}"><input type="text" class="sheet-edit-input" data-sheet-field="feature-${key}" value="${escapeHtml(feature)}" placeholder="—"></td>
            </tr>`;
        } else {
            rows += `<tr>
                <td>${escapeHtml(statName)} (${key})</td>
                <td class="value-cell" data-col-label="${colScore}">${statValue}</td>
                <td class="value-cell" data-col-label="${colX5}">${percentile}%</td>
                <td data-col-label="${colFeatures}">${escapeHtml(feature || '---')}</td>
            </tr>`;
        }
    });
    return rows;
}

function renderDerivedRows(character, isEditable) {
    const derivedKeys = [
        { key: 'HP', labelKey: 'attr_hp_name' },
        { key: 'WP', labelKey: 'attr_wp_name' },
        { key: 'SAN', labelKey: 'attr_san_name' },
        { key: 'BP', labelKey: 'attr_bp_name' }
    ];
    const current = character.derivedCurrent || {};
    const colMax = escapeHtml(t('summary_col_maximum_value'));
    const colCurrent = escapeHtml(t('summary_col_current_value'));
    return derivedKeys.map(({ key, labelKey }) => {
        const max = character.derivedAttributes[key] ?? 0;
        const cur = current[key] ?? max;
        const currentCell = isEditable
            ? `<input type="number" class="sheet-edit-input sheet-edit-input-stat" data-sheet-field="derived-current-${key}" min="0" max="${max}" value="${cur}">`
            : `<span class="placeholder-cell">${escapeHtml(String(cur))}</span>`;
        const label = escapeHtml(t(labelKey));
        const labelCell = isEditable
            ? `<span class="sheet-roll-target" data-roll-type="derived" data-derived-key="${key}" role="button" tabindex="0">${label}</span>`
            : label;
        return `<tr>
            <td>${labelCell}</td>
            <td class="value-cell" data-col-label="${colMax}" data-sheet-derived-max="${key}">${max}</td>
            <td class="value-cell" data-col-label="${colCurrent}">${currentCell}</td>
        </tr>`;
    }).join('');
}

function renderBondsList(character, isEditable) {
    if (!character.bonds?.length) {
        return `<li><em>${t('not_defined')}</em></li>`;
    }
    return character.bonds.map((bond, index) => {
        const bondScoreMax = getBondScoreMax(character.stats?.CHA, bond.score);
        if (isEditable) {
            return `<li class="sheet-bond-row" data-sheet-bond-index="${index}">
                <label class="sheet-bond-field sheet-bond-field-desc">
                    <span class="sheet-bond-field-label">${escapeHtml(t('bond_label_number', { number: index + 1 }))}</span>
                    <input type="text" class="sheet-edit-input sheet-edit-input-bond-desc" data-sheet-field="bond-desc" value="${escapeHtml(bond.description || '')}" placeholder="${escapeHtml(t('bond_description_placeholder'))}" autocomplete="off">
                </label>
                <label class="sheet-bond-field sheet-bond-field-score">
                    <span class="sheet-bond-field-label">${escapeHtml(t('bond_score_short'))}</span>
                    <input type="number" class="sheet-edit-input sheet-edit-input-bond-score" data-sheet-field="bond-score" min="0" max="${bondScoreMax}" value="${bond.score ?? 0}" aria-label="${escapeHtml(t('bond_score_short'))}">
                </label>
            </li>`;
        }
        return `<li><strong>${escapeHtml(bond.description || `(${t('not_defined')})`)}</strong>: <span class="value-highlight">${bond.score}</span></li>`;
    }).join('');
}

function getMotivationRowsForDisplay(motivations) {
    const rows = (Array.isArray(motivations) ? motivations : [])
        .filter((motivation) => typeof motivation === 'string');
    while (rows.length > 0 && rows[rows.length - 1].trim() === '') {
        rows.pop();
    }
    rows.push('');
    return rows;
}

function renderMotivationsList(character, isEditable) {
    const motivations = character.motivations || [];
    if (isEditable) {
        const rows = getMotivationRowsForDisplay(motivations);
        return rows.map((motivation, index) =>
            `<li class="sheet-motivation-row"><textarea class="sheet-edit-input sheet-edit-textarea sheet-edit-textarea-motivation" data-sheet-field="motivation" data-motivation-index="${index}" rows="1" placeholder="${escapeHtml(t('motivation_placeholder'))}" aria-label="${escapeHtml(t('motivation_label_number', { number: index + 1 }))}">${escapeHtml(motivation || '')}</textarea></li>`
        ).join('');
    }
    const defined = motivations.filter((m) => m && m.trim() !== '');
    if (defined.length === 0) {
        return `<li><em>${t('not_defined')}</em></li>`;
    }
    return defined.map((motivation) => `<li>${escapeHtml(motivation)}</li>`).join('');
}

function renderTraumaSection(character, isEditable) {
    if (!character.traumaticBackground) {
        return '';
    }
    const bgKey = character.traumaticBackground;
    let bgName = '';
    if (bgKey === 'extreme_violence') bgName = t('traumatic_background_extreme_violence');
    else if (bgKey === 'captivity') bgName = t('traumatic_background_captivity');
    else if (bgKey === 'hard_experience') bgName = t('traumatic_background_hard_experience');
    else if (bgKey === 'things_man_was_not_meant_to_know') bgName = t('traumatic_background_things_man');

    let html = `<h4 class="summary-subsection-title" data-i18n="summary_section_traumatic_background"></h4><ul class="summary-list">`;
    html += `<li><strong>${escapeHtml(bgName)}</strong></li>`;

    if (isEditable) {
        html += `<li><label class="sheet-field sheet-field-block"><span data-i18n="disorder_label"></span><input type="text" class="sheet-edit-input" data-sheet-field="disorder" value="${escapeHtml(character.disorder || '')}"></label></li>`;
        html += `<li><label class="sheet-field sheet-field-block"><span data-i18n="sheet_adaptations_label"></span><textarea class="sheet-edit-input sheet-edit-textarea" data-sheet-field="adaptations" rows="3">${escapeHtml((character.adaptations || []).join('\n'))}</textarea></label></li>`;
    } else {
        if (character.adaptations?.length) {
            character.adaptations.forEach((adaptation) => {
                html += `<li><em>${escapeHtml(adaptation)}</em></li>`;
            });
        }
        if (character.disorder?.trim()) {
            html += `<li><strong data-i18n="disorder_label"></strong>: ${escapeHtml(character.disorder)}</li>`;
        }
    }
    html += `</ul>`;
    return html;
}

function renderStatsPsychBlock(character, isEditable) {
    return `
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
                    <tbody>${renderStatsRows(character, isEditable)}</tbody>
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
                    <tbody>${renderDerivedRows(character, isEditable)}</tbody>
                </table>
            </div>
            <div class="summary-block summary-block-psychological-data">
                <h3 class="summary-block-title" data-i18n="summary_label_psychological_data"></h3>
                <h4 class="summary-subsection-title" data-i18n="summary_section_bonds"></h4>
                <ul class="summary-list summary-list-bonds">${renderBondsList(character, isEditable)}</ul>
                <h4 class="summary-subsection-title" data-i18n="summary_section_motivations"></h4>
                <ul class="summary-list summary-list-motivations${isEditable ? ' sheet-motivations-list' : ''}">${renderMotivationsList(character, isEditable)}</ul>
                ${renderTraumaSection(character, isEditable)}
            </div>
        </div>`;
}

function renderSkillLine(skill, isEditable, skillFailMarks = []) {
    const isModified = skill.value !== skill.base;
    const baseSuffix = isModified
        ? ` <span class="sheet-skill-base base-value">(${skill.base}%)</span>`
        : '';
    const rollAttrs = skill.instanceId
        ? `data-roll-type="skill" data-instance-id="${escapeHtml(skill.instanceId)}"`
        : `data-roll-type="skill" data-roll-value="${skill.value}"`;
    const rollName = `<span class="sheet-skill-name sheet-roll-target" ${rollAttrs} role="button" tabindex="0">${escapeHtml(skill.name)}${baseSuffix}:</span>`;
    const isMarked = skill.instanceId && skillFailMarks.includes(skill.instanceId);
    const failCheckbox = skill.instanceId
        ? `<input type="checkbox" class="skill-checkbox skill-fail-marker" data-skill-fail-mark="${escapeHtml(skill.instanceId)}"${isMarked ? ' checked' : ''} aria-label="${escapeHtml(t('skill_fail_mark_aria', { name: skill.name }))}">`
        : `<input type="checkbox" class="skill-checkbox skill-fail-marker" disabled tabindex="-1" aria-hidden="true">`;
    const labelCell = `<span class="sheet-skill-label">${failCheckbox}${rollName}</span>`;

    if (isEditable && skill.instanceId) {
        return `<li class="sheet-skill-row">${labelCell}<input type="number" class="sheet-edit-input sheet-edit-input-skill" data-sheet-field="skill-value" data-instance-id="${escapeHtml(skill.instanceId)}" min="0" max="99" value="${skill.value}"><span class="sheet-skill-unit">%</span></li>`;
    }

    if (isEditable) {
        const valueContent = isModified ? `<strong>${skill.value}</strong>` : `${skill.value}`;
        return `<li class="sheet-skill-row">${labelCell}<span class="sheet-skill-value">${valueContent}</span><span class="sheet-skill-unit">%</span></li>`;
    }

    const valueContent = isModified ? `<strong>${skill.value}</strong>` : `${skill.value}`;
    return `<li class="sheet-skill-row"><span class="sheet-skill-name"><input type="checkbox" class="skill-checkbox" disabled> ${escapeHtml(skill.name)}${baseSuffix}:</span><span class="sheet-skill-value">${valueContent}</span><span class="sheet-skill-unit">%</span></li>`;
}

function resolveSkillColumnCount(options = {}) {
    if (typeof options.skillColumns === 'number' && options.skillColumns >= 1) {
        return Math.min(3, Math.floor(options.skillColumns));
    }
    if (typeof window !== 'undefined' && window.innerWidth) {
        if (window.innerWidth <= 520) {
            return 1;
        }
        if (window.innerWidth <= 750) {
            return 2;
        }
    }
    return 3;
}

export function renderStep5_Summary(options = {}) {
    const { context = 'wizard', editable = true, printLayout = false } = options;
    const isSheet = context === 'sheet';
    const isEditable = isSheet && editable && !printLayout;
    const character = getCharacter();
    normalizeSheetCharacterFields(character);
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

    const summaryId = printLayout ? 'step5-summary-print' : 'step5-summary';
    let html = `<div class="step${isSheet ? ' sheet-summary' : ''}${isEditable ? ' sheet-summary-editable' : ''}${printLayout ? ' sheet-summary-print-layout' : ''}" id="${summaryId}"${isEditable ? ` aria-label="${t('sheet_edit_region')}"` : ''}>`;
    if (!isSheet) {
        html += `<h2 data-i18n="summary_title"></h2>`;
    } else if (!isEditable) {
        const agentPrintName = escapeHtml(character.personalInfo?.name || t('not_defined'));
        html += `<h2 class="sheet-print-agent-title">${agentPrintName}</h2>`;
    }

    html += renderPersonalSection(character, professionDisplayName, isEditable);
    html += renderStatsPsychBlock(character, isEditable);

    html += `
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
                        base: baseSkillData.base,
                        instanceId: skillInstance.instanceId
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
                    base: baseSkillData.base,
                    instanceId: skillInstance.instanceId
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
        const numberOfColumns = printLayout ? 3 : resolveSkillColumnCount(options);
        const itemsPerColumn = Math.ceil(allCharacterSkills.length / numberOfColumns);
        const columns = [];

        for (let col = 0; col < numberOfColumns; col++) {
            columns[col] = [];
            for (let i = 0; i < itemsPerColumn; i++) {
                const index = col * itemsPerColumn + i;
                if (index < allCharacterSkills.length) {
                    columns[col].push(allCharacterSkills[index]);
                }
            }
        }

        html += `<div class="skills-columns-container${printLayout ? ' skills-columns-container--print' : ''}">`;
        for (let col = 0; col < numberOfColumns; col++) {
            html += `<ul class="skills-flat-list skills-column">`;
            columns[col].forEach((skill) => {
                html += renderSkillLine(skill, isEditable, character.skillFailMarks || []);
            });
            html += `</ul>`;
        }
        html += `</div>`;
    } else { 
        html += `<p><em>${t('no_skills_available')}</em></p>`; 
    }
    // === ENDE DER KORRIGIERTEN SKILL-AUSGABE ===

    html += `   </div>
        </div>`;

    html += renderItemsSection(character, isEditable, isSheet);

    html += renderNotesSection(character, isEditable, isSheet);

    if (!isSheet) {
        html += `
        <div class="summary-wizard-footer">
            <label class="summary-share-library-option">
                <input type="checkbox" id="share-to-library"${localStorage.getItem('shareToLibraryPreference') !== 'false' ? ' checked' : ''}>
                <span data-i18n="library_share_opt_in"></span>
            </label>
            <p class="summary-share-library-hint" data-i18n="library_share_opt_in_hint"></p>
        </div>`;
    }

    html += `    </div>`;
    return html;
}

function getItemRowsForDisplay(items) {
    const rows = (Array.isArray(items) ? items : [])
        .filter((item) => typeof item === 'string')
        .map((item) => item);
    if (rows.length === 0 || rows[rows.length - 1].trim() !== '') {
        rows.push('');
    }
    return rows;
}

function renderItemsSection(character, isEditable, isSheet) {
    if (!isSheet) {
        return '';
    }

    const storedItems = (Array.isArray(character.items) ? character.items : [])
        .filter((item) => typeof item === 'string' && item.trim() !== '');

    if (isEditable) {
        const rows = getItemRowsForDisplay(character.items);
        const listItems = rows.map((item, index) =>
            `<li class="sheet-item-row">
                <input type="text" class="sheet-edit-input sheet-edit-input-item" data-sheet-field="item" data-item-index="${index}" value="${escapeHtml(item)}" autocomplete="off" placeholder="${escapeHtml(t('sheet_item_placeholder'))}" aria-label="${escapeHtml(t('sheet_item_aria_label', { number: index + 1 }))}">
            </li>`
        ).join('');

        return `
        <div class="summary-block summary-block-items">
            <h3 class="summary-block-title" id="sheet-items-heading" data-i18n="summary_section_items"></h3>
            <ul class="summary-list summary-list-items sheet-items-list" aria-labelledby="sheet-items-heading">
                ${listItems}
            </ul>
        </div>`;
    }

    if (storedItems.length === 0) {
        return '';
    }

    return `
        <div class="summary-block summary-block-items">
            <h3 class="summary-block-title" data-i18n="summary_section_items"></h3>
            <ul class="summary-list summary-list-items">
                ${storedItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
        </div>`;
}

function renderNotesSection(character, isEditable, isSheet) {
    if (!isSheet) {
        return '';
    }

    const notes = character.notes || '';

    if (isEditable) {
        return `
        <div class="summary-block summary-block-notes">
            <h3 class="summary-block-title" id="sheet-notes-heading" data-i18n="summary_section_notes"></h3>
            <textarea
                class="sheet-edit-input sheet-edit-textarea sheet-edit-textarea-notes"
                data-sheet-field="notes"
                rows="10"
                aria-labelledby="sheet-notes-heading"
                placeholder="${escapeHtml(t('sheet_notes_placeholder'))}"
            >${escapeHtml(notes)}</textarea>
        </div>`;
    }

    if (!notes.trim()) {
        return '';
    }

    return `
        <div class="summary-block summary-block-notes">
            <h3 class="summary-block-title" data-i18n="summary_section_notes"></h3>
            <div class="sheet-notes-readonly">${escapeHtml(notes).replace(/\n/g, '<br>')}</div>
        </div>`;
}

export function attachStep5Listeners() {
    const shareCheckbox = document.getElementById('share-to-library');
    if (shareCheckbox) {
        shareCheckbox.addEventListener('change', () => {
            localStorage.setItem('shareToLibraryPreference', shareCheckbox.checked ? 'true' : 'false');
        });
    }
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