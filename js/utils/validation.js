// Validation utility functions

/**
 * Validate that a value is within a range
 */
export function validateRange(value, min, max) {
    const num = parseInt(value);
    if (isNaN(num)) return false;
    return num >= min && num <= max;
}

/**
 * Validate that a string is not empty
 */
export function validateNotEmpty(value) {
    return value && typeof value === 'string' && value.trim() !== '';
}

/**
 * Validate that an array has a specific length
 */
export function validateArrayLength(array, expectedLength) {
    return Array.isArray(array) && array.length === expectedLength;
}

/**
 * Validate that all values in an array are unique
 */
export function validateUniqueValues(array) {
    return array.length === new Set(array).size;
}

