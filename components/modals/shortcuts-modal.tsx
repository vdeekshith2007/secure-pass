'use client';

import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Space', desc: 'Regenerate new high-entropy credential' },
  { key: 'C / Ctrl+C', desc: 'Copy current active token to clipboard' },
  { key: 'H', desc: 'Toggle Vault History Drawer' },
  { key: '?', desc: 'Toggle Keyboard Shortcuts Guide' },
];

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative flex w-full max-w-md flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <Keyboard className="h-5 w-5 text-cyan-400" />
                  <span>KEYBOARD SHORTCUTS</span>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl bg-white/5 p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col gap-3 py-2">
                {SHORTCUTS.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-3"
                  >
                    <span className="text-xs text-slate-300">{s.desc}</span>
                    <kbd className="rounded-lg border border-white/20 bg-black/60 px-2.5 py-1 font-mono text-xs font-bold text-cyan-300">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <p className="text-center text-[11px] text-slate-500">
                Hotkeys work anywhere outside text inputs.
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
