// Load Cyrillic web fonts when Russian UI is active

const RU_FONTS_LINK_ID = 'dg-ru-fonts-stylesheet';
const RU_FONTS_HREF = 'https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=PT+Serif:wght@400;700&display=swap';

export function ensureRussianFontsLoaded() {
    if (document.getElementById(RU_FONTS_LINK_ID)) {
        return;
    }

    const link = document.createElement('link');
    link.id = RU_FONTS_LINK_ID;
    link.rel = 'stylesheet';
    link.href = RU_FONTS_HREF;
    document.head.appendChild(link);
}

export function unloadRussianFonts() {
    document.getElementById(RU_FONTS_LINK_ID)?.remove();
}

export function syncRussianFontsWithLanguage(lang) {
    if (lang === 'ru') {
        ensureRussianFontsLoaded();
    } else {
        unloadRussianFonts();
    }
}
