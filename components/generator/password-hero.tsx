'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  QrCode,
  Download,
  Heart,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface PasswordHeroProps {
  value: string;
  onGenerate: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenQrModal: () => void;
}

export function PasswordHero({
  value,
  onGenerate,
  isFavorite,
  onToggleFavorite,
  onOpenQrModal,
}: PasswordHeroProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('Copied to clipboard!', {
      description: 'Credential safely stored in temporary buffer.',
    });

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#06B6D4', '#6366F1', '#10B981', '#A855F7'],
      });
    } catch (e) {
      // ignore confetti errors in restricted envs requirements
    }

    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadTxt = () => {
    if (!value) return;
    const blob = new Blob(
      [
        `SECUREPASS GENERATED CREDENTIAL\n=================================\nTimestamp: ${new Date().toISOString()}\nKey: ${value}\n\nGenerated offline by SecurePass Zero-Trust Engine.`,
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securepass-key-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded credential as secure text file.');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
      {/* Aurora glow accent */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl"></div>

      {/* Main Display Area */}
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              CRYPTOGRAPHIC TOKEN OUTPUT
            </span>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onToggleFavorite}
              aria-label="Toggle Favorite"
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                isFavorite
                  ? 'border-rose-500/40 bg-rose-500/15 text-rose-400 shadow-lg shadow-rose-500/20'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? 'fill-rose-400' : ''}`}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onOpenQrModal}
              aria-label="Generate QR Code"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-cyan-500/40 hover:bg-white/10 hover:text-cyan-300"
              title="Export as QR Code"
            >
              <QrCode className="h-4 w-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleDownloadTxt}
              aria-label="Download as Text File"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-purple-500/40 hover:bg-white/10 hover:text-purple-300"
              title="Download as TXT"
            >
              <Download className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Generated Value Box */}
        <div
          onClick={handleCopy}
          className="group relative flex min-h-[92px] cursor-pointer items-center justify-between rounded-2xl border border-white/15 bg-black/50 px-5 py-4 transition-all hover:border-cyan-500/50 hover:bg-black/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] sm:px-6"
          title="Click to copy"
        >
          <div className="flex-1 overflow-hidden pr-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="font-mono text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white select-all break-all"
              >
                {value || 'Generating...'}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className={`flex h-11 items-center gap-2 rounded-xl px-4 font-semibold text-xs transition-all ${
                copied
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25'
                  : 'bg-white/10 text-white hover:bg-cyan-500 hover:text-black hover:shadow-lg hover:shadow-cyan-500/25'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">COPY KEY</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Generate Primary CTA Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          {/* Mobile / Touch Guidance */}
          <div className="flex sm:hidden items-center gap-2 text-xs text-slate-400">
            <Sparkles className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>
              Tap token card above to copy • Tap button below to generate
            </span>
          </div>

          {/* Desktop / Laptop Keyboard Guidance */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>
              Press{' '}
              <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-white">
                Space
              </kbd>{' '}
              to generate new token • Click token card to copy
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGenerate}
            className="flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40"
          >
            <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180" />
            <span>GENERATE SECURE TOKEN</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
