import { readFile } from 'node:fs/promises';

const manifestText = await readFile(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8');
const manifest = JSON.parse(manifestText);
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

const requiredManifestFields = ['name', 'short_name', 'start_url', 'display', 'background_color', 'theme_color', 'icons'];
for (const field of requiredManifestFields) {
  if (!manifest[field] || (Array.isArray(manifest[field]) && manifest[field].length === 0)) {
    throw new Error(`PWA manifest is missing required field: ${field}`);
  }
}

if (!html.includes('rel="manifest" href="/manifest.webmanifest"')) {
  throw new Error('index.html does not link the web app manifest.');
}

if (!html.includes('name="theme-color"')) {
  throw new Error('index.html is missing theme-color metadata.');
}

if (!html.includes('name="apple-mobile-web-app-capable"')) {
  throw new Error('index.html is missing Apple mobile web metadata.');
}

console.log('PWA foundation validation passed.');
console.log('Note: production PNG, maskable, and Apple touch icons remain a separate branding deliverable.');
