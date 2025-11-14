// Main entry point for Delta Green Character Creator

import { initI18n, setLanguage, getCurrentLanguage } from './i18n/i18n.js';
import { initializeApp } from './app.js';
import { getCharacterFromUrl } from './utils/sharing.js';
import { initFirebase } from './utils/database.js';

// Theme management
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;
    
    // Get saved theme or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use saved theme if available, otherwise use system preference
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Apply initial theme
    html.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme, themeIcon);
    
    // Set initial aria-pressed for theme toggle
    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', initialTheme === 'dark' ? 'true' : 'false');
    }
    
    // Listen for system theme changes (only if no saved preference exists)
    // This allows the theme to automatically update when system preferences change
    if (!savedTheme) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e) => {
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme, themeIcon);
            if (themeToggle) {
                themeToggle.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
            }
        };
        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handleSystemThemeChange);
        }
    }
    
    // Theme toggle button - allows user to manually override system preference
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Add transition class for smooth change
            html.setAttribute('data-theme-transitioning', '');
            html.setAttribute('data-theme', newTheme);
            
            // Save user's manual choice to localStorage
            // This will override system preference on future visits
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
function initializeApplication() {
    console.log('main.js: initializeApplication() called, document.readyState:', document.readyState);
    
    try {
        // Initialize theme first
        initTheme();
        console.log('main.js: Theme initialized');
        
        // Initialize i18n
        initI18n();
        console.log('main.js: i18n initialized');
        
        // Initialize Firebase
        initFirebase();
        console.log('main.js: Firebase initialized');
        
        // Check for shared character in URL BEFORE initializing app
        const sharedCharacterData = getCharacterFromUrl();
        const hasSharedCharacter = !!sharedCharacterData;
        console.log('main.js: Shared character check:', hasSharedCharacter);
        
        // Initialize the app (it will check for shared character and set flag internally)
        initializeApp();
        console.log('main.js: App initialized');
        
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
        
        // Handle shared character if present
        if (hasSharedCharacter && sharedCharacterData) {
            // Wait for app to be fully initialized, then handle shared character
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                setTimeout(() => {
                    if (window.app && window.app.handleSharedCharacter) {
                        window.app.handleSharedCharacter(sharedCharacterData);
                    }
                }, 50);
            });
        }
    } catch (error) {
        console.error('main.js: Error during initialization:', error);
        throw error; // Re-throw to see in console
    }
}

// Check if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        console.log('main.js: DOMContentLoaded fired');
        initializeApplication();
    });
} else {
    // DOM is already loaded, initialize immediately
    console.log('main.js: DOM already loaded, initializing immediately');
    initializeApplication();
}

