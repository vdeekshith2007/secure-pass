import {
  CharacterDistribution,
  GenerationMode,
  SecurityAnalysis,
  StrengthLevel,
} from '@/types/generator';

export function analyzeSecurity(
  password: string,
  mode: GenerationMode,
  poolSizeOverride?: number
): SecurityAnalysis {
  if (!password) {
    return {
      strengthLevel: 'VERY WEAK',
      score: 0,
      entropyBits: 0,
      crackTimeDisplay: 'Instant',
      poolSize: 0,
      characterDistribution: {
        uppercase: 0,
        lowercase: 0,
        numbers: 0,
        symbols: 0,
      },
      securityTips: ['Generate a password or passphrase to inspect security metrics.'],
    };
  }

  // Calculate Character Distribution
  let uppercase = 0;
  let lowercase = 0;
  let numbers = 0;
  let symbols = 0;

  for (const char of password) {
    if (/[A-Z]/.test(char)) uppercase++;
    else if (/[a-z]/.test(char)) lowercase++;
    else if (/[0-9]/.test(char)) numbers++;
    else if (!/\s/.test(char)) symbols++;
  }

  const distribution: CharacterDistribution = {
    uppercase,
    lowercase,
    numbers,
    symbols,
  };

  let poolSize = poolSizeOverride || 0;
  let entropyBits = 0;

  if (mode === 'passphrase') {
    const wordCount = password.split(/[-_.,\s|]+/).filter(Boolean).length || 1;
    // Diceware wordlist size is ~400
    poolSize = 400;
    entropyBits = Math.round(wordCount * Math.log2(poolSize));
  } else if (mode === 'pin') {
    poolSize = 10;
    entropyBits = Math.round(password.length * Math.log2(10));
  } else if (mode === 'uuid') {
    poolSize = 16;
    entropyBits = 122; // RFC 4122 v4 effective entropy
  } else {
    // Password mode
    if (uppercase > 0) poolSize += 26;
    if (lowercase > 0) poolSize += 26;
    if (numbers > 0) poolSize += 10;
    if (symbols > 0) poolSize += 32;
    if (poolSize === 0) poolSize = 62;

    entropyBits = Math.round(password.length * Math.log2(poolSize));
  }

  // Calculate Crack Time based on Offline GPU Array (100 Billion guesses/sec = 10^11 / s)
  const combinations = Math.pow(2, entropyBits);
  const guessesPerSecond = 100_000_000_000; // 100B H/s
  const secondsToCrack = combinations / guessesPerSecond;

  let crackTimeDisplay = 'Instant';
  if (secondsToCrack < 1) {
    crackTimeDisplay = '< 1 second';
  } else if (secondsToCrack < 60) {
    crackTimeDisplay = `${Math.round(secondsToCrack)} seconds`;
  } else if (secondsToCrack < 3600) {
    crackTimeDisplay = `${Math.round(secondsToCrack / 60)} minutes`;
  } else if (secondsToCrack < 86400) {
    crackTimeDisplay = `${Math.round(secondsToCrack / 3600)} hours`;
  } else if (secondsToCrack < 31536000) {
    crackTimeDisplay = `${Math.round(secondsToCrack / 86400)} days`;
  } else if (secondsToCrack < 31536000 * 100) {
    crackTimeDisplay = `${Math.round(secondsToCrack / 31536000)} years`;
  } else if (secondsToCrack < 31536000 * 10_000) {
    crackTimeDisplay = `${Math.round(secondsToCrack / (31536000 * 100))} centuries`;
  } else {
    // Scientific notation for cosmic scales
    const years = secondsToCrack / 31536000;
    const exponent = Math.floor(Math.log10(years));
    const mantissa = (years / Math.pow(10, exponent)).toFixed(1);
    crackTimeDisplay = `${mantissa} × 10^${exponent} years`;
  }

  // Score & Strength Level
  let score = 0;
  let strengthLevel: StrengthLevel = 'VERY WEAK';

  if (entropyBits < 35) {
    score = Math.min(20, Math.round((entropyBits / 35) * 25));
    strengthLevel = 'VERY WEAK';
  } else if (entropyBits < 50) {
    score = 30 + Math.round(((entropyBits - 35) / 15) * 20);
    strengthLevel = 'WEAK';
  } else if (entropyBits < 65) {
    score = 52 + Math.round(((entropyBits - 50) / 15) * 18);
    strengthLevel = 'FAIR';
  } else if (entropyBits < 80) {
    score = 72 + Math.round(((entropyBits - 65) / 15) * 15);
    strengthLevel = 'STRONG';
  } else if (entropyBits < 110) {
    score = 88 + Math.round(((entropyBits - 80) / 30) * 10);
    strengthLevel = 'VERY STRONG';
  } else {
    score = 100;
    strengthLevel = 'UNBREAKABLE';
  }

  // Security Tips & Actionable Insights
  const securityTips: string[] = [];

  if (mode === 'password') {
    if (password.length < 12) {
      securityTips.push('Length is key: increasing beyond 16 characters adds exponential entropy.');
    } else {
      securityTips.push('Optimal length achieved: meets or exceeds modern zero-trust standards.');
    }

    if (uppercase === 0 || lowercase === 0) {
      securityTips.push('Mixing uppercase and lowercase letters doubles the alphabetical pool.');
    }
    if (numbers === 0) {
      securityTips.push('Adding digits prevents dictionary-only rainbow table attacks.');
    }
    if (symbols === 0) {
      securityTips.push('Special symbols expand character space to 94+ printable ASCII symbols.');
    }
    if (entropyBits >= 80) {
      securityTips.push('Quantum-resistant entropy: resistant against offline GPU arrays.');
    }
  } else if (mode === 'passphrase') {
    securityTips.push('Diceware passphrases combine high memorability with cryptographic randomness.');
    securityTips.push('Each additional word adds ~8.6 bits of true entropy.');
  } else if (mode === 'pin') {
    securityTips.push('PIN codes should be paired with hardware rate-limiting or HSM lockouts.');
  } else if (mode === 'uuid') {
    securityTips.push('RFC 4122 UUID v4 provides 122 bits of pseudo-random uniqueness.');
  }

  return {
    strengthLevel,
    score,
    entropyBits,
    crackTimeDisplay,
    poolSize,
    characterDistribution: distribution,
    securityTips,
  };
}
