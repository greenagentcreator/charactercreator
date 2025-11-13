// Main entry point for Delta Green Character Creator

import { initI18n, setLanguage, getCurrentLanguage } from './i18n/i18n.js';
import { initializeApp } from './app.js';

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize i18n first
    initI18n();
    
    // Initialize the app
    initializeApp();
    
    // Set the language (this will trigger initial translation)
    setLanguage(getCurrentLanguage());
    
    // Set up language switcher buttons
    const langDeButton = document.getElementById('lang-de');
    const langEnButton = document.getElementById('lang-en');
    
    if (langDeButton) {
        langDeButton.addEventListener('click', () => {
            setLanguage('de');
        });
    }
    
    if (langEnButton) {
        langEnButton.addEventListener('click', () => {
            setLanguage('en');
        });
    }
});

