import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, '../../../../packages/shared/src/types/sanity.types.ts');
const outputFile = path.join(__dirname, '../../../../packages/shared/src/types/sanityTypeLiterals.ts');

const file = fs.readFileSync(inputFile, 'utf8');
// Match both single and double quotes for _type values
const typeRegex = /_type:\s*["']([^"']+)["']/g;

const types = new Set<string>();
let match;
while ((match = typeRegex.exec(file)) !== null) {
  types.add(match[1]);
}

const enumMembers = Array.from(types)
  .map((type) => {
    // Replace dots and other invalid characters with underscores
    const enumKey = type.replace(/[^a-zA-Z0-9_]/g, '_');
    return `  ${enumKey} = '${type}',`;
  })
  .join('\n');

const output = `export enum sanityTypeLiterals {\n${enumMembers}\n}\n`;

fs.writeFileSync(outputFile, output);
console.log(`Extracted ${types.size} types to ${outputFile}`);
