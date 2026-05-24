// Shared HTML / attribute escaping for user-generated and external content

export function escapeHtml(text) {
    if (text == null) {
        return '';
    }
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function escapeAttr(text) {
    return escapeHtml(text).replace(/'/g, '&#39;');
}
