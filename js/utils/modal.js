// Lightweight accessible modal dialogs

let activeModal = null;

function closeActiveModal() {
    if (!activeModal) {
        return;
    }
    activeModal.remove();
    activeModal = null;
    document.body.classList.remove('modal-open');
}

function trapFocus(modal) {
    const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    modal.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeActiveModal();
            return;
        }
        if (event.key !== 'Tab' || focusable.length === 0) {
            return;
        }
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
}

/**
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.bodyHtml
 * @param {Array<{label: string, className?: string, onClick?: () => void, closeOnClick?: boolean}>} options.actions
 */
export function showModal({ title, bodyHtml, actions = [] }) {
    closeActiveModal();

    const overlay = document.createElement('div');
    overlay.className = 'app-modal-overlay';
    overlay.innerHTML = `
        <div class="app-modal" role="dialog" aria-modal="true" aria-labelledby="app-modal-title">
            <header class="app-modal-header">
                <h2 id="app-modal-title" class="app-modal-title">${title}</h2>
                <button type="button" class="app-modal-close" aria-label="Close">×</button>
            </header>
            <div class="app-modal-body">${bodyHtml}</div>
            <footer class="app-modal-footer"></footer>
        </div>`;

    const footer = overlay.querySelector('.app-modal-footer');
    actions.forEach((action) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = action.className || 'action-button';
        btn.textContent = action.label;
        btn.addEventListener('click', () => {
            if (action.onClick) {
                action.onClick();
            }
            if (action.closeOnClick !== false) {
                closeActiveModal();
            }
        });
        footer.appendChild(btn);
    });

    overlay.querySelector('.app-modal-close').addEventListener('click', closeActiveModal);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeActiveModal();
        }
    });

    document.body.appendChild(overlay);
    document.body.classList.add('modal-open');
    activeModal = overlay;
    trapFocus(overlay);

    const primary = footer.querySelector('button') || overlay.querySelector('.app-modal-close');
    primary?.focus();
}

export function closeModal() {
    closeActiveModal();
}

function escapeModalText(text) {
    if (text == null) {
        return '';
    }
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * @param {{ title: string, message: string, confirmLabel: string, cancelLabel: string, danger?: boolean }} options
 * @returns {Promise<boolean>}
 */
export function showConfirmDialog({ title, message, bodyHtml, confirmLabel, cancelLabel, danger = false }) {
    return new Promise((resolve) => {
        showModal({
            title: escapeModalText(title),
            bodyHtml: bodyHtml ?? `<p>${escapeModalText(message)}</p>`,
            actions: [
                {
                    label: cancelLabel,
                    className: 'action-button button-secondary',
                    onClick: () => resolve(false)
                },
                {
                    label: confirmLabel,
                    className: danger ? 'action-button app-modal-btn-danger' : 'action-button',
                    onClick: () => resolve(true)
                }
            ]
        });
    });
}

/**
 * @param {{ title: string, label: string, defaultValue?: string, confirmLabel: string, cancelLabel: string }} options
 * @returns {Promise<string|null>}
 */
export function showPromptDialog({ title, label, defaultValue = '', confirmLabel, cancelLabel }) {
    return new Promise((resolve) => {
        const inputId = 'app-modal-prompt-input';
        showModal({
            title: escapeModalText(title),
            bodyHtml: `
                <label class="app-modal-prompt-label" for="${inputId}">${escapeModalText(label)}</label>
                <input type="text" id="${inputId}" class="app-modal-prompt-input" value="${escapeModalText(defaultValue)}" autocomplete="off">`,
            actions: [
                {
                    label: cancelLabel,
                    className: 'action-button button-secondary',
                    onClick: () => resolve(null)
                },
                {
                    label: confirmLabel,
                    className: 'action-button',
                    closeOnClick: false,
                    onClick: () => {
                        const value = document.getElementById(inputId)?.value?.trim() ?? '';
                        closeActiveModal();
                        resolve(value || null);
                    }
                }
            ]
        });

        requestAnimationFrame(() => {
            const input = document.getElementById(inputId);
            if (!input) {
                return;
            }
            input.focus();
            input.select();
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    const value = input.value.trim();
                    closeActiveModal();
                    resolve(value || null);
                }
            });
        });
    });
}

/**
 * @param {{ title: string, message: string, closeLabel?: string }} options
 */
export function showAlertDialog({ title, message, closeLabel = 'OK' }) {
    showModal({
        title: escapeModalText(title),
        bodyHtml: `<p>${escapeModalText(message)}</p>`,
        actions: [{ label: closeLabel, className: 'action-button' }]
    });
}
