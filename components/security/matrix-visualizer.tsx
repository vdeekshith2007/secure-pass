'use client';

import React, { useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

interface MatrixVisualizerProps {
  entropyBits: number;
  credentialLength: number;
}

export function MatrixVisualizer({
  entropyBits,
  credentialLength,
}: MatrixVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 480);
    let height = (canvas.height = 180);

    const resizeObserver = new ResizeObserver(() => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 180;
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const cols = Math.floor(width / 16);
    const drops = Array(cols).fill(0).map(() => Math.floor(Math.random() * height));
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*+<>{}[]=';

    const render = () => {
      ctx.fillStyle = 'rgba(5, 10, 24, 0.22)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = '12px monospace';
      const speedMultiplier = entropyBits > 80 ? 2 : 1;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const isCyan = i % 2 === 0;
        ctx.fillStyle = isCyan ? '#06B6D4' : '#10B981';

        ctx.fillText(text, i * 16, drops[i] * 16);

        if (drops[i] * 16 > height && Math.random() > 0.96) {
          drops[i] = 0;
        }
        drops[i] += speedMultiplier;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [entropyBits, credentialLength]);

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 shadow-xl backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            CRYPTOGRAPHIC MATRIX MONITOR
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
          </span>
          <span className="font-mono text-xs font-semibold text-cyan-300">
            ENTROPY WAVEFORM ACTIVE
          </span>
        </div>
      </div>

      <div className="relative h-[180px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#050A18]">
        <canvas ref={canvasRef} className="h-full w-full" />
        <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-1 font-mono text-[11px] text-slate-300 backdrop-blur-md">
          <span>ENTROPY STREAM:</span>
          <span className="font-bold text-cyan-400">{entropyBits} BITS</span>
        </div>
      </div>
    </div>
  );
}
