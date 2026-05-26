// Shared info-icon tooltips (skills, stats, etc.)

import { escapeHtml, escapeAttr } from './escape-html.js?v=27a0927';

/**
 * @param {string} description - Tooltip body text
 * @param {string} [label] - Optional prefix for aria-label (e.g. stat name)
 */
export function renderInfoIcon(description, label = '') {
    const aria = label ? `${label}: ${description}` : description;
    return `<span class="skill-info-icon" role="button" tabindex="0" aria-label="${escapeAttr(aria)}" title="${escapeAttr(description)}">i<span class="tooltip">${escapeHtml(description)}</span></span>`;
}

export function attachTooltipListeners() {
    document.querySelectorAll('.skill-info-icon').forEach(icon => {
        icon.removeEventListener('click', handleTooltipClick);
        icon.removeEventListener('touchstart', handleTooltipTouch);
        icon.addEventListener('click', handleTooltipClick);
        icon.addEventListener('touchstart', handleTooltipTouch, { passive: true });
    });

    document.removeEventListener('click', closeAllTooltips);
    document.addEventListener('click', closeAllTooltips);
}

function handleTooltipClick(event) {
    event.stopPropagation();
    const icon = event.currentTarget;
    const isActive = icon.classList.contains('tooltip-active');

    document.querySelectorAll('.skill-info-icon.tooltip-active').forEach(activeIcon => {
        if (activeIcon !== icon) {
            activeIcon.classList.remove('tooltip-active');
            resetTooltipPosition(activeIcon.querySelector('.tooltip'));
        }
    });

    if (!isActive) {
        icon.classList.add('tooltip-active');
        positionTooltipForMobile(icon);
    } else {
        icon.classList.remove('tooltip-active');
        resetTooltipPosition(icon.querySelector('.tooltip'));
    }
}

function positionTooltipForMobile(icon) {
    if (window.innerWidth > 600) return;

    const tooltip = icon.querySelector('.tooltip');
    if (!tooltip) return;

    requestAnimationFrame(() => {
        const iconRect = icon.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        const tooltipHeight = tooltipRect.height || 100;
        const spaceAbove = iconRect.top;
        const spaceBelow = viewportHeight - iconRect.bottom;
        const tooltipWidth = Math.min(280, viewportWidth - 40);

        let tooltipTop;
        if (spaceAbove > tooltipHeight + 10) {
            tooltipTop = iconRect.top - tooltipHeight - 8;
        } else if (spaceBelow > tooltipHeight + 10) {
            tooltipTop = iconRect.bottom + 8;
        } else {
            tooltipTop = Math.max(20, (viewportHeight - tooltipHeight) / 2);
            icon.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const iconCenterX = iconRect.left + (iconRect.width / 2);
        let tooltipLeft = iconCenterX - (tooltipWidth / 2);

        if (tooltipLeft < 20) {
            tooltipLeft = 20;
        } else if (tooltipLeft + tooltipWidth > viewportWidth - 20) {
            tooltipLeft = viewportWidth - tooltipWidth - 20;
        }

        tooltip.style.position = 'fixed';
        tooltip.style.top = `${tooltipTop}px`;
        tooltip.style.left = `${tooltipLeft}px`;
        tooltip.style.bottom = 'auto';
        tooltip.style.transform = 'none';
        tooltip.style.marginLeft = '0';
        tooltip.style.width = `${tooltipWidth}px`;
    });
}

function handleTooltipTouch(event) {
    event.preventDefault();
    handleTooltipClick(event);
}

function closeAllTooltips(event) {
    if (!event.target.closest('.skill-info-icon')) {
        document.querySelectorAll('.skill-info-icon.tooltip-active').forEach(icon => {
            icon.classList.remove('tooltip-active');
            resetTooltipPosition(icon.querySelector('.tooltip'));
        });
    }
}

function resetTooltipPosition(tooltip) {
    if (!tooltip) return;
    tooltip.style.position = '';
    tooltip.style.top = '';
    tooltip.style.bottom = '';
    tooltip.style.left = '';
    tooltip.style.transform = '';
    tooltip.style.marginLeft = '';
    tooltip.style.width = '';
}
