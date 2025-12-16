// scripts/copy-config.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const template = `// Auto-generated config for new Codespace
const CODESPACE_CONFIG = {
  BACKEND_URL: 'https://[NEW-CODESPACE-NAME]-8000.app.github.dev',
  FRONTEND_URL: 'https://[NEW-CODESPACE-NAME]-5173.app.github.dev',
};

// Save this to src/config/AppConfig.js and update the URLs
console.log('📋 Config template ready for new Codespace');
console.log('Replace [NEW-CODESPACE-NAME] with your actual codespace name');
`;

fs.writeFileSync(
  path.join(__dirname, '../NEW_CODESPACE_CONFIG.txt'),
  template
);

console.log('✅ Config template created: NEW_CODESPACE_CONFIG.txt');
