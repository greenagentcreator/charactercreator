import { en } from './en.js?v=99fd89c';
import { de } from './de.js?v=99fd89c';
import { es } from './es.js?v=99fd89c';
import { fr } from './fr.js?v=99fd89c';
import { ru } from './ru.js?v=99fd89c';

export const i18nData = {
    en,
    de,
    es,
    fr,
    ru,
};

/** Native language names for UI and library filters */
export const languageLabels = {
    de: 'Deutsch',
    en: 'English',
    es: 'Español',
    fr: 'Français',
    nl: 'Nederlands',
    pl: 'Polski',
    pt: 'Português',
    ru: 'Русский',
    it: 'Italiano',
};

/** Languages stored on shared library characters (includes non-UI languages) */
export const SUPPORTED_LIBRARY_LANGUAGES = ['de', 'en', 'es', 'fr', 'it', 'nl', 'pl', 'pt', 'ru'];
