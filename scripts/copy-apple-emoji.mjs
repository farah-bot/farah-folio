import { cp, mkdir, access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import path from 'node:path';
import fg from 'fast-glob';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(__dirname, '../node_modules/emoji-datasource-apple/img/apple/64');
const destinationDir = path.join(__dirname, '../public/emoji/apple');
const srcDir = path.join(__dirname, '../src');

const CHAR_ATTR_PATTERN = /char=(?:"([^"]+)"|'([^']+)'|\{['"]([^'"]+)['"]\})/g;

function toCodepoints(char) {
  return Array.from(char)
    .map((codeUnit) => codeUnit.codePointAt(0).toString(16).padStart(4, '0'))
    .join('-');
}

function indexVariation(index, variation) {
  index.set(variation.unified.toLowerCase(), variation.image);
  if (variation.non_qualified) {
    index.set(variation.non_qualified.toLowerCase(), variation.image);
  }
}

async function findUsedEmoji() {
  const files = await fg(['**/*.astro', '**/*.tsx', '**/*.jsx'], { cwd: srcDir, absolute: true });
  const found = new Map();

  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    for (const match of content.matchAll(CHAR_ATTR_PATTERN)) {
      const char = match[1] ?? match[2] ?? match[3];
      if (char) found.set(char, path.relative(srcDir, file));
    }
  }

  return found;
}

async function main() {
  let emojiData;
  try {
    emojiData = require('emoji-datasource-apple/emoji.json');
  } catch {
    console.warn('[copy-apple-emoji] Package emoji-datasource-apple tidak ditemukan, dilewati.');
    return;
  }

  const index = new Map();
  for (const entry of emojiData) {
    indexVariation(index, entry);
    if (entry.skin_variations) {
      for (const variation of Object.values(entry.skin_variations)) {
        indexVariation(index, variation);
      }
    }
  }

  const usedEmoji = await findUsedEmoji();
  await mkdir(destinationDir, { recursive: true });

  let copied = 0;

  for (const [char, foundIn] of usedEmoji) {
    const file = index.get(toCodepoints(char));
    if (!file) {
      console.warn(`[copy-apple-emoji] Tidak ada aset untuk "${char}" (dipakai di ${foundIn}), dilewati.`);
      continue;
    }

    const sourceFile = path.join(sourceDir, file);
    const destinationFile = path.join(destinationDir, file);

    try {
      await access(sourceFile);
    } catch {
      console.warn(`[copy-apple-emoji] File sumber tidak ditemukan untuk "${char}": ${file}`);
      continue;
    }

    await cp(sourceFile, destinationFile);
    copied += 1;
  }

  console.log(`[copy-apple-emoji] Ditemukan ${usedEmoji.size} emoji terpakai, ${copied} aset tersalin.`);
}

main().catch((error) => {
  console.error('[copy-apple-emoji] Gagal menyalin aset:', error);
  process.exitCode = 1;
});