'use client';

import React from 'react';
import { GenerationMode, PasswordOptions } from '@/types/generator';

interface OptionsGridProps {
  mode: GenerationMode;
  options: PasswordOptions;
  onUpdateOption: <K extends keyof PasswordOptions>(
    key: K,
    val: PasswordOptions[K]
  ) => void;
}

export function OptionsGrid({
  mode,
  options,
  onUpdateOption,
}: OptionsGridProps) {
  if (mode === 'uuid' || mode === 'pin') {
    return null;
  }

  if (mode === 'passphrase') {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          PASSPHRASE ZERO-TRUST SETTINGS
        </span>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Capitalize Words */}
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3.5 transition-all hover:border-cyan-500/40">
            <div>
              <div className="text-xs font-semibold text-white">
                Capitalize Words
              </div>
              <div className="text-[11px] text-slate-400">
                Title-case each EFF Diceware word
              </div>
            </div>
            <input
              type="checkbox"
              checked={options.capitalizeWords}
              onChange={(e) =>
                onUpdateOption('capitalizeWords', e.target.checked)
              }
              className="h-4 w-4 rounded border-white/20 bg-black/60 text-cyan-500 focus:ring-cyan-400"
            />
          </label>

          {/* Include Random Digit */}
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3.5 transition-all hover:border-cyan-500/40">
            <div>
              <div className="text-xs font-semibold text-white">
                Inject Numeric Salt
              </div>
              <div className="text-[11px] text-slate-400">
                Embed random digit into word sequence
              </div>
            </div>
            <input
              type="checkbox"
              checked={options.includeNumberInPassphrase}
              onChange={(e) =>
                onUpdateOption('includeNumberInPassphrase', e.target.checked)
              }
              className="h-4 w-4 rounded border-white/20 bg-black/60 text-cyan-500 focus:ring-cyan-400"
            />
          </label>
        </div>

        {/* Word Separator Selector */}
        <div className="flex flex-col gap-2 pt-1">
          <span className="text-[11px] font-semibold uppercase text-slate-400">
            WORD DELIMITER:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Hyphen (-)', val: '-' },
              { label: 'Underscore (_)', val: '_' },
              { label: 'Period (.)', val: '.' },
              { label: 'Space', val: ' ' },
            ].map((sep) => {
              const active = options.wordSeparator === sep.val;
              return (
                <button
                  key={sep.val}
                  onClick={() => onUpdateOption('wordSeparator', sep.val)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    active
                      ? 'border border-cyan-500 bg-cyan-500/20 text-cyan-300'
                      : 'border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {sep.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        CHARACTER CLASS & ENTROPY CONTROLS
      </span>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            key: 'uppercase' as const,
            label: 'Uppercase',
            example: 'A-Z',
            active: options.uppercase,
          },
          {
            key: 'lowercase' as const,
            label: 'Lowercase',
            example: 'a-z',
            active: options.lowercase,
          },
          {
            key: 'numbers' as const,
            label: 'Numbers',
            example: '0-9',
            active: options.numbers,
          },
          {
            key: 'symbols' as const,
            label: 'Symbols',
            example: '!@#$',
            active: options.symbols,
          },
        ].map((item) => (
          <label
            key={item.key}
            className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
              item.active
                ? 'border-cyan-500/40 bg-cyan-500/10'
                : 'border-white/10 bg-black/30 hover:border-white/20'
            }`}
          >
            <div>
              <div className="text-xs font-semibold text-white">
                {item.label}
              </div>
              <div className="font-mono text-[11px] text-slate-400">
                {item.example}
              </div>
            </div>
            <input
              type="checkbox"
              checked={item.active}
              onChange={(e) => onUpdateOption(item.key, e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-black/60 text-cyan-500 focus:ring-cyan-400"
            />
          </label>
        ))}
      </div>

      {/* Advanced Zero-Trust Exclusions & Pronounceable Mode */}
      <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3.5 transition-all hover:border-purple-500/40">
          <div>
            <div className="text-xs font-semibold text-white">
              Exclude Similar
            </div>
            <div className="text-[11px] text-slate-400">
              Removes i, l, 1, L, o, 0, O
            </div>
          </div>
          <input
            type="checkbox"
            checked={options.excludeSimilar}
            onChange={(e) =>
              onUpdateOption('excludeSimilar', e.target.checked)
            }
            className="h-4 w-4 rounded border-white/20 bg-black/60 text-purple-500 focus:ring-purple-400"
          />
        </label>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3.5 transition-all hover:border-purple-500/40">
          <div>
            <div className="text-xs font-semibold text-white">
              Exclude Ambiguous
            </div>
            <div className="text-[11px] text-slate-400">
              Removes brackets & quotes
            </div>
          </div>
          <input
            type="checkbox"
            checked={options.excludeAmbiguous}
            onChange={(e) =>
              onUpdateOption('excludeAmbiguous', e.target.checked)
            }
            className="h-4 w-4 rounded border-white/20 bg-black/60 text-purple-500 focus:ring-purple-400"
          />
        </label>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3.5 transition-all hover:border-purple-500/40">
          <div>
            <div className="text-xs font-semibold text-white">
              Pronounceable
            </div>
            <div className="text-[11px] text-slate-400">
              Alternating C-V syllables
            </div>
          </div>
          <input
            type="checkbox"
            checked={options.pronounceable}
            onChange={(e) =>
              onUpdateOption('pronounceable', e.target.checked)
            }
            className="h-4 w-4 rounded border-white/20 bg-black/60 text-purple-500 focus:ring-purple-400"
          />
        </label>
      </div>

      {/* Custom Symbol Dictionary Override */}
      {options.symbols && !options.pronounceable && (
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="text-[11px] font-semibold uppercase text-slate-400">
            CUSTOM SYMBOL DICTIONARY OVERRIDE
          </label>
          <input
            type="text"
            value={options.customSymbols}
            onChange={(e) => onUpdateOption('customSymbols', e.target.value)}
            placeholder="!@#$%^&*()_+-="
            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 font-mono text-xs text-cyan-300 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
