// First-visit tip when opening a saved agent sheet (local characters only)

import { t } from '../i18n/i18n.js?v=17b4a1e';
import { showModal } from './modal.js?v=17b4a1e';

const STORAGE_KEY = 'dg_sheet_onboarding_seen';

export function hasSeenSheetOnboarding() {
    return localStorage.getItem(STORAGE_KEY) === '1';
}

function markSheetOnboardingSeen() {
    localStorage.setItem(STORAGE_KEY, '1');
}

export function maybeShowSheetOnboarding() {
    if (hasSeenSheetOnboarding()) {
        return;
    }

    markSheetOnboardingSeen();

    requestAnimationFrame(() => {
        if (!document.getElementById('step-character-view')?.classList.contains('step-sheet')) {
            return;
        }

        showModal({
            title: t('sheet_onboarding_title'),
            bodyHtml: t('sheet_onboarding_body'),
            actions: [{
                label: t('sheet_onboarding_got_it'),
                className: 'action-button'
            }]
        });
    });
}
