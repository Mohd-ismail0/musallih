/**
 * Contract validation: ensures OpenAPI spec is valid and contains required paths.
 * Run: node scripts/validate-contracts.js
 */
const fs = require('fs');
const path = require('path');

const specPath = path.join(__dirname, '..', 'libs', 'contracts', 'src', 'openapi.json');
const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));

const requiredPaths = ['/health', '/health/live', '/health/ready'];
for (const p of requiredPaths) {
  if (!spec.paths || !spec.paths[p]) {
    console.error(`Missing required path: ${p}`);
    process.exit(1);
  }
}
console.log('Contract validation passed: all required paths present');
