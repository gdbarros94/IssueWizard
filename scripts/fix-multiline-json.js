#!/usr/bin/env node
const fs = require('fs');
const p = require('path');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/fix-multiline-json.js <file.json>');
  process.exit(2);
}

if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(2);
}

let text = fs.readFileSync(filePath, 'utf8');
let replaced = 0;

// This regex targets a description value that contains raw newlines and is followed by a labels key
const regex = /("description"\s*:\s*")([\s\S]*?)("\s*,\s*\n\s*"labels")/g;
text = text.replace(regex, (m, g1, g2, g3) => {
  replaced++;
  // escape backslashes and quotes inside the description, then convert newlines to \n
  const inner = g2
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, '\\n');
  return g1 + inner + g3;
});

if (replaced === 0) {
  console.log('No description patterns found that needed fixing.');
} else {
  const outPath = filePath.replace(/(\.json)?$/i, '') + '-fixed.json';
  fs.writeFileSync(outPath, text, 'utf8');
  console.log(`Fixed ${replaced} description field(s). Wrote output to: ${outPath}`);
  console.log('Validate the output with: jq .', outPath);
}

process.exit(0);
