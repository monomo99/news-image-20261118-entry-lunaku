// Front-page image emitter for the 18 November 2026 news-image entry.
// The picture itself lives next to this file as entry.png. This program
// only hands that exact picture to the grader: it reads the bytes, checks
// they really are a PNG, and writes the identical bytes to the output
// folder. Nothing here reads the clock, the network, or random data, so
// running it twice produces byte-for-byte the same file both times.
//
// Local check:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const folder = dirname(fileURLToPath(import.meta.url));
const source = join(folder, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

const picture = readFileSync(source);
if (picture.length === 0) {
  throw new Error('entry.png is empty');
}
if (!picture.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error('entry.png is not a PNG file');
}

mkdirSync(outDir, { recursive: true });
writeFileSync(target, picture);

const written = statSync(target);
if (written.size !== picture.length) {
  throw new Error(`short write: ${written.size} of ${picture.length} bytes`);
}
const roundTrip = readFileSync(target);
if (!roundTrip.equals(picture)) {
  throw new Error('output bytes differ from entry.png');
}
console.log(`wrote ${target} (${written.size} bytes)`);
