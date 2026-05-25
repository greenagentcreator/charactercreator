// i18n (Internationalization) system for Delta Green Character Creator

import { i18nData, languageLabels } from './translations.js?v=5a1d155';
import { syncRussianFontsWithLanguage } from '../utils/locale-fonts.js?v=5a1d155';

const translations = {};
let currentLanguage = 'en';

export function setupTranslations() {
    if (!i18nData) return;
    for (const [lang, data] of Object.entries(i18nData)) {
        if (data) translations[lang] = data;
    }
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
    syncRussianFontsWithLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);

    if (window.app?.syncLibraryLanguageFilterWithUi) {
        window.app.syncLibraryLanguageFilterWithUi(lang);
    }
    
    translateAllElements(); 

    import('../utils/seo.js?v=5a1d155').then(({ updateSeoMeta }) => {
        updateSeoMeta(lang);
    }).catch(() => {});

    // Don't re-render wizard/home while restoring, loading a share, or viewing a sheet
    if (window.app && typeof window.app.renderCurrentStep === 'function') {
        const isLoadingShared = window.app.isLoadingSharedCharacter && window.app.isLoadingSharedCharacter();
        const isRestoring = window.app.isRestoringNavigation && window.app.isRestoringNavigation();
        const isSheetView = window.app.isInSheetView && window.app.isInSheetView();
        if (!isLoadingShared && !isRestoring && !isSheetView) {
            window.app.renderCurrentStep(true);
        }
    }
    const languageSelect = document.getElementById('language-select');
    if (languageSelect && languageSelect.value !== lang) {
        languageSelect.value = lang;
    }

    import('../utils/news.js?v=5a1d155').then(({ refreshNewsButton }) => {
        refreshNewsButton?.();
    }).catch(() => {});
}

export function initLanguageSwitcher() {
    const languageSelect = document.getElementById('language-select');
    if (!languageSelect) return;

    languageSelect.replaceChildren();
    const sortedLangCodes = Object.keys(translations).sort((a, b) => {
        const labelA = languageLabels[a] || a;
        const labelB = languageLabels[b] || b;
        return labelA.localeCompare(labelB);
    });

    for (const code of sortedLangCodes) {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = languageLabels[code] || code.toUpperCase();
        languageSelect.appendChild(option);
    }
}

export function getCurrentLanguage() {
    return currentLanguage;
}

export function initI18n() {
    setupTranslations();
    let langToSet = 'en';

    const urlLang = new URLSearchParams(window.location.search).get('lang')?.toLowerCase();
    if (urlLang && translations[urlLang]) {
        langToSet = urlLang;
    } else {
        const storedLang = localStorage.getItem('preferredLanguage');
        if (storedLang && translations[storedLang]) {
            langToSet = storedLang;
        } else {
            const browserLangFull = navigator.language || navigator.userLanguage;
            if (browserLangFull) {
                const browserLangBase = browserLangFull.split('-')[0].toLowerCase();

                if (translations[browserLangBase]) {
                    langToSet = browserLangBase;
                }
            }
        }
    }

    currentLanguage = langToSet;
}

