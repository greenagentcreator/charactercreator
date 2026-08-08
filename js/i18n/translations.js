import { en } from './en.js?v=6e845c4';
import { de } from './de.js?v=6e845c4';
import { es } from './es.js?v=6e845c4';
import { fr } from './fr.js?v=6e845c4';
import { ru } from './ru.js?v=6e845c4';
import { pt } from './pt.js?v=6e845c4';

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
