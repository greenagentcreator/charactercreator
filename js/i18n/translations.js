import { en } from './en.js?v=e070baf';
import { de } from './de.js?v=e070baf';
import { es } from './es.js?v=e070baf';
import { fr } from './fr.js?v=e070baf';
import { ru } from './ru.js?v=e070baf';
import { pt } from './pt.js?v=e070baf';

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
