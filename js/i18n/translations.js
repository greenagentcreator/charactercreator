import { en } from './en.js?v=cc0d40b';
import { de } from './de.js?v=cc0d40b';
import { es } from './es.js?v=cc0d40b';
import { fr } from './fr.js?v=cc0d40b';
import { ru } from './ru.js?v=cc0d40b';
import { pt } from './pt.js?v=cc0d40b';

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
