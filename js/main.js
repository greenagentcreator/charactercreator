// Main entry point for Delta Green Character Creator

import { initI18n, setLanguage, getCurrentLanguage } from './i18n/i18n.js';
import { initializeApp } from './app.js';

// Theme management
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;
    
    // Get saved theme or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Apply initial theme
    html.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme, themeIcon);
    
    // Set initial aria-pressed for theme toggle
    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', initialTheme === 'dark' ? 'true' : 'false');
    }
    
    // Listen for system theme changes (if no saved preference)
    if (!savedTheme) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme, themeIcon);
        });
    }
    
    // Theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Add transition class for smooth change
            html.setAttribute('data-theme-transitioning', '');
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme, themeIcon);
            
            // Update aria-pressed
            if (themeToggle) {
                themeToggle.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
            }
            
            // Remove transition class after animation
            setTimeout(() => {
                html.removeAttribute('data-theme-transitioning');
            }, 300);
        });
    }
}

function updateThemeIcon(theme, iconElement) {
    if (iconElement) {
        iconElement.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme first
    initTheme();
    
    // Initialize i18n
    initI18n();
    
    // Initialize the app
    initializeApp();
    
    // Set the language (this will trigger initial translation)
    setLanguage(getCurrentLanguage());
    
    // Set up language switcher buttons
    const langDeButton = document.getElementById('lang-de');
    const langEnButton = document.getElementById('lang-en');
    
    // Update aria-pressed based on current language
    const updateLanguageButtons = () => {
        const currentLang = getCurrentLanguage();
        if (langDeButton) {
            langDeButton.setAttribute('aria-pressed', currentLang === 'de' ? 'true' : 'false');
            langDeButton.classList.toggle('active', currentLang === 'de');
        }
        if (langEnButton) {
            langEnButton.setAttribute('aria-pressed', currentLang === 'en' ? 'true' : 'false');
            langEnButton.classList.toggle('active', currentLang === 'en');
        }
    };
    
    if (langDeButton) {
        langDeButton.addEventListener('click', () => {
            setLanguage('de');
            updateLanguageButtons();
        });
    }
    
    if (langEnButton) {
        langEnButton.addEventListener('click', () => {
            setLanguage('en');
            updateLanguageButtons();
        });
    }
    
    // Initial update
    updateLanguageButtons();
});

