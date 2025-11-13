// Step 0: Introduction

import { resetCharacter } from '../model/character.js';

export function renderIntro() {
    // Reset character when starting from intro
    resetCharacter();
    return `
        <div class="step" id="step-intro">
            <div class="info-box"><p data-i18n="intro_quote_dg"></p></div>
            <p data-i18n="intro_welcome_text"></p>
        </div>`;
}

