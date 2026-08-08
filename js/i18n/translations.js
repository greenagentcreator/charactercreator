import { en } from './en.js?v=1b711ae';
import { de } from './de.js?v=1b711ae';
import { es } from './es.js?v=1b711ae';
import { fr } from './fr.js?v=1b711ae';
import { ru } from './ru.js?v=1b711ae';
import { pt } from './pt.js?v=1b711ae';

export const i18nData = {
    en,
    de,
    es,
    fr,
    ru,
    pt,
};

/** Native language names for UI and library filters */
export const languageLabels = {
    de: 'Deutsch',
    en: 'English',
    es: 'Español',
    fr: 'Français',
    nl: 'Nederlands',
    pl: 'Polski',
    pt: 'Português (Brasil)',
    ru: 'Русский',
    it: 'Italiano',
};

/** Languages stored on shared library characters (includes non-UI languages) */
export const SUPPORTED_LIBRARY_LANGUAGES = ['de', 'en', 'es', 'fr', 'it', 'nl', 'pl', 'pt', 'ru'];
