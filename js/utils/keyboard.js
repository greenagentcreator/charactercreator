// Keyboard navigation utilities

import { clearErrors } from './validation.js';

/**
 * Initialize keyboard navigation for the application
 * Handles arrow keys for step navigation, Enter to proceed, Escape to clear errors
 */
export function initKeyboardNavigation() {
    document.addEventListener('keydown', handleKeyboardNavigation);
}

/**
 * Handle keyboard navigation events
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyboardNavigation(event) {
    // Don't interfere if user is typing in an input, textarea, or contenteditable
    const activeElement = document.activeElement;
    const isTyping = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable ||
        activeElement.getAttribute('contenteditable') === 'true'
    );
    
    // Allow Escape to clear errors even when typing
    if (event.key === 'Escape') {
        clearErrors();
        return;
    }
    
    // Don't handle other shortcuts when typing
    if (isTyping) {
        return;
    }
    
    // Handle navigation shortcuts
    switch (event.key) {
        case 'ArrowLeft':
            event.preventDefault();
            navigateToPreviousStep();
            break;
        case 'ArrowRight':
            event.preventDefault();
            navigateToNextStep();
            break;
        case 'Enter':
            // Only handle Enter if focus is on a button or step indicator
            if (activeElement && (
                activeElement.tagName === 'BUTTON' ||
                activeElement.classList.contains('step-indicator')
            )) {
                // Let the button's click handler handle it
                return;
            }
            // Otherwise, try to proceed to next step
            if (activeElement && !activeElement.tagName === 'BUTTON') {
                event.preventDefault();
                navigateToNextStep();
            }
            break;
    }
}

/**
 * Navigate to the next step
 */
function navigateToNextStep() {
    const btnNext = document.getElementById('btn-next');
    if (btnNext && !btnNext.disabled) {
        btnNext.click();
    }
}

/**
 * Navigate to the previous step
 */
function navigateToPreviousStep() {
    const btnBack = document.getElementById('btn-back');
    if (btnBack && !btnBack.disabled) {
        btnBack.click();
    }
}

/**
 * Focus management: Focus the first focusable element in the current step
 */
export function focusFirstInput() {
    const stepContainer = document.getElementById('step-content-container');
    if (!stepContainer) return;
    
    // Find first focusable element
    const focusableSelectors = [
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    const firstFocusable = stepContainer.querySelector(focusableSelectors);
    if (firstFocusable) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            firstFocusable.focus();
        }, 100);
    }
}

/**
 * Focus management: Focus a specific element
 * @param {HTMLElement|string} element - Element to focus or its ID
 */
export function focusElement(element) {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (el) {
        setTimeout(() => {
            el.focus();
            // Scroll element into view if needed
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

