// Slot-machine roll bubble shown above clicked sheet targets

import { t } from '../i18n/i18n.js?v=09f6897';

const ONES_SPIN_BASE_MS = 1100;
const TENS_SPIN_BASE_MS = 2400;
const SPIN_DURATION_FACTOR_MIN = 0.78;
const SPIN_DURATION_FACTOR_MAX = 1.32;
const ONES_SPIN_CYCLES_BASE = 28;
const TENS_SPIN_CYCLES_BASE = 42;
const DIGIT_HEIGHT_PX = 44;

let activeBubble = null;
let activeBubbleAnchorEl = null;
let activeStampHost = null;
let dismissGeneration = 0;
let documentDismissHandler = null;
let bubbleRepositionHandler = null;
let pendingRollResolve = null;
const activeAnimations = new Set();

function resolvePendingRoll(stillActive) {
    if (!pendingRollResolve) {
        return;
    }
    const resolve = pendingRollResolve;
    pendingRollResolve = null;
    resolve(stillActive);
}

function cancelActiveAnimations() {
    activeAnimations.forEach((animation) => {
        try {
            animation.cancel();
        } catch {
            // Animation may already be finished.
        }
    });
    activeAnimations.clear();
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function rollSpinDurationFactor() {
    return SPIN_DURATION_FACTOR_MIN + Math.random() * (SPIN_DURATION_FACTOR_MAX - SPIN_DURATION_FACTOR_MIN);
}

function scaleSpinDuration(baseMs, factor) {
    return Math.max(400, Math.round(baseMs * factor));
}

function scaleSpinCycles(baseCycles, factor) {
    return Math.max(12, Math.round(baseCycles * factor));
}

function unbindDocumentDismiss() {
    if (documentDismissHandler) {
        document.removeEventListener('click', documentDismissHandler, true);
        documentDismissHandler = null;
    }
}

function bindBubbleReposition() {
    if (bubbleRepositionHandler) {
        return;
    }

    bubbleRepositionHandler = () => {
        if (activeBubble && activeBubbleAnchorEl) {
            positionBubble(activeBubble, activeBubbleAnchorEl);
        }
    };
    window.addEventListener('resize', bubbleRepositionHandler, { passive: true });
}

function unbindBubbleReposition() {
    if (!bubbleRepositionHandler) {
        return;
    }
    window.removeEventListener('resize', bubbleRepositionHandler);
    bubbleRepositionHandler = null;
}

function bindDocumentDismiss() {
    if (documentDismissHandler) {
        return;
    }

    documentDismissHandler = (event) => {
        if (!activeBubble) {
            return;
        }
        if (activeBubble.contains(event.target)) {
            return;
        }
        if (event.target.closest('.sheet-roll-target')) {
            return;
        }
        dismissRollResult();
    };
    document.addEventListener('click', documentDismissHandler, true);
}

export function dismissRollResult() {
    dismissGeneration += 1;
    cancelActiveAnimations();
    resolvePendingRoll(false);
    unbindDocumentDismiss();
    unbindBubbleReposition();
    activeBubbleAnchorEl = null;

    removeRollStamp();

    const bubble = activeBubble;
    if (!bubble) {
        return;
    }

    activeBubble = null;
    bubble.classList.add('roll-bubble--leaving');
    window.setTimeout(() => {
        bubble.remove();
    }, 280);
}

function getRollStampHost(targetEl) {
    const skillLabel = targetEl.closest('.sheet-skill-label');
    if (skillLabel) {
        return skillLabel;
    }
    const skillRow = targetEl.closest('.sheet-skill-row');
    if (skillRow) {
        return skillRow;
    }
    const cell = targetEl.closest('td');
    if (cell) {
        return cell;
    }
    return targetEl;
}

function removeRollStamp() {
    if (!activeStampHost) {
        return;
    }
    activeStampHost.querySelector('.sheet-roll-stamp')?.remove();
    activeStampHost.classList.remove('sheet-roll-stamp-host');
    activeStampHost = null;
}

/**
 * @param {HTMLElement} targetEl
 * @param {{ success: boolean, criticalSuccess: boolean, criticalFailure: boolean }} outcome
 */
export function setRollStamp(targetEl, outcome) {
    removeRollStamp();

    let variant = outcome.success ? 'success' : 'failure';
    let labelKey = outcome.success ? 'roll_stamp_success' : 'roll_stamp_failure';

    if (outcome.criticalSuccess) {
        variant = 'critical-success';
        labelKey = 'roll_stamp_critical_success';
    } else if (outcome.criticalFailure) {
        variant = 'critical-failure';
        labelKey = 'roll_stamp_critical_failure';
    }

    const host = getRollStampHost(targetEl);
    activeStampHost = host;
    host.classList.add('sheet-roll-stamp-host');

    const stamp = document.createElement('span');
    stamp.className = `sheet-roll-stamp sheet-roll-stamp--${variant}`;
    stamp.textContent = t(labelKey);
    stamp.setAttribute('role', 'status');
    host.appendChild(stamp);
}

function resolveAriaResultKey(outcome) {
    if (outcome.criticalFailure) {
        return 'roll_result_critical_failure';
    }
    if (outcome.criticalSuccess) {
        return 'roll_result_critical_success';
    }
    return outcome.success ? 'roll_result_success' : 'roll_result_failure';
}

function resolveBubbleHintKey(outcome, pasch, roll) {
    if (outcome.criticalFailure) {
        return pasch || roll === 100
            ? 'roll_bubble_critical_failure_pasch'
            : 'roll_bubble_critical_failure';
    }
    if (outcome.criticalSuccess) {
        return pasch && roll !== 1
            ? 'roll_bubble_critical_success_pasch'
            : 'roll_bubble_critical_success';
    }
    return null;
}

function createReel() {
    const reel = document.createElement('div');
    reel.className = 'roll-reel';

    const frame = document.createElement('div');
    frame.className = 'roll-reel-frame';

    const windowEl = document.createElement('div');
    windowEl.className = 'roll-reel-window';

    const strip = document.createElement('div');
    strip.className = 'roll-reel-strip';

    windowEl.appendChild(strip);
    frame.appendChild(windowEl);
    reel.appendChild(frame);
    return { reel, strip };
}

function buildDigitStrip(finalDigit, cycleCount) {
    const digits = [];
    for (let i = 0; i < cycleCount; i += 1) {
        digits.push(Math.floor(Math.random() * 10));
    }
    digits.push(finalDigit);
    return digits;
}

function renderDigitStrip(strip, digits) {
    strip.innerHTML = '';
    digits.forEach((digit) => {
        const cell = document.createElement('div');
        cell.className = 'roll-reel-digit';
        cell.textContent = String(digit);
        strip.appendChild(cell);
    });
}

/**
 * @param {HTMLElement} strip
 * @param {HTMLElement} reelEl
 * @param {number} finalDigit
 * @param {number} durationMs
 * @param {number} [cycleCount]
 * @returns {Promise<void>}
 */
function spinReel(strip, reelEl, finalDigit, durationMs, cycleCount = 24) {
    return new Promise((resolve) => {
        const digits = buildDigitStrip(finalDigit, cycleCount);
        renderDigitStrip(strip, digits);

        const offset = (digits.length - 1) * DIGIT_HEIGHT_PX;
        strip.style.transform = 'translateY(0)';
        reelEl.classList.add('roll-reel--spinning');
        reelEl.classList.remove('roll-reel--locked');

        const finish = () => {
            strip.style.transform = `translateY(-${offset}px)`;
            reelEl.classList.remove('roll-reel--spinning');
            reelEl.classList.add('roll-reel--locked');
            resolve();
        };

        if (durationMs <= 0) {
            finish();
            return;
        }

        requestAnimationFrame(() => {
            const animation = strip.animate(
                [
                    { transform: 'translateY(0)', filter: 'blur(0px)' },
                    { transform: `translateY(-${Math.round(offset * 0.52)}px)`, filter: 'blur(1.1px)', offset: 0.32 },
                    { transform: `translateY(-${Math.round(offset * 0.78)}px)`, filter: 'blur(0.6px)', offset: 0.55 },
                    { transform: `translateY(-${Math.round(offset * 0.91)}px)`, filter: 'blur(0.2px)', offset: 0.72 },
                    { transform: `translateY(-${Math.round(offset * 0.965)}px)`, filter: 'blur(0px)', offset: 0.86 },
                    { transform: `translateY(-${Math.round(offset * 0.992)}px)`, filter: 'blur(0px)', offset: 0.94 },
                    { transform: `translateY(-${offset}px)`, filter: 'blur(0px)', offset: 1 }
                ],
                {
                    duration: durationMs,
                    easing: 'linear',
                    fill: 'forwards'
                }
            );

            activeAnimations.add(animation);
            animation.onfinish = () => {
                activeAnimations.delete(animation);
                finish();
            };
            animation.oncancel = () => {
                activeAnimations.delete(animation);
                reelEl.classList.remove('roll-reel--spinning');
                resolve();
            };
        });
    });
}

function positionBubble(bubble, anchorEl) {
    const anchorRect = anchorEl.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    const bubbleRect = bubble.getBoundingClientRect();

    let left = anchorRect.left - bodyRect.left + anchorRect.width / 2;
    let top = anchorRect.top - bodyRect.top - 12;

    const margin = 8;
    const halfWidth = bubbleRect.width / 2;
    const maxLeft = bodyRect.width - margin - halfWidth;
    left = Math.max(margin + halfWidth, Math.min(maxLeft, left));
    top = Math.max(margin + bubbleRect.height, top);

    bubble.style.left = `${left}px`;
    bubble.style.top = `${top}px`;
}

/**
 * @param {HTMLElement} anchorEl
 * @param {{
 *   tensDigit: number,
 *   onesDigit: number,
 *   total: number,
 *   success: boolean,
 *   criticalSuccess: boolean,
 *   criticalFailure: boolean,
 *   snakeEyes?: boolean,
 *   label?: string
 * }} options
 * @returns {Promise<boolean>} false if dismissed before spin finished
 */
export function showRollBubble(anchorEl, {
    tensDigit,
    onesDigit,
    total,
    success,
    criticalSuccess,
    criticalFailure,
    snakeEyes = false,
    label = ''
}) {
    dismissRollResult();

    const generation = dismissGeneration;

    return new Promise((resolve) => {
        pendingRollResolve = resolve;

        const bubble = document.createElement('div');
        bubble.className = 'roll-bubble roll-bubble--pending';
        bubble.style.setProperty('--roll-digit-h', `${DIGIT_HEIGHT_PX}px`);
        bubble.setAttribute('role', 'status');
        bubble.setAttribute('aria-live', 'polite');
        bubble.setAttribute('aria-atomic', 'true');

        const rollDisplay = total === 100 ? '100' : String(total).padStart(2, '0');
        const outcome = { success, criticalSuccess, criticalFailure };

        const revealOutcome = () => {
            bubble.classList.remove('roll-bubble--pending');
            bubble.classList.add(success ? 'roll-bubble--success' : 'roll-bubble--failure');
            if (snakeEyes) {
                bubble.classList.add('roll-bubble--snake-eyes');
            }
            if (criticalFailure) {
                bubble.classList.add('roll-bubble--critical-failure');
            }
            if (criticalSuccess) {
                bubble.classList.add('roll-bubble--critical-success');
            }

            bubble.setAttribute(
                'aria-label',
                t(resolveAriaResultKey(outcome), { label, roll: rollDisplay })
            );

            const hintKey = resolveBubbleHintKey(outcome, snakeEyes, total);
            if (hintKey) {
                const hint = document.createElement('p');
                hint.className = 'roll-bubble-outcome-hint';
                hint.textContent = t(hintKey);
                machine.appendChild(hint);
            }
        };

        bubble.setAttribute('aria-label', t('roll_bubble_rolling', { label }));

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'roll-bubble-close';
        closeBtn.setAttribute('aria-label', t('roll_bubble_close'));
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            dismissRollResult();
        });

        const tail = document.createElement('div');
        tail.className = 'roll-bubble-tail';
        tail.setAttribute('aria-hidden', 'true');

        const machine = document.createElement('div');
        machine.className = 'roll-slot-machine';

        const cabinetTop = document.createElement('div');
        cabinetTop.className = 'roll-slot-cabinet-top';
        cabinetTop.setAttribute('aria-hidden', 'true');

        const reelsRow = document.createElement('div');
        reelsRow.className = 'roll-slot-reels';

        const tensReel = createReel();
        const onesReel = createReel();

        reelsRow.appendChild(tensReel.reel);
        reelsRow.appendChild(onesReel.reel);

        machine.appendChild(cabinetTop);
        machine.appendChild(reelsRow);

        bubble.appendChild(closeBtn);
        bubble.appendChild(machine);
        bubble.appendChild(tail);

        document.body.appendChild(bubble);
        activeBubble = bubble;
        activeBubbleAnchorEl = anchorEl;
        bindDocumentDismiss();
        bindBubbleReposition();

        requestAnimationFrame(() => {
            positionBubble(bubble, anchorEl);
            bubble.classList.add('roll-bubble--visible');
            machine.classList.add('roll-slot-machine--active');
        });

        const reduced = prefersReducedMotion();
        const durationFactor = reduced ? 1 : rollSpinDurationFactor();
        const onesDuration = reduced ? 0 : scaleSpinDuration(ONES_SPIN_BASE_MS, durationFactor);
        const tensDuration = reduced ? 0 : scaleSpinDuration(TENS_SPIN_BASE_MS, durationFactor);
        const onesCycles = reduced ? 1 : scaleSpinCycles(ONES_SPIN_CYCLES_BASE, durationFactor);
        const tensCycles = reduced ? 1 : scaleSpinCycles(TENS_SPIN_CYCLES_BASE, durationFactor);

        const onesSpin = spinReel(
            onesReel.strip,
            onesReel.reel,
            onesDigit,
            onesDuration,
            onesCycles
        ).then(() => {
            if (activeBubble === bubble) {
                machine.classList.add('roll-slot-machine--ones-locked');
            }
        });

        const tensSpin = spinReel(
            tensReel.strip,
            tensReel.reel,
            tensDigit,
            tensDuration,
            tensCycles
        );

        Promise.all([onesSpin, tensSpin]).then(() => {
            if (!pendingRollResolve) {
                return;
            }
            if (activeBubble === bubble) {
                machine.classList.add('roll-slot-machine--complete');
                revealOutcome();
            }
            resolvePendingRoll(generation === dismissGeneration && activeBubble === bubble);
        });
    });
}
