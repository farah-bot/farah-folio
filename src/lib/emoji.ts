import emojiMap from './emoji-map.generated.json';

const emojiIndex = new Map<string, string>(Object.entries(emojiMap as Record<string, string>));

export function resolveAppleEmojiFile(char: string): string | null {
  return emojiIndex.get(char) ?? null;
}