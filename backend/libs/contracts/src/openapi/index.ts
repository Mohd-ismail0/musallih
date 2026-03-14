import * as fs from 'fs';
import * as path from 'path';

export function getOpenApiSpec(): Record<string, unknown> {
  const filePath = path.join(__dirname, '..', 'openapi.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}
