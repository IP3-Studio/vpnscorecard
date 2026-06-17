import type { Cell } from "@/lib/criteria";
import { VERDICT_STYLE, scoreText, scoreBg } from "@/lib/ui";

export function ScoreCell({
  cell,
  className = "",
}: {
  cell: Cell;
  className?: string;
}) {
  const s = VERDICT_STYLE[cell.verdict];
  return (
    <span
      title={s.label}
      className={`inline-flex items-center justify-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${s.cell} ${className}`}
    >
      <span aria-hidden className="opacity-70">
        {s.symbol}
      </span>
      <span className="whitespace-nowrap">{cell.display}</span>
    </span>
  );
}

export function ScoreBadge({
  score,
  className = "",
}: {
  score: number | null;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-baseline gap-0.5 font-mono font-semibold ${scoreText(score)} ${className}`}
    >
      <span className="text-lg leading-none">{score ?? "–"}</span>
      <span className="text-[10px] opacity-60">/100</span>
    </span>
  );
}

export function ScoreBar({ score }: { score: number | null }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
      <div
        className={`h-full rounded-full ${scoreBg(score)}`}
        style={{ width: `${score ?? 0}%` }}
      />
    </div>
  );
}
