/**
 * Builds the web app and stamps it with a build id.
 *
 * The id is what `src/sync/auto-update.ts` compares against once a minute, so
 * an installed web app on the iPhone picks up a new deploy by itself instead of
 * having to be removed from the home screen and added again.
 *
 * Run with: node scripts/build-web.js
 */

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const build = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const stamp = { build, builtAt: new Date().toISOString() };

// written before the export so it is copied into dist along with public/
fs.writeFileSync(path.join('public', 'version.json'), JSON.stringify(stamp, null, 2) + '\n');
console.log('build id:', build);

execSync('npx expo export --platform web --output-dir dist', { stdio: 'inherit' });

// written again afterwards, in case the export replaced it
fs.writeFileSync(path.join('dist', 'version.json'), JSON.stringify(stamp, null, 2) + '\n');

const size = execSync('du -sh dist').toString().trim().split('\t')[0];
console.log(`\ndist pronta (${size}), build ${build}`);
