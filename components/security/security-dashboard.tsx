'use client';

import React from 'react';
import { SecurityAnalysis } from '@/types/generator';
import { ShieldAlert, ShieldCheck, Cpu, Clock, Activity, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface SecurityDashboardProps {
  analysis: SecurityAnalysis;
}

export function SecurityDashboard({ analysis }: SecurityDashboardProps) {
  const {
    strengthLevel,
    score,
    entropyBits,
    crackTimeDisplay,
    poolSize,
    characterDistribution,
    securityTips,
  } = analysis;

  let colorClass = 'from-rose-500 to-red-600 text-rose-400';
  let barColor = 'bg-rose-500';

  if (strengthLevel === 'WEAK') {
    colorClass = 'from-amber-500 to-orange-500 text-amber-400';
    barColor = 'bg-amber-500';
  } else if (strengthLevel === 'FAIR') {
    colorClass = 'from-yellow-400 to-amber-500 text-yellow-300';
    barColor = 'bg-yellow-400';
  } else if (strengthLevel === 'STRONG') {
    colorClass = 'from-cyan-400 to-blue-500 text-cyan-300';
    barColor = 'bg-cyan-400';
  } else if (strengthLevel === 'VERY STRONG' || strengthLevel === 'UNBREAKABLE') {
    colorClass = 'from-emerald-400 via-cyan-400 to-purple-500 text-emerald-300';
    barColor = 'bg-emerald-400';
  }

  const totalChars =
    characterDistribution.uppercase +
    characterDistribution.lowercase +
    characterDistribution.numbers +
    characterDistribution.symbols || 1;

  return (
    <div className="flex flex-col gap-6 w-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 shadow-xl backdrop-blur-2xl sm:p-8">
      {/* Top Header & Score Meter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            {score >= 70 ? (
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            ) : (
              <ShieldAlert className="h-6 w-6 text-amber-400" />
            )}
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              ZERO-TRUST POSTURE RATING
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold tracking-tight text-white">
                {strengthLevel}
              </h3>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-xs font-semibold text-cyan-400">
                {score}/100
              </span>
            </div>
          </div>
        </div>

        {/* Crack Time Indicator Pill */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-2.5">
          <Clock className="h-4 w-4 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase text-slate-400">
              ESTIMATED CRACK TIME (100B H/S GPU)
            </span>
            <span className="font-mono text-sm font-bold text-white">
              {crackTimeDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs font-semibold text-slate-400">
          <span>ENTROPY DENSITY SCORE</span>
          <span>{entropyBits} BITS OF ENTROPY</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-black/60 p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, score)}%` }}
            transition={{ duration: 0.4, type: 'spring' }}
            className={`h-full rounded-full transition-all ${barColor}`}
          />
        </div>
      </div>

      {/* Analytics Grid: Entropy & Pool Size */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col rounded-2xl border border-white/10 bg-black/30 p-3.5">
          <span className="text-[10px] font-semibold uppercase text-slate-400">
            ENTROPY SCORE
          </span>
          <span className="font-mono text-lg font-bold text-cyan-400">
            {entropyBits} bits
          </span>
        </div>

        <div className="flex flex-col rounded-2xl border border-white/10 bg-black/30 p-3.5">
          <span className="text-[10px] font-semibold uppercase text-slate-400">
            SPACE POOL SIZE
          </span>
          <span className="font-mono text-lg font-bold text-purple-400">
            {poolSize} chars
          </span>
        </div>

        <div className="flex flex-col rounded-2xl border border-white/10 bg-black/30 p-3.5">
          <span className="text-[10px] font-semibold uppercase text-slate-400">
            ALGORITHM
          </span>
          <span className="font-mono text-sm font-bold text-emerald-400">
            CSPRNG WebCrypto
          </span>
        </div>

        <div className="flex flex-col rounded-2xl border border-white/10 bg-black/30 p-3.5">
          <span className="text-[10px] font-semibold uppercase text-slate-400">
            ATTACK RESISTANCE
          </span>
          <span className="font-mono text-sm font-bold text-white">
            {entropyBits >= 80 ? 'Quantum Hardened' : 'Standard Hardened'}
          </span>
        </div>
      </div>

      {/* Character Breakdown Bars */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          REAL-TIME CHARACTER DISTRIBUTION
        </span>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          {[
            {
              label: 'Uppercase',
              count: characterDistribution.uppercase,
              color: 'bg-cyan-400',
            },
            {
              label: 'Lowercase',
              count: characterDistribution.lowercase,
              color: 'bg-emerald-400',
            },
            {
              label: 'Numbers',
              count: characterDistribution.numbers,
              color: 'bg-purple-400',
            },
            {
              label: 'Symbols',
              count: characterDistribution.symbols,
              color: 'bg-blue-400',
            },
          ].map((item) => {
            const pct = Math.round((item.count / totalChars) * 100);
            return (
              <div key={item.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>{item.label}</span>
                  <span className="font-mono">{item.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-black/60">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${item.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable NIST Security Wisdom */}
      {securityTips.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-xs text-slate-300">
          <Lightbulb className="h-5 w-5 shrink-0 text-cyan-400" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-cyan-300">
              NIST SP 800-63B SECURITY RECOMMENDATION
            </span>
            <ul className="list-disc pl-4 space-y-1">
              {securityTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
