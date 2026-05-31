// SEO landing block visibility and CTA interactions

const SEO_LANDING_ID = 'seo-landing';

export function initSeoLanding() {
    const cta = document.getElementById('seo-hero-cta');
    const secondary = document.getElementById('seo-hero-secondary');

    cta?.addEventListener('click', (event) => {
        event.preventDefault();
        if (window.app?.handleNextStep) {
            window.app.handleNextStep();
            return;
        }
        document.getElementById('btn-next')?.click();
    });

    secondary?.addEventListener('click', (event) => {
        const href = secondary.getAttribute('href');
        if (!href?.startsWith('#')) {
            return;
        }
        event.preventDefault();
        const section = document.querySelector(href);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        document.getElementById('step-content-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

export function updateSeoLandingVisibility({ step = 0, viewMode = 'creation' } = {}) {
    const landing = document.getElementById(SEO_LANDING_ID);
    if (!landing) {
        return;
    }
    const onHome = viewMode === 'creation' || viewMode === 'list';
    const show = onHome && step === 0;
    landing.hidden = !show;
}
