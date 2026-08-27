'use client';

import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onGenerate: () => void;
  onCopy: () => void;
  onToggleHistory: () => void;
  onToggleShortcutsModal: () => void;
}

export function useKeyboardShortcuts({
  onGenerate,
  onCopy,
  onToggleHistory,
  onToggleShortcutsModal,
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting inside inputs or textareas is increased
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isInput) return;

      // Space -> Generate
      if (e.code === 'Space') {
        e.preventDefault();
        onGenerate();
      }

      // c or Cmd+C / Ctrl+C -> Copy
      if (
        (e.key === 'c' && !e.ctrlKey && !e.metaKey) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'c' && !window.getSelection()?.toString())
      ) {
        e.preventDefault();
        onCopy();
      }

      // h -> Toggle history drawer
      if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onToggleHistory();
      }

      // ? -> Toggle shortcuts modal
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onToggleShortcutsModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onGenerate, onCopy, onToggleHistory, onToggleShortcutsModal]);
}
