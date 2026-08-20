export type GenerationMode = 'password' | 'passphrase' | 'pin' | 'uuid';

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  customSymbols: string;
  pronounceable: boolean;
  // Passphrase specific
  wordCount: number;
  wordSeparator: string;
  capitalizeWords: boolean;
  includeNumberInPassphrase: boolean;
  // PIN specific
  pinLength: number;
}

export interface CharacterDistribution {
  uppercase: number;
  lowercase: number;
  numbers: number;
  symbols: number;
}

export type StrengthLevel =
  | 'VERY WEAK'
  | 'WEAK'
  | 'FAIR'
  | 'STRONG'
  | 'VERY STRONG'
  | 'UNBREAKABLE';

export interface SecurityAnalysis {
  strengthLevel: StrengthLevel;
  score: number; // 0 - 100
  entropyBits: number;
  crackTimeDisplay: string;
  poolSize: number;
  characterDistribution: CharacterDistribution;
  securityTips: string[];
}

export interface HistoryItem {
  id: string;
  value: string;
  mode: GenerationMode;
  timestamp: number;
  entropy: number;
  strength: StrengthLevel;
  isFavorite: boolean;
}
