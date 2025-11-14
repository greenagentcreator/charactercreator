import { configureLogging } from './config/environment.js';

configureLogging();

// Defer loading the rest of the application until logging is configured.
import('./main.js');

