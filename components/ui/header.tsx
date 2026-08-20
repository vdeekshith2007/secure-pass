'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Shield, Moon, Sun, Keyboard, History, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenShortcuts: () => void;
}

export function Header({
  historyCount,
  onOpenHistory,
  onOpenShortcuts,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl dark:bg-black/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand Identity */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-0.5 shadow-lg shadow-blue-500/25"
          >
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-black/80">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-tight text-white">
                Secure<span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">Pass</span>
              </span>
              <span className="hidden rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-300 sm:inline-block">
                SaaS v3.0
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 md:block">
              Generate Strong Passwords. Stay Secure.
            </p>
          </div>
        </div>

        {/* Center Live Security Status Badge */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 lg:flex">
          <Shield className="h-3.5 w-3.5 text-emerald-400" />
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>WebCrypto CSPRNG Hardened Engine</span>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Keyboard Shortcuts Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenShortcuts}
            aria-label="Keyboard Shortcuts"
            className="hidden sm:flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-500/40 hover:bg-white/10 hover:text-white"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="h-4 w-4 text-cyan-400" />
            <span>Shortcuts</span>
            <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 sm:inline">
              ?
            </kbd>
          </motion.button>

          {/* Theme Switcher */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle Theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-purple-500/40 hover:bg-white/10 hover:text-white"
            title="Toggle Dark / Light Theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-purple-400" />
          </motion.button>

          {/* Vault History Drawer Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenHistory}
            aria-label="Open Vault History"
            className="relative flex h-10 items-center gap-2 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-3.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/10 transition-all hover:border-cyan-400 hover:from-cyan-500/30 hover:to-purple-500/30"
          >
            <History className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Vault History</span>
            {historyCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1.5 text-[11px] font-bold text-black">
                {historyCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
