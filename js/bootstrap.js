import { configureLogging } from './config/environment.js';

console.log('bootstrap.js: Starting initialization...');

try {
    configureLogging();
    console.log('bootstrap.js: Logging configured');
    
    // Defer loading the rest of the application until logging is configured.
    import('./main.js').then(() => {
        console.log('bootstrap.js: main.js loaded successfully');
    }).catch((error) => {
        console.error('bootstrap.js: Error loading main.js:', error);
        import('./utils/app-loading.js').then(({ failAppLoading }) => failAppLoading()).catch(() => {});
    });
} catch (error) {
    console.error('bootstrap.js: Error during initialization:', error);
    import('./utils/app-loading.js').then(({ failAppLoading }) => failAppLoading()).catch(() => {});
}

