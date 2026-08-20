'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  GenerationMode,
  PasswordOptions,
  SecurityAnalysis,
} from '@/types/generator';
import { generateSecureCredential } from '@/utils/cryptoEngine';
import { analyzeSecurity } from '@/utils/securityAnalytics';

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeSimilar: false,
  excludeAmbiguous: false,
  customSymbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  pronounceable: false,
  wordCount: 5,
  wordSeparator: '-',
  capitalizeWords: true,
  includeNumberInPassphrase: true,
  pinLength: 6,
};

export function usePasswordGenerator() {
  const [mode, setMode] = useState<GenerationMode>('password');
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS);
  const [currentCredential, setCurrentCredential] = useState<string>('');
  const [analysis, setAnalysis] = useState<SecurityAnalysis>(() =>
    analyzeSecurity('', 'password')
  );

  const generateNew = useCallback(() => {
    const cred = generateSecureCredential(mode, options);
    setCurrentCredential(cred);
    setAnalysis(analyzeSecurity(cred, mode));
    return cred;
  }, [mode, options]);

  // Initial generation on mount or when mode/options change
  useEffect(() => {
    generateNew();
  }, [mode, options, generateNew]);

  const updateOption = useCallback(
    <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
      setOptions((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  return {
    mode,
    setMode,
    options,
    setOptions,
    updateOption,
    currentCredential,
    analysis,
    generateNew,
  };
}
