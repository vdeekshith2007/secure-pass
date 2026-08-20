'use client';

import React, { useEffect, useRef } from 'react';
import { X, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
}

export function QrModal({ isOpen, onClose, value }: QrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen || !value || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, value, {
      width: 240,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    }).catch(console.error);
  }, [isOpen, value]);

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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <QrCode className="h-5 w-5 text-cyan-400" />
                  <span>AIR-GAP QR TRANSFER</span>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl bg-white/5 p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-xl">
                <canvas ref={canvasRef} />
              </div>

              <p className="text-center text-xs text-slate-400">
                Scan with your mobile authenticator or hardware security device to
                transfer offline without network exposure.
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
