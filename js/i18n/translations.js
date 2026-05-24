import { en } from './en.js?v=c3eb2a8';
import { de } from './de.js?v=c3eb2a8';
import { es } from './es.js?v=c3eb2a8';
import { fr } from './fr.js?v=c3eb2a8';
import { ru } from './ru.js?v=c3eb2a8';

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
