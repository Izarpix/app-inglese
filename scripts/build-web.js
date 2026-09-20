/**
 * Builds the web app and stamps it with a build id.
 *
 * The id goes in two places, and both are needed:
 *
 *   dist/version.json   what the server says the latest build is
 *   <meta name="build-id"> inside every page, what THIS copy was built from
 *
 * Comparing the two is what lets the app notice it is a stale copy that Safari
 * pulled out of its cache. Asking the server twice would only ever compare the
 * server with itself.
 *
 * Run with: node scripts/build-web.js
 */

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const build = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const stamp = { build, builtAt: new Date().toISOString() };

fs.writeFileSync(path.join('public', 'version.json'), JSON.stringify(stamp, null, 2) + '\n');
console.log('build id:', build);

execSync('npx expo export --platform web --output-dir dist', { stdio: 'inherit' });

fs.writeFileSync(path.join('dist', 'version.json'), JSON.stringify(stamp, null, 2) + '\n');

/** Puts the build id inside every exported page. */
function stampHtml(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += stampHtml(full);
    } else if (entry.name.endsWith('.html')) {
      const html = fs.readFileSync(full, 'utf8');
      if (html.includes('name="build-id"')) continue;
      fs.writeFileSync(full, html.replace('<head>', `<head><meta name="build-id" content="${build}"/>`));
      count += 1;
    }
  }
  return count;
}

const stamped = stampHtml('dist');
const size = execSync('du -sh dist').toString().trim().split('\t')[0];
console.log(`\ndist pronta (${size}), build ${build}, ${stamped} pagine marcate`);
