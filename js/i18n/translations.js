import { en } from './en.js?v=e38b3de';
import { de } from './de.js?v=e38b3de';
import { es } from './es.js?v=e38b3de';
import { fr } from './fr.js?v=e38b3de';
import { ru } from './ru.js?v=e38b3de';
import { pt } from './pt.js?v=e38b3de';

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
