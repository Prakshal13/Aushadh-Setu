import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultDataPath = path.join(__dirname, 'data/district_data.json');
const tmpDataPath = '/tmp/district_data.json';

let memoryCache = null;

export function getDb() {
  if (memoryCache) return memoryCache;

  // Check writable /tmp location (for serverless environments)
  try {
    if (fs.existsSync(tmpDataPath)) {
      memoryCache = JSON.parse(fs.readFileSync(tmpDataPath, 'utf8'));
      return memoryCache;
    }
  } catch (e) {
    // Ignore and fallback
  }

  // Fallback to bundled data file
  try {
    memoryCache = JSON.parse(fs.readFileSync(defaultDataPath, 'utf8'));
    return memoryCache;
  } catch (e) {
    console.error('[Aushadh Setu DB] Error reading data file:', e);
    return memoryCache || {};
  }
}

export function saveDb(data) {
  memoryCache = data;

  // Attempt write to /tmp (works on serverless lambdas / Vercel)
  try {
    fs.writeFileSync(tmpDataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    // Silently continue
  }

  // Attempt write to project directory (works on local development)
  try {
    fs.writeFileSync(defaultDataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    // In serverless, bundled filesystem is read-only, which is expected
  }
}
