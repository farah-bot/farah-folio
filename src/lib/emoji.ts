import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

interface EmojiDatasourceVariation {
  unified: string;
  non_qualified: string | null;
  image: string;
}

interface EmojiDatasourceEntry extends EmojiDatasourceVariation {
  skin_variations?: Record<string, EmojiDatasourceVariation>;
}

const emojiData = require('emoji-datasource-apple/emoji.json') as EmojiDatasourceEntry[];

const emojiIndex = new Map<string, string>();

function indexVariation(variation: EmojiDatasourceVariation) {
  emojiIndex.set(variation.unified.toLowerCase(), variation.image);
  if (variation.non_qualified) {
    emojiIndex.set(variation.non_qualified.toLowerCase(), variation.image);
  }
}

for (const entry of emojiData) {
  indexVariation(entry);
  if (entry.skin_variations) {
    for (const variation of Object.values(entry.skin_variations)) {
      indexVariation(variation);
    }
  }
}

export function toCodepoints(char: string): string {
  return Array.from(char)
    .map((codeUnit) => codeUnit.codePointAt(0)!.toString(16).padStart(4, '0'))
    .join('-');
}

export function resolveAppleEmojiFile(char: string): string | null {
  return emojiIndex.get(toCodepoints(char)) ?? null;
}