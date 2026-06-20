import { defineConfig } from 'vitest/config';

/**
 * The app loads its own ES modules with a `?v=<build>` cache-busting query
 * (e.g. `import { x } from './a.js?v=5c9e92d'`). Strip that query during test
 * resolution so the import graph resolves to the real source files.
 */
function stripVersionQuery() {
    return {
        name: 'strip-version-query',
        enforce: 'pre',
        async resolveId(source, importer, options) {
            const match = source.match(/^(.*)\?v=[^?]*$/);
            if (!match) {
                return null;
            }
            const resolved = await this.resolve(match[1], importer, { ...options, skipSelf: true });
            return resolved?.id ?? null;
        }
    };
}

export default defineConfig({
    plugins: [stripVersionQuery()],
    test: {
        // jsdom gives the unit tests window/document/btoa/atob. The rules tests
        // opt back into the node environment via a `// @vitest-environment node`
        // docblock since they talk to the Firestore emulator over the network.
        environment: 'jsdom',
        include: ['tests/**/*.test.js'],
        globals: false
    }
});
