#!/usr/bin/env node
/**
 * Stamps a git-based build id into index.html, version.json, and all JS import paths.
 *
 *   node scripts/stamp-version.mjs          # stamp with current git HEAD
 *   node scripts/stamp-version.mjs --dev    # reset to dev (no query on JS imports)
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const staticHtmlPages = ['guide.html', 'character-sheet.html', 'ideas.html'];
const versionPath = path.join(root, 'version.json');
const jsRoot = path.join(root, 'js');

const useDev = process.argv.includes('--dev');

function getBuildId() {
    if (useDev) {
        return 'dev';
    }
    try {
        return execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
    } catch {
        return `dev-${Date.now()}`;
    }
}

function stampImportPaths(content, buildId) {
    const suffix = buildId === 'dev' ? '' : `?v=${buildId}`;

    return content
        .replace(
            /from\s+(['"])(\.\.?\/[^'"]+?\.js)(?:\?v=[^'"]+)?\1/g,
            (_match, quote, modulePath) => `from ${quote}${modulePath}${suffix}${quote}`
        )
        .replace(
            /import\s*\(\s*(['"])(\.\.?\/[^'"]+?\.js)(?:\?v=[^'"]+)?\1\s*\)/g,
            (_match, quote, modulePath) => `import(${quote}${modulePath}${suffix}${quote})`
        );
}

function walkJsFiles(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkJsFiles(fullPath, files);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    return files;
}

function stampIndexHtml(indexHtml, buildId) {
    return indexHtml
        .replace(/css\/styles\.css\?v=[^"']+/, `css/styles.css?v=${buildId}`)
        .replace(/"\.\/js\/app\.js\?v=[^"]+"/, `"./js/app.js?v=${buildId}"`)
        .replace(/"\.\/js\/main\.js\?v=[^"]+"/, `"./js/main.js?v=${buildId}"`)
        .replace(/window\.__APP_BUILD__ = '[^']+'/, `window.__APP_BUILD__ = '${buildId}'`)
        .replace(/var FALLBACK_BUILD = '[^']+'/, `var FALLBACK_BUILD = '${buildId}'`);
}

function stampStaticHtml(html, buildId) {
    return html
        .replace(/css\/styles\.css\?v=[^"']+/, `css/styles.css?v=${buildId}`)
        .replace(/js\/seo-pages\/[^"']+\.js\?v=[^"']+/g, (match) => {
            const base = match.split('?')[0];
            return `${base}?v=${buildId}`;
        });
}

const buildId = getBuildId();
let indexHtml = fs.readFileSync(indexPath, 'utf8');

if (!indexHtml.includes('"main":')) {
    indexHtml = indexHtml.replace(
        /"app": "\.\/js\/app\.js\?v=[^"]+"/,
        `"app": "./js/app.js?v=${buildId}",\n            "main": "./js/main.js?v=${buildId}"`
    );
}

indexHtml = stampIndexHtml(indexHtml, buildId);
fs.writeFileSync(indexPath, indexHtml);

let updatedHtmlPages = 0;
for (const page of staticHtmlPages) {
    const pagePath = path.join(root, page);
    if (!fs.existsSync(pagePath)) {
        continue;
    }
    const original = fs.readFileSync(pagePath, 'utf8');
    const stamped = stampStaticHtml(original, buildId);
    if (stamped !== original) {
        fs.writeFileSync(pagePath, stamped);
        updatedHtmlPages += 1;
    }
}

const jsFiles = walkJsFiles(jsRoot);
let updatedJsFiles = 0;

for (const filePath of jsFiles) {
    const original = fs.readFileSync(filePath, 'utf8');
    const stamped = stampImportPaths(original, buildId);
    if (stamped !== original) {
        fs.writeFileSync(filePath, stamped);
        updatedJsFiles += 1;
    }
}

fs.writeFileSync(
    versionPath,
    `${JSON.stringify({ version: buildId, builtAt: new Date().toISOString() }, null, 2)}\n`
);

console.log(`Stamped build version: ${buildId} (${updatedJsFiles} JS files, ${updatedHtmlPages} static HTML pages updated)`);
