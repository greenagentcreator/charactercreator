// Step 3: Derived Attributes
// This module displays and calculates derived attributes based on primary statistics

import { getCharacter } from '../model/character.js';
import { calculateDerivedAttributes } from '../model/character.js';
import { t } from '../i18n/i18n.js';

export function renderStep3_DerivedAttributes() {
    const character = getCharacter();
    calculateDerivedAttributes(); // Ensure values are current
    const derived = character.derivedAttributes;

    let html = `<div class="step" id="step3-derived-attributes">
        <h2 data-i18n="step3_info_derived_title"></h2>
        <div class="info-box">
            <p data-i18n="step3_info_derived_intro"></p>
        </div>
        <div class="derived-attributes-display">
            <div class="derived-attr-header">
                <div style="flex-basis: 200px; flex-shrink: 0; text-align: right; padding-right: 15px;" data-i18n="derived_attribute_label"></div>
                <div style="flex-basis: 60px; flex-shrink: 0; text-align: center;" data-i18n="derived_value_label"></div>
                <div style="flex-grow: 1; padding-left: 15px;" data-i18n="derived_description_label"></div>
            </div>
            <div class="derived-attr-row">
                <div data-i18n="attr_hp_name"></div>
                <div>${derived.HP}</div>
                <div data-i18n="attr_hp_desc"></div>
            </div>
            <div class="derived-attr-row">
                <div data-i18n="attr_wp_name"></div>
                <div>${derived.WP}</div>
                <div data-i18n="attr_wp_desc"></div>
            </div>
            <div class="derived-attr-row">
                <div data-i18n="attr_san_name"></div>
                <div>${derived.SAN}</div>
                <div data-i18n="attr_san_desc"></div>
            </div>
            <div class="derived-attr-row">
                <div data-i18n="attr_bp_name"></div>
                <div>${derived.BP}</div>
                <div data-i18n="attr_bp_desc"></div>
            </div>
        </div>
    </div>`;
    return html;
}

export function validateStep3() {
    // Derived attributes are automatically calculated, so validation always passes
    return true;
}

export function saveStep3() {
    // Derived attributes are automatically calculated, nothing to save
}

export function attachStep3Listeners() {
    // No listeners needed for Step 3 (read-only display)
}
