import { describe, it, expect } from 'vitest';
import { escapeHtml, escapeAttr } from '../../js/utils/escape-html.js';

describe('escapeHtml', () => {
    it('escapes the HTML-significant characters', () => {
        expect(escapeHtml('&')).toBe('&amp;');
        expect(escapeHtml('<')).toBe('&lt;');
        expect(escapeHtml('>')).toBe('&gt;');
        expect(escapeHtml('"')).toBe('&quot;');
    });

    it('returns an empty string for null/undefined', () => {
        expect(escapeHtml(null)).toBe('');
        expect(escapeHtml(undefined)).toBe('');
    });

    it('coerces non-strings', () => {
        expect(escapeHtml(42)).toBe('42');
    });

    it('leaves benign text untouched', () => {
        expect(escapeHtml('French (50%)')).toBe('French (50%)');
    });

    it('neutralizes a script-injection payload (no raw angle brackets survive)', () => {
        const out = escapeHtml('<img src=x onerror=alert(1)>');
        expect(out).not.toContain('<');
        expect(out).not.toContain('>');
        expect(out).toBe('&lt;img src=x onerror=alert(1)&gt;');
    });
});

describe('escapeAttr', () => {
    it('escapes single quotes in addition to escapeHtml characters', () => {
        expect(escapeAttr("' onmouseover='alert(1)")).toBe('&#39; onmouseover=&#39;alert(1)');
    });

    it('breaks out of neither single- nor double-quoted attributes', () => {
        const out = escapeAttr('"><script>alert(1)</script>');
        expect(out).not.toContain('<');
        expect(out).not.toContain('"');
    });
});
