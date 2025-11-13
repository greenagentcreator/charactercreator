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

// Error message system for inline error display

let errorContainer = null;
const fieldErrors = new Map();

/**
 * Initialize error container for a step
 * Should be called when rendering a new step
 */
export function initErrorContainer(containerId = 'error-container') {
    const stepContainer = document.getElementById('step-content-container');
    if (!stepContainer) return;
    
    // Remove existing error container if present
    const existing = stepContainer.querySelector(`#${containerId}`);
    if (existing) {
        existing.remove();
    }
    
    // Create new error container at the top of the step
    errorContainer = document.createElement('div');
    errorContainer.id = containerId;
    errorContainer.className = 'error-container';
    errorContainer.setAttribute('role', 'alert');
    errorContainer.setAttribute('aria-live', 'polite');
    errorContainer.setAttribute('aria-atomic', 'true');
    
    // Insert at the beginning of step content
    const firstChild = stepContainer.firstElementChild;
    if (firstChild) {
        stepContainer.insertBefore(errorContainer, firstChild);
    } else {
        stepContainer.appendChild(errorContainer);
    }
    
    // Clear field errors
    fieldErrors.clear();
}

/**
 * Show an inline error message at the top of the step
 * @param {string} message - Error message to display
 * @param {string} type - Error type: 'error', 'warning', 'info' (default: 'error')
 */
export function showInlineError(message, type = 'error') {
    if (!errorContainer) {
        initErrorContainer();
    }
    
    if (!errorContainer) return;
    
    // Clear existing errors
    errorContainer.innerHTML = '';
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = `alert alert-${type === 'error' ? 'classified' : type}`;
    errorElement.setAttribute('role', 'alert');
    errorElement.textContent = message;
    
    errorContainer.appendChild(errorElement);
    
    // Scroll to error if needed
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Announce to screen readers
    errorContainer.setAttribute('aria-live', 'assertive');
    setTimeout(() => {
        if (errorContainer) {
            errorContainer.setAttribute('aria-live', 'polite');
        }
    }, 1000);
}

/**
 * Show an error message associated with a specific form field
 * @param {HTMLElement|string} field - The form field element or its ID
 * @param {string} message - Error message to display
 */
export function showFieldError(field, message) {
    const fieldElement = typeof field === 'string' ? document.getElementById(field) : field;
    if (!fieldElement) return;
    
    // Store error for this field
    fieldErrors.set(fieldElement, message);
    
    // Mark field as invalid
    fieldElement.setAttribute('aria-invalid', 'true');
    fieldElement.classList.add('field-error');
    
    // Remove existing error message for this field
    const existingError = fieldElement.parentElement?.querySelector(`.field-error-message[data-field-id="${fieldElement.id}"]`);
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error-message alert alert-classified';
    errorElement.setAttribute('role', 'alert');
    errorElement.setAttribute('data-field-id', fieldElement.id || `field-${Date.now()}`);
    errorElement.textContent = message;
    
    // Insert after the field
    fieldElement.parentElement?.insertBefore(errorElement, fieldElement.nextSibling);
    
    // Scroll to field if needed
    fieldElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Clear all errors (both container and field errors)
 */
export function clearErrors() {
    // Clear error container
    if (errorContainer) {
        errorContainer.innerHTML = '';
    }
    
    // Clear field errors
    fieldErrors.forEach((message, field) => {
        if (field && field.parentElement) {
            field.removeAttribute('aria-invalid');
            field.classList.remove('field-error');
            const errorElement = field.parentElement.querySelector(`.field-error-message[data-field-id="${field.id}"]`);
            if (errorElement) {
                errorElement.remove();
            }
        }
    });
    
    fieldErrors.clear();
}

/**
 * Clear error for a specific field
 * @param {HTMLElement|string} field - The form field element or its ID
 */
export function clearFieldError(field) {
    const fieldElement = typeof field === 'string' ? document.getElementById(field) : field;
    if (!fieldElement) return;
    
    fieldErrors.delete(fieldElement);
    fieldElement.removeAttribute('aria-invalid');
    fieldElement.classList.remove('field-error');
    
    const errorElement = fieldElement.parentElement?.querySelector(`.field-error-message[data-field-id="${fieldElement.id}"]`);
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Check if there are any active errors
 * @returns {boolean}
 */
export function hasErrors() {
    return fieldErrors.size > 0 || (errorContainer && errorContainer.children.length > 0);
}

/**
 * Setup real-time validation for a form field
 * Clears error when field value changes
 * @param {HTMLElement|string} field - The form field element or its ID
 * @param {Function} validator - Optional validator function that returns true if valid
 */
export function setupRealtimeValidation(field, validator = null) {
    const fieldElement = typeof field === 'string' ? document.getElementById(field) : field;
    if (!fieldElement) return;
    
    // Clear error on input/change
    const clearErrorHandler = () => {
        if (fieldErrors.has(fieldElement)) {
            // If validator provided, check if field is now valid
            if (validator) {
                const isValid = validator(fieldElement.value);
                if (isValid) {
                    clearFieldError(fieldElement);
                }
            } else {
                // Just clear if field has value
                if (fieldElement.value && fieldElement.value.trim() !== '') {
                    clearFieldError(fieldElement);
                }
            }
        }
    };
    
    fieldElement.addEventListener('input', clearErrorHandler);
    fieldElement.addEventListener('change', clearErrorHandler);
    fieldElement.addEventListener('blur', clearErrorHandler);
}

/**
 * Validate imported character data structure
 * @param {Object} characterData - Character data to validate
 * @returns {Object} { valid: boolean, error: string }
 */
export function validateImportedCharacter(characterData) {
    if (!characterData || typeof characterData !== 'object') {
        return { valid: false, error: 'Invalid character data format' };
    }
    
    // Check for required fields (at minimum, should have basic structure)
    const requiredFields = ['stats', 'skills'];
    for (const field of requiredFields) {
        if (!characterData[field]) {
            return { valid: false, error: `Missing required field: ${field}` };
        }
    }
    
    // Validate stats structure
    if (!characterData.stats || typeof characterData.stats !== 'object') {
        return { valid: false, error: 'Invalid stats structure' };
    }
    
    const statKeys = ['STR', 'CON', 'DEX', 'INT', 'POW', 'CHA'];
    for (const key of statKeys) {
        if (typeof characterData.stats[key] !== 'number') {
            return { valid: false, error: `Invalid stat value for ${key}` };
        }
    }
    
    // Validate skills is an array
    if (!Array.isArray(characterData.skills)) {
        return { valid: false, error: 'Skills must be an array' };
    }
    
    return { valid: true, error: null };
}

