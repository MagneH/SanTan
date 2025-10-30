/* eslint-env node */
import fs from 'fs';

const inputFile = '../types/sanity.types.ts';
const outputFile = '../types/sanityTypeLiterals.ts';

const file = fs.readFileSync(inputFile, 'utf8');
const typeRegex = /_type:\s*'([^']+)'/g;
const types = new Set();

let match;
while ((match = typeRegex.exec(file)) !== null) {
  types.add(match[1]);
}

const output = `export const sanityTypeLiterals = ${JSON.stringify(Array.from(types), null, 2)};\n`;
fs.writeFileSync(outputFile, output);

// eslint-disable-next-line no-undef
console.log(`Extracted ${types.size} types to ${outputFile}`);
