// Percentile (d100) roll helpers — Delta Green style (two d10s)

/**
 * Roll d100 using two d10s (tens 00–90, ones 0–9; 00+0 = 100).
 * @returns {{ tens: number, ones: number, total: number, tensDigit: number, onesDigit: number }}
 */
export function rollD100() {
    const tensDigit = Math.floor(Math.random() * 10);
    const onesDigit = Math.floor(Math.random() * 10);
    const tens = tensDigit * 10;
    const ones = onesDigit;
    const total = tens + ones === 0 ? 100 : tens + ones;
    return { tens, ones, total, tensDigit, onesDigit };
}

/**
 * Pasch (matching d10 digits): 11, 22, …, 99, and 100 as 00+0.
 * @param {number} tensDigit
 * @param {number} onesDigit
 * @returns {boolean}
 */
export function isSnakeEyes(tensDigit, onesDigit) {
    return tensDigit === onesDigit;
}

/** @alias isSnakeEyes */
export const isPasch = isSnakeEyes;

/**
 * @param {number} roll
 * @param {number} target
 * @returns {boolean}
 */
export function isRollSuccess(roll, target) {
    if (!Number.isFinite(roll) || !Number.isFinite(target)) {
        return false;
    }
    return roll <= target;
}

/**
 * Delta Green check outcome.
 * Critical success: 01, or any successful Pasch (doubles under the target).
 * Critical failure: 100, or any failed Pasch (doubles over the target).
 * @param {number} roll
 * @param {number} target
 * @param {number} tensDigit
 * @param {number} onesDigit
 * @returns {{ success: boolean, criticalSuccess: boolean, criticalFailure: boolean }}
 */
export function classifyRollResult(roll, target, tensDigit, onesDigit) {
    if (!Number.isFinite(roll) || !Number.isFinite(target) || target <= 0) {
        return { success: false, criticalSuccess: false, criticalFailure: false };
    }

    if (roll === 100) {
        return { success: false, criticalSuccess: false, criticalFailure: true };
    }

    const success = roll <= target;
    const pasch = isSnakeEyes(tensDigit, onesDigit);
    const criticalSuccess = success && (roll === 1 || pasch);
    const criticalFailure = !success && pasch;

    return { success, criticalSuccess, criticalFailure };
}
