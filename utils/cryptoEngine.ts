import { GenerationMode, PasswordOptions } from '@/types/generator';
import { DICEWARE_WORDLIST } from './dicewareWords';

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const DEFAULT_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

const SIMILAR_CHARS = /[il1Lo0O]/g;
const AMBIGUOUS_CHARS = /[{}[\]()/\\'"`~,;:.<>]/g;

const CONSONANTS = 'bcdfghjklmnpqrstvwxyz';
const VOWELS = 'aeiou';

/**
 * Returns a cryptographically secure random integer between [0, max - 1].
 */
export function getSecureRandomInt(max: number): number {
  if (max <= 0) return 0;
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.getRandomValues) {
    return Math.floor(Math.random() * max);
  }

  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % max);
  const buffer = new Uint32Array(1);

  while (true) {
    window.crypto.getRandomValues(buffer);
    if (buffer[0] < limit) {
      return buffer[0] % max;
    }
  }
}

/**
 * Shuffle array using CSPRNG Fisher-Yates update the rate 
 */
function secureShuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates a pronounceable password (alternating consonant-vowel syllables)
 */
function generatePronounceable(options: PasswordOptions): string {
  let chars = '';
  let includeNumbers = options.numbers;
  let includeSymbols = options.symbols;
  const length = options.length;

  let out: string[] = [];
  for (let i = 0; i < length; i++) {
    if (i % 2 === 0) {
      const char = CONSONANTS[getSecureRandomInt(CONSONANTS.length)];
      out.push(options.uppercase && i === 0 ? char.toUpperCase() : char);
    } else {
      out.push(VOWELS[getSecureRandomInt(VOWELS.length)]);
    }
  }

  // Inject number or symbol if requested
  if (includeNumbers && out.length > 2) {
    const idx = out.length - 2;
    out[idx] = NUMBER_CHARS[getSecureRandomInt(NUMBER_CHARS.length)];
  }
  if (includeSymbols && out.length > 3) {
    const symbols = options.customSymbols.trim() || DEFAULT_SYMBOLS;
    const idx = out.length - 1;
    out[idx] = symbols[getSecureRandomInt(symbols.length)];
  }

  return out.join('');
}

export function generateSecureCredential(
  mode: GenerationMode,
  options: PasswordOptions
): string {
  if (mode === 'passphrase') {
    const words: string[] = [];
    const count = Math.max(2, Math.min(12, options.wordCount || 5));

    for (let i = 0; i < count; i++) {
      const idx = getSecureRandomInt(DICEWARE_WORDLIST.length);
      let word = DICEWARE_WORDLIST[idx];
      if (options.capitalizeWords) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      words.push(word);
    }

    if (options.includeNumberInPassphrase && words.length > 0) {
      const targetIndex = getSecureRandomInt(words.length);
      const digit = getSecureRandomInt(10);
      words[targetIndex] = `${words[targetIndex]}${digit}`;
    }

    const separator = options.wordSeparator !== undefined ? options.wordSeparator : '-';
    return words.join(separator);
  }

  if (mode === 'pin') {
    const length = Math.max(3, Math.min(16, options.pinLength || 6));
    let pin = '';
    for (let i = 0; i < length; i++) {
      pin += NUMBER_CHARS[getSecureRandomInt(NUMBER_CHARS.length)];
    }
    return pin;
  }

  if (mode === 'uuid') {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback CSPRNG UUID v4
    const hex = '0123456789abcdef';
    let uuid = '';
    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid += '-';
      } else if (i === 14) {
        uuid += '4';
      } else if (i === 19) {
        const r = getSecureRandomInt(16);
        uuid += hex[(r & 0x3) | 0x8];
      } else {
        uuid += hex[getSecureRandomInt(16)];
      }
    }
    return uuid;
  }

  // Password mode
  if (options.pronounceable) {
    return generatePronounceable(options);
  }

  let pool = '';
  const requiredChars: string[] = [];

  let upper = UPPERCASE_CHARS;
  let lower = LOWERCASE_CHARS;
  let num = NUMBER_CHARS;
  let sym = options.customSymbols.trim() || DEFAULT_SYMBOLS;

  if (options.excludeSimilar) {
    upper = upper.replace(SIMILAR_CHARS, '');
    lower = lower.replace(SIMILAR_CHARS, '');
    num = num.replace(SIMILAR_CHARS, '');
  }

  if (options.excludeAmbiguous) {
    sym = sym.replace(AMBIGUOUS_CHARS, '');
  }

  if (options.uppercase && upper.length > 0) {
    pool += upper;
    requiredChars.push(upper[getSecureRandomInt(upper.length)]);
  }
  if (options.lowercase && lower.length > 0) {
    pool += lower;
    requiredChars.push(lower[getSecureRandomInt(lower.length)]);
  }
  if (options.numbers && num.length > 0) {
    pool += num;
    requiredChars.push(num[getSecureRandomInt(num.length)]);
  }
  if (options.symbols && sym.length > 0) {
    pool += sym;
    requiredChars.push(sym[getSecureRandomInt(sym.length)]);
  }

  // Fallback if user disabled all options
  if (pool.length === 0) {
    pool = LOWERCASE_CHARS + NUMBER_CHARS;
  }

  const targetLength = Math.max(4, Math.min(128, options.length || 16));
  const remainingLength = Math.max(0, targetLength - requiredChars.length);

  const randomChars: string[] = [];
  for (let i = 0; i < remainingLength; i++) {
    randomChars.push(pool[getSecureRandomInt(pool.length)]);
  }

  const combined = secureShuffleArray([...requiredChars, ...randomChars]);
  return combined.join('');
}
