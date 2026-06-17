import type { CellVerdict } from "./criteria";

/** Shared, client-safe styling maps for verdicts and scores. */

export const VERDICT_STYLE: Record<
  CellVerdict,
  { cell: string; chip: string; symbol: string; label: string }
> = {
  good: {
    cell: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    chip: "bg-emerald-500",
    symbol: "✓",
    label: "Good",
  },
  partial: {
    cell: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    chip: "bg-amber-500",
    symbol: "∼",
    label: "Partial",
  },
  bad: {
    cell: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    chip: "bg-rose-500",
    symbol: "✗",
    label: "Poor",
  },
  neutral: {
    cell: "bg-zinc-50 text-zinc-500 dark:bg-zinc-800/40 dark:text-zinc-400",
    chip: "bg-zinc-400",
    symbol: "–",
    label: "N/A",
  },
  unknown: {
    cell: "bg-zinc-50 text-zinc-400 dark:bg-zinc-800/40 dark:text-zinc-500",
    chip: "bg-zinc-300 dark:bg-zinc-700",
    symbol: "?",
    label: "Unknown",
  },
};

export function scoreText(score: number | null): string {
  if (score == null) return "text-zinc-400";
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 65) return "text-lime-600 dark:text-lime-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

export function scoreBg(score: number | null): string {
  if (score == null) return "bg-zinc-300 dark:bg-zinc-700";
  if (score >= 80) return "bg-emerald-500";
  if (score >= 65) return "bg-lime-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-500";
}
