'use client';

import React from 'react';
import { GenerationMode } from '@/types/generator';

interface LengthSliderProps {
  mode: GenerationMode;
  length: number;
  wordCount: number;
  pinLength: number;
  onChangeLength: (val: number) => void;
  onChangeWordCount: (val: number) => void;
  onChangePinLength: (val: number) => void;
}

export function LengthSlider({
  mode,
  length,
  wordCount,
  pinLength,
  onChangeLength,
  onChangeWordCount,
  onChangePinLength,
}: LengthSliderProps) {
  if (mode === 'uuid') {
    return null;
  }

  let label = 'CHARACTER LENGTH';
  let currentVal = length;
  let min = 4;
  let max = 128;
  let presets = [12, 16, 24, 32, 64];
  let unit = 'CHARACTERS';

  if (mode === 'passphrase') {
    label = 'DICEWARE WORD COUNT';
    currentVal = wordCount;
    min = 2;
    max = 12;
    presets = [3, 5, 7, 9, 12];
    unit = 'WORDS';
  } else if (mode === 'pin') {
    label = 'PIN DIGIT LENGTH';
    currentVal = pinLength;
    min = 3;
    max = 16;
    presets = [4, 6, 8, 10, 12];
    unit = 'DIGITS';
  }

  const handleChange = (val: number) => {
    if (mode === 'passphrase') onChangeWordCount(val);
    else if (mode === 'pin') onChangePinLength(val);
    else onChangeLength(val);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className="flex items-center gap-1.5 font-mono text-xl font-bold text-cyan-400">
          <span>{currentVal}</span>
          <span className="text-xs font-normal text-slate-500">{unit}</span>
        </div>
      </div>

      {/* Range Slider Track */}
      <div className="relative flex items-center py-2">
        <input
          type="range"
          min={min}
          max={max}
          value={currentVal}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-black/60 accent-cyan-400 focus:outline-none"
        />
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium uppercase text-slate-500">
          QUICK PRESETS:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset) => {
            const isActive = currentVal === preset;
            return (
              <button
                key={preset}
                onClick={() => handleChange(preset)}
                className={`rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition-all ${
                  isActive
                    ? 'border border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-sm'
                    : 'border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
