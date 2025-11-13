// DOM utility functions

/**
 * Safely get an element by ID
 */
export function getElementById(id) {
    return document.getElementById(id);
}

/**
 * Query selector with optional context
 */
export function querySelector(selector, context = document) {
    return context.querySelector(selector);
}

/**
 * Query selector all with optional context
 */
export function querySelectorAll(selector, context = document) {
    return context.querySelectorAll(selector);
}

/**
 * Create an element with optional attributes and children
 */
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'textContent') {
            element.textContent = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    return element;
}

/**
 * Remove all event listeners from an element (by cloning)
 */
export function removeAllListeners(element) {
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
    return newElement;
}

