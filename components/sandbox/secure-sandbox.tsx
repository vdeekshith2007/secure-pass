'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, Code2, FileText, Database } from 'lucide-react';
import { toast } from 'sonner';

interface SecureSandboxProps {
  currentCredential: string;
}

type SandboxFormat = 'env' | 'json' | 'yaml' | 'connection';

export function SecureSandbox({ currentCredential }: SecureSandboxProps) {
  const [format, setFormat] = useState<SandboxFormat>('env');
  const [copied, setCopied] = useState(false);

  const getFormattedPayload = () => {
    const key = currentCredential || 'GENERATING_KEY...';
    if (format === 'env') {
      return `# Production AWS/DB Zero-Trust Secrets
DATABASE_PASSWORD="${key}"
API_SECRET_KEY="${key}"
NEXTAUTH_SECRET="${key}"`;
    }
    if (format === 'json') {
      return JSON.stringify(
        {
          credentials: {
            engine: 'SecurePass v3.0',
            token: key,
            created_at: new Date().toISOString(),
          },
        },
        null,
        2
      );
    }
    if (format === 'yaml') {
      return `security:
  engine: "SecurePass v3.0"
  credentials:
    master_key: "${key}"
    rotate_after_days: 90`;
    }
    return `postgres://root:${encodeURIComponent(key)}@production-db.internal:5432/vault_prod?sslmode=verify-full`;
  };

  const payload = getFormattedPayload();

  const handleCopy = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    toast.success('Formatted payload copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 shadow-xl backdrop-blur-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Terminal className="h-5 w-5 text-purple-400" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              SECURE SANDBOX STUDIO
            </span>
            <p className="text-[11px] text-slate-400">
              Preview & export active credential inside production formats
            </p>
          </div>
        </div>

        {/* Format Selector */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'env' as const, label: '.ENV', icon: FileText },
            { id: 'json' as const, label: 'JSON', icon: Code2 },
            { id: 'yaml' as const, label: 'YAML', icon: FileText },
            { id: 'connection' as const, label: 'URI', icon: Database },
          ].map((item) => {
            const Icon = item.icon;
            const active = format === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFormat(item.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                  active
                    ? 'border border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/60">
        {/* Editor Title Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            <span className="uppercase font-semibold">{format} configuration payload</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-white/20"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>COPY PAYLOAD</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 font-mono text-xs leading-relaxed text-slate-200">
          <pre className="overflow-x-auto whitespace-pre-wrap select-all">
            {payload}
          </pre>
        </div>
      </div>
    </div>
  );
}
