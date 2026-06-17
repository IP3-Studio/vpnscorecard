"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  recommend,
  USE_CASES,
  BUDGETS,
  PRIORITIES,
  type UseCase,
  type Budget,
  type PriorityId,
} from "@/lib/recommend";
import type { Vpn } from "@/lib/schema";
import { ScoreBadge } from "./ScoreCell";

export function RecommendWizard({ vpns }: { vpns: Vpn[] }) {
  const [useCase, setUseCase] = useState<UseCase>("general");
  const [budget, setBudget] = useState<Budget>("any");
  const [priorities, setPriorities] = useState<Set<PriorityId>>(new Set());

  const results = useMemo(
    () => recommend(vpns, { useCase, budget, priorities: [...priorities] }),
    [vpns, useCase, budget, priorities],
  );

  function togglePriority(id: PriorityId) {
    const next = new Set(priorities);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPriorities(next);
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
      {/* Controls */}
      <div className="space-y-6">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">What will you use it for?</legend>
          <div className="grid gap-2">
            {USE_CASES.map((u) => (
              <label
                key={u.id}
                className={`cursor-pointer rounded-lg border p-3 text-sm transition ${
                  useCase === u.id
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800"
                }`}
              >
                <input
                  type="radio"
                  name="usecase"
                  className="sr-only"
                  checked={useCase === u.id}
                  onChange={() => setUseCase(u.id)}
                />
                <div className="font-medium">{u.label}</div>
                <div className="text-xs text-zinc-500">{u.desc}</div>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Budget</legend>
          <div className="flex gap-2">
            {BUDGETS.map((b) => (
              <button
                key={b.id}
                onClick={() => setBudget(b.id)}
                className={`flex-1 rounded-lg border p-2 text-center text-xs transition ${
                  budget === b.id
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800"
                }`}
              >
                <div className="font-medium">{b.label}</div>
                <div className="text-[11px] text-zinc-500">{b.desc}</div>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Must-haves</legend>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map((p) => {
              const on = priorities.has(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePriority(p.id)}
                  title={p.desc}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    on
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Results */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-zinc-500">
          {results.length > 0
            ? `Ranked for you (${results.length})`
            : "No services match that budget yet"}
        </h2>
        <ol className="space-y-3">
          {results.map((r, i) => (
            <li
              key={r.vpn.slug}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm text-zinc-400">#{i + 1}</span>
                  <Link
                    href={`/vpn/${r.vpn.slug}`}
                    className="text-lg font-semibold hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {r.vpn.name}
                  </Link>
                  <span className="text-xs text-zinc-500">{r.vpn.jurisdiction.country}</span>
                </div>
                <div className="text-right">
                  <ScoreBadge score={r.score} />
                  <div className="text-[10px] text-zinc-500">match</div>
                </div>
              </div>
              {r.vpn.tagline && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{r.vpn.tagline}</p>
              )}
              {(r.reasons.length > 0 || r.caveats.length > 0) && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.reasons.map((x) => (
                    <span key={x} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      ✓ {x}
                    </span>
                  ))}
                  {r.caveats.map((x) => (
                    <span key={x} className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                      ✗ {x}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
        {results.length === 0 && (
          <p className="text-sm text-zinc-500">
            Try widening your budget — only some services have a free tier or sub-$5 pricing.
          </p>
        )}
      </div>
    </div>
  );
}
