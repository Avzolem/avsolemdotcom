import type { Charset, CharsetName } from '../types';

const PRESETS: Record<CharsetName, string> = {
  standard: ' .:-=+*#%@',
  dense: ' .\'`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  sparse: ' .:+*#@',
  halftone: ' .,:;irsXA253hMHGS#9B&@',
};

export function getCharset(name: CharsetName): Charset {
  return { name, chars: PRESETS[name] };
}

export function customCharset(chars: string): Charset {
  return { name: 'custom', chars: chars.length > 0 ? chars : PRESETS.standard };
}

export function lumToChar(lum: number, charset: Charset, invert = false): string {
  const t = Math.max(0, Math.min(1, invert ? 1 - lum : lum));
  const idx = Math.floor(t * (charset.chars.length - 1));
  return charset.chars[idx];
}
