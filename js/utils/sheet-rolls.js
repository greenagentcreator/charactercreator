// Click-to-roll on saved agent sheets (stats, derived attributes, skills)

import { rollD100, classifyRollResult, isSnakeEyes } from './dice-roll.js?v=3af973b';
import { showRollBubble, setRollStamp, dismissRollResult } from '../components/roll-bubble.js?v=3af973b';
import { syncSkillFailMark } from './sheet-edit.js?v=3af973b';
import { queueSheetAutoSave } from './sheet-autosave.js?v=3af973b';

let rollBusy = false;
let boundSummary = null;
let clickHandler = null;
let keydownHandler = null;

function getRollTarget(el) {
    return el?.closest?.('.sheet-roll-target');
}

function parseStatTarget(key) {
    const input = document.querySelector(`[data-sheet-field="stat-${key}"]`);
    if (!input) {
        return null;
    }
    const stat = parseInt(input.value, 10);
    if (!Number.isFinite(stat) || stat <= 0) {
        return null;
    }
    return stat * 5;
}

function parseDerivedTarget(key) {
    const input = document.querySelector(`[data-sheet-field="derived-current-${key}"]`);
    if (!input) {
        return null;
    }
    const value = parseInt(input.value, 10);
    return Number.isFinite(value) ? value : null;
}

function parseSkillTarget(targetEl) {
    const instanceId = targetEl.dataset.instanceId;
    if (instanceId) {
        const input = document.querySelector(
            `[data-sheet-field="skill-value"][data-instance-id="${instanceId}"]`
        );
        if (input) {
            const value = parseInt(input.value, 10);
            return Number.isFinite(value) ? value : null;
        }
    }
    const fallback = parseInt(targetEl.dataset.rollValue, 10);
    return Number.isFinite(fallback) ? fallback : null;
}

function resolveTargetValue(targetEl) {
    const type = targetEl.dataset.rollType;
    switch (type) {
        case 'stat':
            return parseStatTarget(targetEl.dataset.statKey);
        case 'derived':
            return parseDerivedTarget(targetEl.dataset.derivedKey);
        case 'skill':
            return parseSkillTarget(targetEl);
        default:
            return null;
    }
}

function markSkillFailure(targetEl) {
    const instanceId = targetEl.dataset.instanceId;
    if (!instanceId) {
        return;
    }
    const row = targetEl.closest('.sheet-skill-row');
    const checkbox = row?.querySelector('.skill-fail-marker');
    if (checkbox) {
        checkbox.checked = true;
    }
    syncSkillFailMark(instanceId, true);
    queueSheetAutoSave();
}

async function performRoll(targetEl) {
    if (rollBusy) {
        return;
    }

    const target = resolveTargetValue(targetEl);
    if (target == null) {
        return;
    }

    rollBusy = true;
    targetEl.classList.add('sheet-roll-target--rolling');

    const { tensDigit, onesDigit, total } = rollD100();
    const outcome = classifyRollResult(total, target, tensDigit, onesDigit);
    const snakeEyes = isSnakeEyes(tensDigit, onesDigit);
    const label = targetEl.textContent.replace(/:$/, '').trim();

    try {
        const stillActive = await showRollBubble(targetEl, {
            tensDigit,
            onesDigit,
            total,
            snakeEyes,
            label,
            ...outcome
        });
        if (stillActive) {
            setRollStamp(targetEl, outcome);
            if (!outcome.success && targetEl.dataset.rollType === 'skill') {
                markSkillFailure(targetEl);
            }
        }
    } finally {
        targetEl.classList.remove('sheet-roll-target--rolling');
        rollBusy = false;
    }
}

function onSummaryClick(event) {
    if (event.target.closest('.skill-fail-marker')) {
        return;
    }
    const targetEl = getRollTarget(event.target);
    if (!targetEl) {
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    performRoll(targetEl);
}

function onSummaryKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') {
        return;
    }
    const targetEl = getRollTarget(event.target);
    if (!targetEl) {
        return;
    }
    event.preventDefault();
    performRoll(targetEl);
}

export function attachSheetRollListeners() {
    const summary = document.getElementById('step5-summary');
    if (!summary?.classList.contains('sheet-summary-editable')) {
        detachSheetRollListeners();
        return;
    }

    if (boundSummary === summary && clickHandler) {
        return;
    }

    detachSheetRollListeners();

    clickHandler = onSummaryClick;
    keydownHandler = onSummaryKeydown;
    boundSummary = summary;
    summary.addEventListener('click', clickHandler);
    summary.addEventListener('keydown', keydownHandler);
}

export function detachSheetRollListeners() {
    if (boundSummary && clickHandler) {
        boundSummary.removeEventListener('click', clickHandler);
        boundSummary.removeEventListener('keydown', keydownHandler);
    }
    boundSummary = null;
    clickHandler = null;
    keydownHandler = null;
    rollBusy = false;
    dismissRollResult();
}
