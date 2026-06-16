// Collect sheet edits from DOM and persist local characters

import { getCharacter, calculateDerivedAttributes } from '../model/character.js?v=3af973b';
import { saveCharacter } from './storage.js?v=3af973b';
import { PROFESSIONS } from '../config/professions.js?v=3af973b';
import { STAT_KEYS } from '../config/constants.js?v=3af973b';
import { t } from '../i18n/i18n.js?v=3af973b';
export { escapeHtml, escapeAttr } from './escape-html.js?v=3af973b';

export function normalizeSheetCharacterFields(char) {
    if (!char.personalInfo || typeof char.personalInfo !== 'object') {
        char.personalInfo = {};
    }
    if (!char.distinguishingFeatures || typeof char.distinguishingFeatures !== 'object') {
        char.distinguishingFeatures = {};
    }
    if (!char.derivedCurrent || typeof char.derivedCurrent !== 'object') {
        char.derivedCurrent = {};
    }
    if (!Array.isArray(char.motivations)) {
        char.motivations = [];
    }
    char.motivations = char.motivations.filter((motivation) => typeof motivation === 'string');
    if (!Array.isArray(char.skillFailMarks)) {
        char.skillFailMarks = [];
    }
    if (typeof char.notes !== 'string') {
        char.notes = '';
    }
    if (!Array.isArray(char.items)) {
        char.items = [];
    }
    char.items = char.items.filter((item) => typeof item === 'string');
}

const MAX_SHEET_ITEMS = 50;
const MAX_SHEET_MOTIVATIONS = 5;

export function syncSkillFailMark(instanceId, marked) {
    if (!instanceId) {
        return;
    }
    const character = getCharacter();
    normalizeSheetCharacterFields(character);
    const marks = new Set(character.skillFailMarks);
    if (marked) {
        marks.add(instanceId);
    } else {
        marks.delete(instanceId);
    }
    character.skillFailMarks = [...marks];
}

function collectSkillFailMarksFromDOM() {
    const character = getCharacter();
    const marks = [];
    document.querySelectorAll('.skill-fail-marker[data-skill-fail-mark]').forEach((checkbox) => {
        if (checkbox.checked) {
            marks.push(checkbox.getAttribute('data-skill-fail-mark'));
        }
    });
    character.skillFailMarks = marks;
}

function clampStat(value) {
    const n = parseInt(value, 10);
    if (Number.isNaN(n)) {
        return null;
    }
    return Math.max(3, Math.min(18, n));
}

function clampSkill(value) {
    const n = parseInt(value, 10);
    if (Number.isNaN(n)) {
        return null;
    }
    return Math.max(0, Math.min(99, n));
}

function clampBondScore(value, maxScore = 18) {
    const n = parseInt(value, 10);
    if (Number.isNaN(n)) {
        return null;
    }
    const max = Math.max(3, Math.min(18, maxScore));
    return Math.max(0, Math.min(max, n));
}

/** Upper bound for bond score inputs: CHA, but never below an existing score on the sheet. */
export function getBondScoreMax(chaValue, currentScore = 0) {
    const chaMax = clampStat(chaValue) ?? 18;
    const current = parseInt(currentScore, 10);
    return Math.max(chaMax, Number.isNaN(current) ? 0 : current);
}

export function collectSheetEditsFromDOM() {
    const character = getCharacter();
    normalizeSheetCharacterFields(character);

    const field = (name) => document.querySelector(`[data-sheet-field="${name}"]`);

    const nameInput = field('personal-name');
    if (nameInput) {
        character.personalInfo.name = nameInput.value.trim();
    }
    const employerInput = field('personal-employer');
    if (employerInput) {
        character.personalInfo.employer = employerInput.value.trim();
    }
    const nationalityInput = field('personal-nationality');
    if (nationalityInput) {
        character.personalInfo.nationality = nationalityInput.value.trim();
    }
    const sexInput = field('personal-sex');
    if (sexInput) {
        character.personalInfo.sex = sexInput.value.trim();
    }
    const ageInput = field('personal-age');
    if (ageInput) {
        character.personalInfo.age = ageInput.value.trim();
    }
    const dobInput = field('personal-dob');
    if (dobInput) {
        character.personalInfo.dob = dobInput.value.trim();
    }

    STAT_KEYS.forEach((key) => {
        const statInput = field(`stat-${key}`);
        if (statInput) {
            const clamped = clampStat(statInput.value);
            if (clamped != null) {
                character.stats[key] = clamped;
            }
        }
        const featureInput = field(`feature-${key}`);
        if (featureInput) {
            character.distinguishingFeatures[key] = featureInput.value.trim();
        }
    });

    ['HP', 'WP', 'SAN', 'BP'].forEach((key) => {
        const derivedInput = field(`derived-current-${key}`);
        if (!derivedInput) {
            return;
        }
        const raw = derivedInput.value.trim();
        if (raw === '') {
            delete character.derivedCurrent[key];
            return;
        }
        const n = parseInt(raw, 10);
        character.derivedCurrent[key] = Number.isNaN(n) ? 0 : Math.max(0, n);
    });

    document.querySelectorAll('[data-sheet-bond-index]').forEach((row) => {
        const index = parseInt(row.getAttribute('data-sheet-bond-index'), 10);
        if (Number.isNaN(index) || !character.bonds?.[index]) {
            return;
        }
        const desc = row.querySelector('[data-sheet-field="bond-desc"]')?.value?.trim() ?? '';
        const scoreRaw = row.querySelector('[data-sheet-field="bond-score"]')?.value;
        const chaScore = clampStat(character.stats?.CHA) ?? 18;
        const score = clampBondScore(scoreRaw, chaScore);
        character.bonds[index].description = desc;
        if (score != null) {
            character.bonds[index].score = score;
        }
    });

    const motivationInputs = document.querySelectorAll('[data-sheet-field="motivation"]');
    if (motivationInputs.length > 0) {
        const motivations = [];
        motivationInputs.forEach((input) => {
            motivations.push(input.value);
        });
        while (motivations.length > 0 && motivations[motivations.length - 1].trim() === '') {
            motivations.pop();
        }
        character.motivations = motivations;
    }

    document.querySelectorAll('[data-sheet-field="skill-value"]').forEach((input) => {
        const instanceId = input.getAttribute('data-instance-id');
        const clamped = clampSkill(input.value);
        if (!instanceId || clamped == null || !Array.isArray(character.skills)) {
            return;
        }
        const instance = character.skills.find((s) => s.instanceId === instanceId);
        if (instance) {
            instance.value = clamped;
        }
    });

    const disorderInput = field('disorder');
    if (disorderInput) {
        character.disorder = disorderInput.value.trim();
    }

    const adaptationsInput = field('adaptations');
    if (adaptationsInput) {
        character.adaptations = adaptationsInput.value
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
    }

    const itemInputs = document.querySelectorAll('[data-sheet-field="item"]');
    if (itemInputs.length > 0) {
        const items = [];
        itemInputs.forEach((input) => {
            items.push(input.value);
        });
        while (items.length > 0 && items[items.length - 1].trim() === '') {
            items.pop();
        }
        character.items = items;
    }

    const notesInput = field('notes');
    if (notesInput) {
        character.notes = notesInput.value;
    }

    calculateDerivedAttributes();
    collectSkillFailMarksFromDOM();
}

export function saveLocalSheetCharacter(characterId) {
    if (!characterId) {
        return { ok: false, error: 'missing_id' };
    }

    collectSheetEditsFromDOM();
    const character = getCharacter();

    let professionName = 'Unknown';
    if (character.professionKey) {
        if (character.professionKey === 'custom_profession') {
            professionName = character.customProfessionName || 'Custom Profession';
        } else if (PROFESSIONS[character.professionKey]) {
            professionName = PROFESSIONS[character.professionKey].nameKey;
        }
    }

    const characterName = character.personalInfo?.name || 'Unnamed Agent';

    try {
        saveCharacter({
            id: characterId,
            name: characterName,
            profession: professionName,
            data: JSON.parse(JSON.stringify(character))
        });
        character.id = characterId;
        return { ok: true, name: characterName };
    } catch (error) {
        console.error('Error saving sheet character:', error);
        return { ok: false, error: 'save_failed' };
    }
}

function resizeMotivationTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

function resizeAllMotivationTextareas() {
    document.querySelectorAll('[data-sheet-field="motivation"]').forEach((textarea) => {
        resizeMotivationTextarea(textarea);
    });
}

function createMotivationTextarea(index) {
    const textarea = document.createElement('textarea');
    textarea.className = 'sheet-edit-input sheet-edit-textarea sheet-edit-textarea-motivation';
    textarea.setAttribute('data-sheet-field', 'motivation');
    textarea.setAttribute('data-motivation-index', String(index));
    textarea.rows = 1;
    textarea.placeholder = t('motivation_placeholder');
    textarea.setAttribute('aria-label', t('motivation_label_number', { number: index + 1 }));
    return textarea;
}

function appendEmptyMotivationRow(list, index) {
    const li = document.createElement('li');
    li.className = 'sheet-motivation-row';
    li.appendChild(createMotivationTextarea(index));
    list.appendChild(li);
}

function reindexMotivationRows(list) {
    list.querySelectorAll('.sheet-motivation-row').forEach((row, index) => {
        const textarea = row.querySelector('[data-sheet-field="motivation"]');
        if (!textarea) {
            return;
        }
        textarea.setAttribute('data-motivation-index', String(index));
        textarea.setAttribute('aria-label', t('motivation_label_number', { number: index + 1 }));
    });
}

function syncMotivationRows(list) {
    let rows = Array.from(list.querySelectorAll('.sheet-motivation-row'));

    for (let i = rows.length - 2; i >= 0; i--) {
        const textarea = rows[i].querySelector('[data-sheet-field="motivation"]');
        if (!textarea?.value.trim()) {
            rows[i].remove();
        }
    }

    rows = Array.from(list.querySelectorAll('.sheet-motivation-row'));
    while (rows.length > 1) {
        const last = rows[rows.length - 1];
        const secondLast = rows[rows.length - 2];
        const lastEmpty = !last.querySelector('[data-sheet-field="motivation"]')?.value.trim();
        const secondLastEmpty = !secondLast.querySelector('[data-sheet-field="motivation"]')?.value.trim();
        if (lastEmpty && secondLastEmpty) {
            last.remove();
            rows = Array.from(list.querySelectorAll('.sheet-motivation-row'));
        } else {
            break;
        }
    }

    rows = Array.from(list.querySelectorAll('.sheet-motivation-row'));
    if (rows.length === 0) {
        appendEmptyMotivationRow(list, 0);
        rows = Array.from(list.querySelectorAll('.sheet-motivation-row'));
    }

    const lastTextarea = rows[rows.length - 1]?.querySelector('[data-sheet-field="motivation"]');
    if (lastTextarea?.value.trim() && rows.length < MAX_SHEET_MOTIVATIONS) {
        appendEmptyMotivationRow(list, rows.length);
    }

    reindexMotivationRows(list);
    resizeAllMotivationTextareas();
}

function attachMotivationDynamicRows() {
    const list = document.querySelector('.sheet-motivations-list');
    if (!list) {
        return;
    }

    list.addEventListener('input', (event) => {
        const textarea = event.target.closest('[data-sheet-field="motivation"]');
        if (!textarea) {
            return;
        }
        syncMotivationRows(list);
        resizeMotivationTextarea(textarea);
    });

    resizeAllMotivationTextareas();
}

function createItemRowInput(index) {
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'sheet-edit-input sheet-edit-input-item';
    newInput.setAttribute('data-sheet-field', 'item');
    newInput.setAttribute('data-item-index', String(index));
    newInput.autocomplete = 'off';
    newInput.placeholder = t('sheet_item_placeholder');
    newInput.setAttribute('aria-label', t('sheet_item_aria_label', { number: index + 1 }));
    return newInput;
}

function appendEmptyItemRow(list, index) {
    const li = document.createElement('li');
    li.className = 'sheet-item-row';
    li.appendChild(createItemRowInput(index));
    list.appendChild(li);
}

function reindexItemRows(list) {
    list.querySelectorAll('.sheet-item-row').forEach((row, index) => {
        const input = row.querySelector('[data-sheet-field="item"]');
        if (!input) {
            return;
        }
        input.setAttribute('data-item-index', String(index));
        input.setAttribute('aria-label', t('sheet_item_aria_label', { number: index + 1 }));
    });
}

function syncItemRows(list) {
    let rows = Array.from(list.querySelectorAll('.sheet-item-row'));

    for (let i = rows.length - 2; i >= 0; i--) {
        const input = rows[i].querySelector('[data-sheet-field="item"]');
        if (!input?.value.trim()) {
            rows[i].remove();
        }
    }

    rows = Array.from(list.querySelectorAll('.sheet-item-row'));
    while (rows.length > 1) {
        const last = rows[rows.length - 1];
        const secondLast = rows[rows.length - 2];
        const lastEmpty = !last.querySelector('[data-sheet-field="item"]')?.value.trim();
        const secondLastEmpty = !secondLast.querySelector('[data-sheet-field="item"]')?.value.trim();
        if (lastEmpty && secondLastEmpty) {
            last.remove();
            rows = Array.from(list.querySelectorAll('.sheet-item-row'));
        } else {
            break;
        }
    }

    rows = Array.from(list.querySelectorAll('.sheet-item-row'));
    if (rows.length === 0) {
        appendEmptyItemRow(list, 0);
        rows = Array.from(list.querySelectorAll('.sheet-item-row'));
    }

    const lastInput = rows[rows.length - 1]?.querySelector('[data-sheet-field="item"]');
    if (lastInput?.value.trim() && rows.length < MAX_SHEET_ITEMS) {
        appendEmptyItemRow(list, rows.length);
    }

    reindexItemRows(list);
}

function attachItemsDynamicRows() {
    const list = document.querySelector('.sheet-items-list');
    if (!list) {
        return;
    }

    list.addEventListener('input', (event) => {
        const input = event.target.closest('[data-sheet-field="item"]');
        if (!input) {
            return;
        }
        syncItemRows(list);
    });
}

export function attachSheetEditListeners() {
    STAT_KEYS.forEach((key) => {
        const statInput = document.querySelector(`[data-sheet-field="stat-${key}"]`);
        const x5Cell = document.querySelector(`[data-sheet-x5="${key}"]`);
        if (!statInput || !x5Cell) {
            return;
        }
        const updateX5 = () => {
            const clamped = clampStat(statInput.value);
            x5Cell.textContent = clamped != null ? `${clamped * 5}%` : '—';
        };
        statInput.addEventListener('input', updateX5);
        statInput.addEventListener('change', () => {
            updateX5();
            refreshDerivedMaximums();
            if (key === 'CHA') {
                refreshBondScoreMaxes();
            }
        });
    });
    attachMotivationDynamicRows();
    attachItemsDynamicRows();
}

function refreshDerivedMaximums() {
    collectSheetEditsFromDOM();
    const character = getCharacter();
    const map = {
        HP: character.derivedAttributes?.HP,
        WP: character.derivedAttributes?.WP,
        SAN: character.derivedAttributes?.SAN,
        BP: character.derivedAttributes?.BP
    };
    Object.entries(map).forEach(([key, value]) => {
        const maxCell = document.querySelector(`[data-sheet-derived-max="${key}"]`);
        if (maxCell) {
            maxCell.textContent = value ?? 0;
        }
    });
}

function refreshBondScoreMaxes() {
    const chaInput = document.querySelector('[data-sheet-field="stat-CHA"]');
    document.querySelectorAll('[data-sheet-field="bond-score"]').forEach((input) => {
        input.max = String(getBondScoreMax(chaInput?.value, input.value));
    });
}
