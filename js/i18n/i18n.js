// i18n (Internationalization) system for Delta Green Character Creator

import { i18nData } from './translations.js';

const translations = {};
let currentLanguage = 'en';

export function setupTranslations() {
    if (i18nData && i18nData.en) translations.en = i18nData.en;
    if (i18nData && i18nData.de) translations.de = i18nData.de;
}

export function t(key, replacements = {}) {
    if (typeof key !== 'string' || key === "") return "";
    let translationString;
    if (translations[currentLanguage] && translations[currentLanguage][key] !== undefined) {
        translationString = translations[currentLanguage][key];
    } else if (translations['en'] && translations['en'][key] !== undefined) {
        translationString = translations['en'][key];
    } else {
        return `[[${key}]]`;
    }
    if (typeof translationString !== 'string') {
        return `[[${key}_TYPE_ERR]]`;
    }
    for (const placeholder in replacements) {
        if (replacements.hasOwnProperty(placeholder)) {
            translationString = translationString.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
        }
    }
    return translationString;
}

export function applyTranslationsToElement(el, key, directReplacements = {}) {
    let replacements = { ...directReplacements };

    // Try to read additional replacements from data attribute
    const attrReplacementsString = el.getAttribute('data-i18n-replacements');
    if (attrReplacementsString) {
        try {
            const parsedAttrReplacements = JSON.parse(attrReplacementsString);
            for (const rKey in parsedAttrReplacements) {
                if (parsedAttrReplacements.hasOwnProperty(rKey) && !replacements.hasOwnProperty(rKey)) {
                    replacements[rKey] = parsedAttrReplacements[rKey];
                }
            }
        } catch (e) {
            console.warn(`Error parsing data-i18n-replacements for key "${key}": ${attrReplacementsString}`, e);
        }
    }
    
    const translatedText = t(key, replacements);

    if (el.tagName === 'INPUT' && el.type === 'text' && el.hasAttribute('placeholder')) {
        el.placeholder = translatedText;
    } else if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit')) {
        el.value = translatedText;
    } else if (el.tagName === 'BUTTON' || el.tagName === 'OPTION' || el.tagName === 'SPAN') {
        el.textContent = translatedText;
    } else {
        el.innerHTML = translatedText; 
    }
}

export function translateAllElements(container = document) {
    const charData = window.app ? window.app.getCurrentCharacterData() : null;

    container.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) { 
            let directReplacements = {};
            if (charData) {
                if (key === "custom_prof_info_divide_points") {
                    directReplacements.totalPoints = charData.customProfessionSkillPointBudget;
                } else if (key === "custom_prof_info_skill_allocation") {
                    const budget = charData.customProfessionSkillPointBudget;
                    let pointsSpent = 0;
                    if (charData.customProfessionSelectedSkills && typeof charData.customProfessionSelectedSkills === 'object') {
                       Object.values(charData.customProfessionSelectedSkills).forEach(skill => pointsSpent += (skill.points || 0) );
                    }
                    const remainingPoints = budget - pointsSpent;
                    directReplacements.currentBudget = budget;
                    directReplacements.remainingPoints = remainingPoints;
                } else if (key === "custom_prof_skills_selected_count") {
                    directReplacements.count = charData.customProfessionSelectedSkills ? Object.keys(charData.customProfessionSelectedSkills).length : 0;
                }
            }
            applyTranslationsToElement(el, key, directReplacements);
        }
    });
}

export function setLanguage(lang) {
    if (!translations[lang] && lang !== 'en') {
        lang = 'en';
    }
    currentLanguage = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    translateAllElements(); 

    // Don't re-render if we're loading a shared character
    if (window.app && typeof window.app.renderCurrentStep === 'function') {
        const isLoadingShared = window.app.isLoadingSharedCharacter && window.app.isLoadingSharedCharacter();
        if (!isLoadingShared) {
            window.app.renderCurrentStep(); 
        }
    }
    const langDeButton = document.getElementById('lang-de');
    const langEnButton = document.getElementById('lang-en');
    if (langDeButton) langDeButton.classList.toggle('active', lang === 'de');
    if (langEnButton) langEnButton.classList.toggle('active', lang === 'en');
}

export function getCurrentLanguage() {
    return currentLanguage;
}

export function initI18n() {
    setupTranslations();
    let langToSet = 'en';

    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang && translations[storedLang]) {
        langToSet = storedLang;
    } else {
        const browserLangFull = navigator.language || navigator.userLanguage;
        if (browserLangFull) {
            const browserLangBase = browserLangFull.split('-')[0].toLowerCase();

            if (browserLangBase === 'de' && translations.de) {
                langToSet = 'de';
            }
        }
    }

    currentLanguage = langToSet;
}

