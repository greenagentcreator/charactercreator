// Full-page skeleton loader shown until the first view is rendered

let loadingComplete = false;
const LOADER_ID = 'app-loading-screen';

export function completeAppLoading() {
    if (loadingComplete) {
        return;
    }
    loadingComplete = true;

    document.body.classList.remove('app-is-loading');

    const screen = document.getElementById(LOADER_ID);
    if (!screen) {
        return;
    }

    screen.classList.add('app-loading-screen--hide');
    screen.setAttribute('aria-busy', 'false');

    const remove = () => {
        screen.remove();
    };

    screen.addEventListener('transitionend', remove, { once: true });
    window.setTimeout(remove, 450);
}

export function failAppLoading() {
    completeAppLoading();
}
