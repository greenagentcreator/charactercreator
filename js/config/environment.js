// Environment configuration and logging controls

const DEFAULT_ENV = (document?.documentElement?.dataset?.env || '').toLowerCase();
export const ENVIRONMENT = DEFAULT_ENV === 'production' ? 'production' : 'development';
export const IS_PRODUCTION = ENVIRONMENT === 'production';

/**
 * Disable noisy console output when running in production mode.
 * Errors remain untouched so that critical failures are still visible.
 */
export function configureLogging() {
    if (!IS_PRODUCTION || window.__LOGGING_DISABLED__) {
        return;
    }

    const noop = () => {};
    ['log', 'info', 'debug', 'trace', 'warn'].forEach(method => {
        if (typeof console?.[method] === 'function') {
            console[method] = noop;
        }
    });

    window.__LOGGING_DISABLED__ = true;
}

