"use client";

import { useState, type ReactNode } from "react";

const PROMPT =
  "Summarise VPN Scorecard (https://vpnscorecard.com), an independent, non-commercial comparison that scores VPN tools on privacy, jurisdiction, logging, security, transparency, independent audits, value and ethics. Explain how its scoring works, then recommend a VPN for me based on strong privacy and fair pricing.";

const enc = encodeURIComponent(PROMPT);

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      {children}
    </svg>
  );
}

const TARGETS: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "Ask ChatGPT",
    href: `https://chatgpt.com/?q=${enc}`,
    icon: (
      <Svg>
        <g fill="currentColor">
          <circle cx="12" cy="4.5" r="1.5" />
          <circle cx="18.5" cy="8.25" r="1.5" />
          <circle cx="18.5" cy="15.75" r="1.5" />
          <circle cx="12" cy="19.5" r="1.5" />
          <circle cx="5.5" cy="15.75" r="1.5" />
          <circle cx="5.5" cy="8.25" r="1.5" />
        </g>
      </Svg>
    ),
  },
  {
    label: "Ask Claude",
    href: `https://claude.ai/new?q=${enc}`,
    icon: (
      <Svg>
        <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <line x1="12" y1="2.5" x2="12" y2="21.5" />
          <line x1="2.5" y1="12" x2="21.5" y2="12" />
          <line x1="5.2" y1="5.2" x2="18.8" y2="18.8" />
          <line x1="18.8" y1="5.2" x2="5.2" y2="18.8" />
        </g>
      </Svg>
    ),
  },
  {
    label: "Ask Perplexity",
    href: `https://www.perplexity.ai/search?q=${enc}`,
    icon: (
      <Svg>
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="6" y1="8" x2="6" y2="16" />
          <line x1="10" y1="5" x2="10" y2="19" />
          <line x1="14" y1="7" x2="14" y2="17" />
          <line x1="18" y1="9" x2="18" y2="15" />
        </g>
      </Svg>
    ),
  },
  {
    label: "Ask Grok",
    href: `https://grok.com/?q=${enc}`,
    icon: (
      <Svg>
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="5" y1="19" x2="19" y2="5" />
          <line x1="9.5" y1="19" x2="14.5" y2="12" />
        </g>
      </Svg>
    ),
  },
  {
    label: "Ask Google AI",
    href: `https://www.google.com/search?udm=50&q=${enc}`,
    icon: (
      <Svg>
        <path
          fill="currentColor"
          d="M12 2c0 5 5 10 10 10-5 0-10 5-10 10 0-5-5-10-10-10 5 0 10-5 10-10z"
        />
      </Svg>
    ),
  },
];

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-emerald-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-emerald-400";

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
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Summarise this site with AI
        </span>
        <div className="flex items-center gap-1">
          {TARGETS.map((t) => (
            <a
              key={t.label}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              title={t.label}
              aria-label={t.label}
              className={iconBtn}
            >
              {t.icon}
            </a>
          ))}
          <span aria-hidden className="px-2 text-zinc-300 dark:text-zinc-700">
            ·
          </span>
          <button
            type="button"
            onClick={copyPrompt}
            className="rounded-md px-2 py-1.5 text-xs font-medium text-zinc-500 transition hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
          >
            {copied ? "Copied ✓" : "Copy prompt"}
          </button>
        </div>
      </div>
    </section>
  );
}
