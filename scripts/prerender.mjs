import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const serverEntry = resolve(root, 'dist-server/entry-server.js');
const templatePath = resolve(root, 'dist/index.html');

if (!existsSync(serverEntry)) {
  console.error(`prerender: missing ${serverEntry}`);
  process.exit(1);
}

const { renderLanding } = await import(serverEntry);
const html = renderLanding();

const template = readFileSync(templatePath, 'utf-8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  console.error(`prerender: marker ${marker} not found in ${templatePath}`);
  process.exit(1);
}
writeFileSync(templatePath, template.replace(marker, `<div id="root">${html}</div>`));

// Clean up the SSR bundle — not needed at runtime, only for this build step.
rmSync(resolve(root, 'dist-server'), { recursive: true, force: true });

console.log(`prerender: Landing injected (${html.length} chars)`);
