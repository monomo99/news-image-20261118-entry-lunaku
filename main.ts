// News-image entry (Node 22, standard library only). The front page stored
// in this repository as entry.png is written to /output/entry.png. The
// grader executes this program twice and requires both runs to produce
// identical bytes, so the program performs one deterministic copy and
// nothing else.
//
// When run outside the grader, MAKEFUN_OUTPUT_DIR takes the place of
// /output:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const image = join(here, 'entry.png');
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

if (!existsSync(image) || statSync(image).size === 0) {
  throw new Error('entry.png is missing or empty');
}
mkdirSync(targetDir, { recursive: true });
copyFileSync(image, join(targetDir, 'entry.png'));
