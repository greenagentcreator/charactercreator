import { en } from './en.js?v=05f314a';
import { de } from './de.js?v=05f314a';
import { es } from './es.js?v=05f314a';
import { fr } from './fr.js?v=05f314a';
import { ru } from './ru.js?v=05f314a';
import { pt } from './pt.js?v=05f314a';

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
