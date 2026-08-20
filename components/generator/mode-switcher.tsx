'use client';

import React from 'react';
import { GenerationMode } from '@/types/generator';
import { KeyRound, BookOpen, Hash, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

interface ModeSwitcherProps {
  mode: GenerationMode;
  onSelectMode: (mode: GenerationMode) => void;
}

const MODES: {
  id: GenerationMode;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    id: 'password',
    label: 'Password',
    icon: KeyRound,
    description: 'High-entropy alphanumeric & symbol string',
  },
  {
    id: 'passphrase',
    label: 'Passphrase',
    icon: BookOpen,
    description: 'Diceware EFF wordlist memorable token',
  },
  {
    id: 'pin',
    label: 'PIN Code',
    icon: Hash,
    description: 'Secure numeric PIN sequence',
  },
  {
    id: 'uuid',
    label: 'UUID v4',
    icon: Fingerprint,
    description: 'RFC 4122 cryptographic identifier',
  },
];

export function ModeSwitcher({ mode, onSelectMode }: ModeSwitcherProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-1.5 backdrop-blur-xl">
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {MODES.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;

          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className={`relative flex min-h-[46px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeModeBackground"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Icon
                className={`h-4 w-4 relative z-10 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-500'
                }`}
              />
              <span className="relative z-10 whitespace-nowrap">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
