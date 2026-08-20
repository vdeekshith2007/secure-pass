'use client';

import React, { useState } from 'react';
import { HistoryItem } from '@/types/generator';
import {
  X,
  History,
  Heart,
  Copy,
  Check,
  Trash2,
  Search,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onToggleFavorite: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearHistory: (keepFavorites?: boolean) => void;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onToggleFavorite,
  onRemoveItem,
  onClearHistory,
}: HistoryDrawerProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = history.filter((item) => {
    const matchesTab = activeTab === 'all' || item.isFavorite;
    const matchesSearch =
      !search ||
      item.value.toLowerCase().includes(search.toLowerCase()) ||
      item.mode.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCopy = (item: HistoryItem) => {
    navigator.clipboard.writeText(item.value);
    setCopiedId(item.id);
    toast.success('Copied credential from vault history');
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleExportHistory = () => {
    if (history.length === 0) return;
    const text = history
      .map(
        (item) =>
          `[${new Date(item.timestamp).toISOString()}] (${item.mode.toUpperCase()}) - ${item.value} [Entropy: ${item.entropy}b | ${item.strength}]`
      )
      .join('\n');
    const blob = new Blob([`SECUREPASS VAULT HISTORY EXPORT\n=================================\n\n${text}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securepass-vault-export-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Exported vault history to text file.');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-2xl"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-2.5">
                <History className="h-5 w-5 text-cyan-400" />
                <span className="font-mono text-base font-bold text-white">
                  VAULT HISTORY ARCHIVE
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs & Search Filter */}
            <div className="flex flex-col gap-3 border-b border-white/10 p-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-colors ${
                    activeTab === 'all'
                      ? 'bg-cyan-500 text-black'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  ALL ITEMS ({history.length})
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-colors ${
                    activeTab === 'favorites'
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  FAVORITES ({history.filter((i) => i.isFavorite).length})
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter keys or mode..."
                  className="w-full rounded-xl border border-white/10 bg-black/50 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Scrollable History Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filtered.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2 text-center text-slate-500">
                  <History className="h-8 w-8 opacity-40" />
                  <span className="text-xs">No stored credentials found.</span>
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-cyan-500/40 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-cyan-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-cyan-300">
                          {item.mode}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onToggleFavorite(item.id)}
                          className={`rounded-lg p-1.5 transition-colors ${
                            item.isFavorite
                              ? 'text-rose-400'
                              : 'text-slate-500 hover:text-white'
                          }`}
                          title="Toggle Favorite"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              item.isFavorite ? 'fill-rose-400' : ''
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleCopy(item)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-white"
                          title="Copy"
                        >
                          {copiedId === item.id ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="font-mono text-sm font-bold text-white break-all">
                      {item.value}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                      <span>Entropy: {item.entropy} bits</span>
                      <span className="font-semibold text-cyan-400">
                        {item.strength}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between border-t border-white/10 p-4">
              <button
                onClick={handleExportHistory}
                disabled={history.length === 0}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
              >
                <Download className="h-4 w-4" />
                <span>Export TXT</span>
              </button>

              <button
                onClick={() => onClearHistory(true)}
                disabled={history.length === 0}
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/20 disabled:opacity-40"
              >
                Clear Unsaved
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
