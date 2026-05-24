import { configureLogging } from './config/environment.js?v=c3eb2a8';

console.log('bootstrap.js: Starting initialization...');

try {
    configureLogging();
    console.log('bootstrap.js: Logging configured');

    import('main').then(() => {
        console.log('bootstrap.js: main.js loaded successfully');
    }).catch((error) => {
        console.error('bootstrap.js: Error loading main.js:', error);
        import('./utils/app-loading.js?v=c3eb2a8').then(({ failAppLoading }) => failAppLoading()).catch(() => {});
    });
} catch (error) {
    console.error('bootstrap.js: Error during initialization:', error);
    import('./utils/app-loading.js?v=c3eb2a8').then(({ failAppLoading }) => failAppLoading()).catch(() => {});
}
