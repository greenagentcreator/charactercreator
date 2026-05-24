#!/usr/bin/env node
/**
 * Stamps a git-based build id into index.html and version.json for cache busting.
 * Run before deploying: node scripts/stamp-version.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const versionPath = path.join(root, 'version.json');

function getBuildId() {
    try {
        return execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
    } catch {
        return `dev-${Date.now()}`;
    }
}

const buildId = getBuildId();
let indexHtml = fs.readFileSync(indexPath, 'utf8');

indexHtml = indexHtml
    .replace(/css\/styles\.css\?v=[^"']+/, `css/styles.css?v=${buildId}`)
    .replace(/js\/bootstrap\.js\?v=[^"']+/, `js/bootstrap.js?v=${buildId}`)
    .replace(/window\.__APP_BUILD__ = '[^']+'/, `window.__APP_BUILD__ = '${buildId}'`)
    .replace(/var BUILD = '[^']+'/, `var BUILD = '${buildId}'`);

fs.writeFileSync(indexPath, indexHtml);

fs.writeFileSync(
    versionPath,
    `${JSON.stringify({ version: buildId, builtAt: new Date().toISOString() }, null, 2)}\n`
);

console.log(`Stamped build version: ${buildId}`);
