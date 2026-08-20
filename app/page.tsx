'use client';

import React, { useState } from 'react';
import { usePasswordGenerator } from '@/hooks/usePasswordGenerator';
import { usePasswordHistory } from '@/hooks/usePasswordHistory';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Header } from '@/components/ui/header';
import { ModeSwitcher } from '@/components/generator/mode-switcher';
import { PasswordHero } from '@/components/generator/password-hero';
import { LengthSlider } from '@/components/generator/length-slider';
import { OptionsGrid } from '@/components/generator/options-grid';
import { SecurityDashboard } from '@/components/security/security-dashboard';
import { MatrixVisualizer } from '@/components/security/matrix-visualizer';
import { SecureSandbox } from '@/components/sandbox/secure-sandbox';
import { HistoryDrawer } from '@/components/history/history-drawer';
import { QrModal } from '@/components/modals/qr-modal';
import { ShortcutsModal } from '@/components/modals/shortcuts-modal';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Home() {
  const {
    mode,
    setMode,
    options,
    updateOption,
    currentCredential,
    analysis,
    generateNew,
  } = usePasswordGenerator();

  const {
    history,
    addToHistory,
    toggleFavorite,
    toggleFavoriteByValue,
    removeHistoryItem,
    clearHistory,
  } = usePasswordHistory();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Check if current credential is favorited
  const isCurrentFavorite =
    history.find((item) => item.value === currentCredential)?.isFavorite ||
    false;

  const handleGenerateAndSave = () => {
    const cred = generateNew();
    addToHistory({
      value: cred,
      mode,
      entropy: analysis.entropyBits,
      strength: analysis.strengthLevel,
    });
  };

  const handleToggleCurrentFavorite = () => {
    if (!currentCredential) return;
    const existing = history.find((i) => i.value === currentCredential);
    if (existing) {
      toggleFavorite(existing.id);
      toast.info(
        existing.isFavorite
          ? 'Removed from favorites'
          : 'Added to favorites'
      );
    } else {
      addToHistory({
        value: currentCredential,
        mode,
        entropy: analysis.entropyBits,
        strength: analysis.strengthLevel,
      });
      setTimeout(() => {
        toggleFavoriteByValue(currentCredential);
      }, 50);
      toast.success('Saved to favorites');
    }
  };

  useKeyboardShortcuts({
    onGenerate: handleGenerateAndSave,
    onCopy: () => {
      if (!currentCredential) return;
      navigator.clipboard.writeText(currentCredential);
      toast.success('Copied to clipboard via shortcut');
    },
    onToggleHistory: () => setIsHistoryOpen((prev) => !prev),
    onToggleShortcutsModal: () => setIsShortcutsModalOpen((prev) => !prev),
  });

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
      {/* Background Ambient Aurora Gradient */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[30%] left-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-transparent blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] h-[700px] w-[700px] rounded-full bg-gradient-to-tl from-violet-600/15 via-blue-500/10 to-transparent blur-[140px]" />
      </div>

      {/* Floating Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      {/* Main Studio Content Area */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8"
        >
          {/* Top Hero Section & Mode Switcher */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-blue-400">
                  SECUREPASS ZERO-TRUST ENGINE
                </span>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Generate Strong Passwords. Stay Secure.
                </h1>
              </div>

              {/* Mode Switcher */}
              <ModeSwitcher mode={mode} onSelectMode={setMode} />
            </div>

            {/* Password Display Card */}
            <PasswordHero
              value={currentCredential}
              onGenerate={handleGenerateAndSave}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleCurrentFavorite}
              onOpenQrModal={() => setIsQrModalOpen(true)}
            />
          </div>

          {/* Core Configuration Controls Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-5">
              <LengthSlider
                mode={mode}
                length={options.length}
                wordCount={options.wordCount}
                pinLength={options.pinLength}
                onChangeLength={(val) => updateOption('length', val)}
                onChangeWordCount={(val) => updateOption('wordCount', val)}
                onChangePinLength={(val) => updateOption('pinLength', val)}
              />
            </div>

            <div className="flex flex-col gap-6 lg:col-span-7">
              <OptionsGrid
                mode={mode}
                options={options}
                onUpdateOption={updateOption}
              />
            </div>
          </div>

          {/* Full-Width Zero-Trust Posture Rating & Security Analytics Section (Stretched full width on Laptops & All Devices) */}
          <div className="w-full">
            <SecurityDashboard analysis={analysis} />
          </div>

          {/* BOTTOM SECTION: CRYPTOGRAPHIC MATRIX MONITOR & SECURE SANDBOX STUDIO (ALWAYS AT THE END ON EVERY DEVICE) */}
          <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <MatrixVisualizer
                entropyBits={analysis.entropyBits}
                credentialLength={currentCredential.length}
              />
            </div>
            <div className="lg:col-span-5">
              <SecureSandbox currentCredential={currentCredential} />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer credits & SEO links */}
      <footer className="relative z-10 mt-16 border-t border-white/10 bg-black/40 py-8 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} SECUREPASS. All rights reserved. Made By Tanish.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-mono">100% Client-Side Engine</span>
            <span className="text-emerald-400 font-semibold">Zero Telemetry</span>
          </div>
        </div>
      </footer>

      {/* Drawers & Modals */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onToggleFavorite={toggleFavorite}
        onRemoveItem={removeHistoryItem}
        onClearHistory={clearHistory}
      />

      <QrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        value={currentCredential}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
}
