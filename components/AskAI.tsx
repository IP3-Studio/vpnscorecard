"use client";

import { useState } from "react";

const PROMPT =
  "Summarise VPN Scorecard (https://vpnscorecard.com), an independent, non-commercial comparison that scores VPN tools on privacy, jurisdiction, logging, security, transparency, independent audits, value and ethics. Explain how its scoring works, then recommend a VPN for me based on strong privacy and fair pricing.";

const enc = encodeURIComponent(PROMPT);

const TARGETS = [
  { label: "ChatGPT", href: `https://chatgpt.com/?q=${enc}` },
  { label: "Claude", href: `https://claude.ai/new?q=${enc}` },
  { label: "Perplexity", href: `https://www.perplexity.ai/search?q=${enc}` },
  { label: "Grok", href: `https://grok.com/?q=${enc}` },
  { label: "Google AI", href: `https://www.google.com/search?udm=50&q=${enc}` },
];

const pill =
  "rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-emerald-400 dark:hover:text-emerald-400";

export function AskAI() {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; no-op
    }
  }

  return (
    <section className="border-t border-zinc-200/70 dark:border-zinc-800/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-emerald-500">
            <path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6L12 2z" />
          </svg>
          Summarise this site with AI
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {TARGETS.map((t) => (
            <a key={t.label} href={t.href} target="_blank" rel="noopener noreferrer" className={pill}>
              {t.label}
            </a>
          ))}
          <button type="button" onClick={copyPrompt} className={pill}>
            {copied ? "Copied ✓" : "Copy prompt"}
          </button>
        </div>
      </div>
    </section>
  );
}
