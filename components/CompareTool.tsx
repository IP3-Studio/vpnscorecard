"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, CRITERIA_BY_CATEGORY } from "@/lib/criteria";
import { ScoreCell, ScoreBadge } from "./ScoreCell";
import type { Row } from "./ComparisonGrid";

const MAX = 4;

export function CompareTool({
  rows,
  initialSlugs,
}: {
  rows: Row[];
  initialSlugs: string[];
}) {
  const [selected, setSelected] = useState<string[]>(
    initialSlugs.length > 0
      ? initialSlugs.slice(0, MAX)
      : rows.slice(0, Math.min(3, rows.length)).map((r) => r.vpn.slug),
  );

  function toggle(slug: string) {
    setSelected((cur) => {
      if (cur.includes(slug)) return cur.filter((s) => s !== slug);
      if (cur.length >= MAX) return cur;
      return [...cur, slug];
    });
  }

  const chosen = selected
    .map((slug) => rows.find((r) => r.vpn.slug === slug))
    .filter((r): r is Row => Boolean(r));

  return (
    <div className="mt-6">
      {/* Picker */}
      <div className="mb-6 flex flex-wrap gap-2">
        {rows.map((r) => {
          const on = selected.includes(r.vpn.slug);
          const full = !on && selected.length >= MAX;
          return (
            <button
              key={r.vpn.slug}
              onClick={() => toggle(r.vpn.slug)}
              disabled={full}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                on
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : full
                    ? "cursor-not-allowed border-zinc-200 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700"
                    : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
              }`}
            >
              {r.vpn.name}
            </button>
          );
        })}
      </div>

      {chosen.length === 0 ? (
        <p className="text-sm text-zinc-500">Select at least one VPN above.</p>
      ) : (
        <div className="thin-scroll overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="sticky left-0 z-10 min-w-[160px] bg-zinc-50 px-4 py-3 text-left dark:bg-zinc-900" />
                {chosen.map((r) => (
                  <th key={r.vpn.slug} className="min-w-[140px] bg-zinc-50 px-4 py-3 text-center dark:bg-zinc-900">
                    <Link
                      href={`/vpn/${r.vpn.slug}`}
                      className="font-semibold hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      {r.vpn.name}
                    </Link>
                    <div className="mt-1">
                      <ScoreBadge score={r.score.overall} />
                    </div>
                    <div className="text-[11px] text-zinc-500">{r.vpn.jurisdiction.country}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((cat) => (
                <CategoryBlock key={cat.id} catId={cat.id} label={cat.label} chosen={chosen} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CategoryBlock({
  catId,
  label,
  chosen,
}: {
  catId: (typeof CATEGORIES)[number]["id"];
  label: string;
  chosen: Row[];
}) {
  return (
    <>
      <tr className="bg-zinc-100/70 dark:bg-zinc-800/40">
        <td
          colSpan={chosen.length + 1}
          className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          {label}
        </td>
      </tr>
      {CRITERIA_BY_CATEGORY[catId].map((cr) => (
        <tr key={cr.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60">
          <th
            scope="row"
            title={cr.explain}
            className="sticky left-0 z-10 bg-background px-4 py-2.5 text-left font-normal text-zinc-600 dark:text-zinc-300"
          >
            {cr.label}
          </th>
          {chosen.map((r) => (
            <td key={r.vpn.slug} className="px-4 py-2.5 text-center">
              <ScoreCell cell={r.score.cells[cr.id]} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
