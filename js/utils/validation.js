// Validation utility functions

const SECTION_ATTENTION_CLASS = 'section-needs-attention';
const CHOICE_GROUP_ATTENTION_CLASS = 'choice-group-needs-attention';
const FIELD_ERROR_CLASS = 'field-error';

const highlightedSections = new Set();
const highlightedChoiceGroups = new Set();
const highlightedFields = new Set();

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

/**
 * Resolve a section heading element by id (data-validation-section) or element reference
 * @param {string|HTMLElement} sectionRef
 * @returns {HTMLElement|null}
 */
function resolveSectionHeading(sectionRef) {
    if (!sectionRef) return null;

    if (sectionRef instanceof HTMLElement) {
        if (sectionRef.matches('h2, h3, h4, label[data-validation-section]')) return sectionRef;
        const nested = sectionRef.querySelector('[data-validation-section]');
        if (nested) return nested;
        return sectionRef;
    }

    const bySection = document.querySelector(`[data-validation-section="${sectionRef}"]`);
    if (bySection) return bySection;

    return document.getElementById(sectionRef);
}

/**
 * Find the interactive target container for a section (radios, checkboxes, inputs)
 * @param {string|HTMLElement} sectionRef
 * @returns {HTMLElement|null}
 */
function resolveValidationTarget(sectionRef) {
    const sectionId = typeof sectionRef === 'string'
        ? sectionRef
        : sectionRef?.getAttribute?.('data-validation-section')
            || sectionRef?.closest?.('[data-validation-section]')?.getAttribute('data-validation-section');

    if (!sectionId) return null;

    const byTarget = document.querySelector(`[data-validation-target="${sectionId}"]`);
    if (byTarget) return byTarget;

    const heading = resolveSectionHeading(sectionId);
    if (!heading) return null;

    let sibling = heading.nextElementSibling;
    while (sibling) {
        if (sibling.matches('[data-validation-target], .validation-choice-group, select, input, textarea, #stat-method-selection, #stat-array-selection, #bonds-input-container, #hard-experience-skills-container, #custom-profession-skill-list, #profession-details-container')) {
            return sibling;
        }
        if (sibling.querySelector('input, select, textarea, .validation-choice-group')) {
            return sibling;
        }
        if (sibling.matches('h2, h3, h4') && sibling.hasAttribute('data-validation-section')) {
            break;
        }
        sibling = sibling.nextElementSibling;
    }

    return heading.parentElement?.querySelector(`[data-validation-target="${sectionId}"]`) || null;
}

/**
 * Scroll an element so its vertical center aligns with the visible viewport center.
 * Accounts for the fixed bottom navigation bar.
 * @param {HTMLElement} element
 */
function scrollElementToViewportCenter(element) {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const nav = document.getElementById('navigation-container');
    const navVisible = nav && nav.style.display !== 'none' && nav.offsetParent !== null;
    const navHeight = navVisible ? nav.getBoundingClientRect().height : 0;
    const viewportCenterY = (window.innerHeight - navHeight) / 2;
    const elementCenterY = rect.top + rect.height / 2;
    const targetScrollTop = window.scrollY + elementCenterY - viewportCenterY;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    window.scrollTo({
        top: Math.min(Math.max(0, targetScrollTop), maxScroll),
        behavior: 'smooth',
    });
}

/**
 * Announce validation feedback to screen readers (no visible message)
 * @param {string} message
 */
function announceValidation(message) {
    if (!message) return;

    let announcer = document.getElementById('validation-announcer');
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'validation-announcer';
        announcer.className = 'sr-only';
        announcer.setAttribute('aria-live', 'assertive');
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);
    }

    announcer.textContent = '';
    requestAnimationFrame(() => {
        announcer.textContent = message;
    });
}

/**
 * Clear all section highlight styling
 */
export function clearSectionHighlights() {
    highlightedSections.forEach((heading) => {
        heading.classList.remove(SECTION_ATTENTION_CLASS);
        heading.removeAttribute('aria-invalid');
    });
    highlightedSections.clear();

    highlightedChoiceGroups.forEach((group) => {
        group.classList.remove(CHOICE_GROUP_ATTENTION_CLASS);
        group.removeAttribute('aria-invalid');
    });
    highlightedChoiceGroups.clear();
}

/**
 * Clear field highlight state
 */
function clearFieldHighlights() {
    highlightedFields.forEach((field) => {
        field.removeAttribute('aria-invalid');
        field.classList.remove(FIELD_ERROR_CLASS);
    });
    highlightedFields.clear();

    const stepContainer = document.getElementById('step-content-container');
    if (stepContainer) {
        stepContainer.querySelectorAll(`.${FIELD_ERROR_CLASS}`).forEach((field) => {
            if (!highlightedFields.has(field)) {
                field.removeAttribute('aria-invalid');
                field.classList.remove(FIELD_ERROR_CLASS);
            }
        });
    }
}

/**
 * Highlight a choice / multi-select group container
 * @param {HTMLElement} groupElement
 */
function highlightChoiceGroup(groupElement) {
    if (!groupElement) return;
    groupElement.classList.add(CHOICE_GROUP_ATTENTION_CLASS);
    groupElement.setAttribute('aria-invalid', 'true');
    highlightedChoiceGroups.add(groupElement);
}

/**
 * Apply field-level highlight and register for cleanup
 * @param {HTMLElement} fieldElement
 */
function highlightField(fieldElement) {
    if (!fieldElement) return;
    fieldElement.setAttribute('aria-invalid', 'true');
    fieldElement.classList.add(FIELD_ERROR_CLASS);
    highlightedFields.add(fieldElement);
}

/**
 * Core validation feedback: red section headline, optional choice group + field, scroll to focus target
 * @param {Object} options
 * @param {string} [options.message] - Screen reader message
 * @param {string|HTMLElement} [options.sectionRef]
 * @param {HTMLElement|string} [options.field]
 * @param {HTMLElement} [options.choiceGroup]
 * @param {HTMLElement} [options.scrollTarget]
 */
function reportValidationIssue({ message = '', sectionRef = null, field = null, choiceGroup = null, scrollTarget = null }) {
    clearErrors();

    const fieldElement = field
        ? (typeof field === 'string' ? document.getElementById(field) : field)
        : null;

    const resolvedSection = sectionRef
        || (fieldElement?.closest('[data-validation-section]')?.getAttribute('data-validation-section'))
        || null;

    const heading = resolveSectionHeading(resolvedSection);
    if (heading) {
        heading.classList.add(SECTION_ATTENTION_CLASS);
        heading.setAttribute('aria-invalid', 'true');
        highlightedSections.add(heading);
    }

    const choiceGroupElement = choiceGroup
        || fieldElement?.closest('.validation-choice-group, [data-validation-choice-group]')
        || resolveValidationTarget(resolvedSection);

    // Highlight choice group even when it shares the same node as the section marker
    if (choiceGroupElement) {
        highlightChoiceGroup(choiceGroupElement);
    }

    if (fieldElement) {
        highlightField(fieldElement);
    }

    if (message) {
        announceValidation(message);
    }

    const scrollElement = scrollTarget
        || fieldElement
        || choiceGroupElement
        || resolveValidationTarget(resolvedSection)
        || heading;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (scrollElement) {
                scrollElementToViewportCenter(scrollElement);
            }
            if (fieldElement && typeof fieldElement.focus === 'function') {
                try {
                    fieldElement.focus({ preventScroll: true });
                } catch {
                    fieldElement.focus();
                }
            }
        });
    });
}

/**
 * Prepare validation state when rendering a new step
 */
export function initErrorContainer() {
    clearErrors();
}

/**
 * Draw attention to a section (no visible error banner)
 * @param {string} a11yMessage
 * @param {string} [_type]
 * @param {string|HTMLElement} [sectionRef]
 * @param {HTMLElement} [choiceGroup]
 */
export function showInlineError(a11yMessage, _type = 'error', sectionRef = null, choiceGroup = null) {
    reportValidationIssue({
        message: a11yMessage,
        sectionRef,
        choiceGroup: choiceGroup instanceof HTMLElement ? choiceGroup : null,
    });
}

/**
 * Draw attention to a field and its section (no visible error text)
 * @param {HTMLElement|string} field
 * @param {string} a11yMessage
 * @param {string|HTMLElement} [sectionRef]
 */
export function showFieldError(field, a11yMessage, sectionRef = null) {
    reportValidationIssue({
        message: a11yMessage,
        sectionRef,
        field,
    });
}

/**
 * Clear all validation highlights and field states
 */
export function clearErrors() {
    clearSectionHighlights();
    clearFieldHighlights();

    const stepContainer = document.getElementById('step-content-container');
    if (stepContainer) {
        const legacyContainer = stepContainer.querySelector('#error-container');
        if (legacyContainer) legacyContainer.remove();
    }

    const announcer = document.getElementById('validation-announcer');
    if (announcer) announcer.textContent = '';
}

/**
 * Clear error state for a specific field and its section highlight if applicable
 * @param {HTMLElement|string} field
 */
export function clearFieldError(field) {
    const fieldElement = typeof field === 'string' ? document.getElementById(field) : field;
    if (!fieldElement) return;

    fieldElement.removeAttribute('aria-invalid');
    fieldElement.classList.remove(FIELD_ERROR_CLASS);
    highlightedFields.delete(fieldElement);

    const sectionId = fieldElement.closest('[data-validation-section]')?.getAttribute('data-validation-section')
        || fieldElement.closest('[data-validation-target]')?.getAttribute('data-validation-target');
    if (sectionId) {
        const heading = document.querySelector(`[data-validation-section="${sectionId}"]`);
        if (heading && highlightedSections.has(heading)) {
            heading.classList.remove(SECTION_ATTENTION_CLASS);
            heading.removeAttribute('aria-invalid');
            highlightedSections.delete(heading);
        }
        const target = document.querySelector(`[data-validation-target="${sectionId}"]`);
        if (target && highlightedChoiceGroups.has(target)) {
            target.classList.remove(CHOICE_GROUP_ATTENTION_CLASS);
            target.removeAttribute('aria-invalid');
            highlightedChoiceGroups.delete(target);
        }
    }

    const choiceGroup = fieldElement.closest('.validation-choice-group, [data-validation-choice-group]');
    if (choiceGroup && highlightedChoiceGroups.has(choiceGroup)) {
        const hasInvalidField = choiceGroup.querySelector(`.${FIELD_ERROR_CLASS}, [aria-invalid="true"]`);
        if (!hasInvalidField) {
            choiceGroup.classList.remove(CHOICE_GROUP_ATTENTION_CLASS);
            choiceGroup.removeAttribute('aria-invalid');
            highlightedChoiceGroups.delete(choiceGroup);
        }
    }
}

/**
 * Check if any validation highlight is active
 * @returns {boolean}
 */
export function hasErrors() {
    return highlightedSections.size > 0 || highlightedChoiceGroups.size > 0 || highlightedFields.size > 0;
}

/**
 * Setup real-time validation for a form field
 * @param {HTMLElement|string} field
 * @param {Function} [validator]
 */
export function setupRealtimeValidation(field, validator = null) {
    const fieldElement = typeof field === 'string' ? document.getElementById(field) : field;
    if (!fieldElement) return;

    const clearErrorHandler = () => {
        if (fieldElement.classList.contains(FIELD_ERROR_CLASS) || fieldElement.getAttribute('aria-invalid') === 'true') {
            if (validator) {
                if (validator(fieldElement.value)) {
                    clearFieldError(fieldElement);
                }
            } else if (fieldElement.value && fieldElement.value.trim() !== '') {
                clearFieldError(fieldElement);
            }
        }
    };

    fieldElement.addEventListener('input', clearErrorHandler);
    fieldElement.addEventListener('change', clearErrorHandler);
    fieldElement.addEventListener('blur', clearErrorHandler);
}

/**
 * Validate imported character data structure
 * @param {Object} characterData
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateImportedCharacter(characterData) {
    if (!characterData || typeof characterData !== 'object') {
        return { valid: false, error: 'Invalid character data format' };
    }

    const requiredFields = ['stats', 'skills'];
    for (const field of requiredFields) {
        if (!characterData[field]) {
            return { valid: false, error: `Missing required field: ${field}` };
        }
    }

    if (!characterData.stats || typeof characterData.stats !== 'object') {
        return { valid: false, error: 'Invalid stats structure' };
    }

    const statKeys = ['STR', 'CON', 'DEX', 'INT', 'POW', 'CHA'];
    for (const key of statKeys) {
        if (typeof characterData.stats[key] !== 'number') {
            return { valid: false, error: `Invalid stat value for ${key}` };
        }
    }

    if (!Array.isArray(characterData.skills)) {
        return { valid: false, error: 'Skills must be an array' };
    }

    return { valid: true, error: null };
}

// Re-export for modules that used highlightSection directly
export function highlightSection(sectionRef, a11yMessage = '') {
    reportValidationIssue({ message: a11yMessage, sectionRef });
}
