"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, CRITERIA } from "@/lib/criteria";
import type { Vpn } from "@/lib/schema";
import type { VpnScore } from "@/lib/scoring";
import { ScoreCell, ScoreBadge } from "./ScoreCell";
import { TypeBadge, TYPE_META } from "./TypeBadge";

export interface Row {
  vpn: Vpn;
  score: VpnScore;
}

type SortKey = "overall" | "name" | string;

const QUICK_FILTERS: { id: string; label: string; test: (r: Row) => boolean }[] = [
  { id: "audited", label: "Audited", test: (r) => ["good", "partial"].includes(r.score.cells.audits.verdict) },
  { id: "opensource", label: "Open source", test: (r) => r.score.cells.openSource.verdict === "good" },
  { id: "wireguard", label: "WireGuard", test: (r) => r.score.cells.wireguard.verdict === "good" },
  { id: "nologs", label: "No traffic logs", test: (r) => r.score.cells.noLogsTraffic.verdict === "good" },
  { id: "noeyes", label: "Outside 14 Eyes", test: (r) => r.score.cells.jurisdiction.verdict === "good" },
  { id: "freetier", label: "Free tier", test: (r) => r.score.cells.freeTier.verdict === "good" },
];

export function ComparisonGrid({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Set<string>>(new Set());
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("overall");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState<Set<string>>(new Set());

  const visibleCriteria = useMemo(
    () => CRITERIA.filter((c) => !hidden.has(c.category)),
    [hidden],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rs = rows.filter((r) => {
      if (q) {
        const hay = `${r.vpn.name} ${r.vpn.jurisdiction.country}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      for (const f of QUICK_FILTERS) {
        if (filters.has(f.id) && !f.test(r)) return false;
      }
      if (typeFilter.size > 0 && !typeFilter.has(r.vpn.type)) return false;
      return true;
    });
    rs = [...rs].sort((a, b) => {
      let av: number | string | null;
      let bv: number | string | null;
      if (sortKey === "name") {
        av = a.vpn.name.toLowerCase();
        bv = b.vpn.name.toLowerCase();
      } else if (sortKey === "overall") {
        av = a.score.overall;
        bv = b.score.overall;
      } else {
        av = a.score.cells[sortKey]?.score ?? null;
        bv = b.score.cells[sortKey]?.score ?? null;
      }
      // nulls always sort last
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rs;
  }, [rows, query, filters, typeFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  function toggleSet(
    set: Set<string>,
    setter: (s: Set<string>) => void,
    id: string,
  ) {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  }

  const sortIcon = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : "";

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or country…"
            className="w-56 rounded-md border border-zinc-300 bg-background px-3 py-1.5 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
          />
          {QUICK_FILTERS.map((f) => {
            const on = filters.has(f.id);
            return (
              <button
                key={f.id}
                onClick={() => toggleSet(filters, setFilters, f.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  on
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-500">Type:</span>
          {(["provider", "mixnet", "mesh"] as const).map((t) => {
            const on = typeFilter.has(t);
            return (
              <button
                key={t}
                onClick={() => toggleSet(typeFilter, setTypeFilter, t)}
                title={TYPE_META[t].blurb}
                className={`rounded-full border px-3 py-1 font-medium transition ${
                  on
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {TYPE_META[t].short}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-500">Categories:</span>
          {CATEGORIES.map((c) => {
            const off = hidden.has(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleSet(hidden, setHidden, c.id)}
                className={`rounded px-2 py-0.5 font-medium transition ${
                  off
                    ? "text-zinc-400 line-through dark:text-zinc-600"
                    : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                }`}
              >
                {c.label}
              </button>
            );
          })}
          <span className="ml-auto text-zinc-500">
            {filtered.length} of {rows.length} services
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="thin-scroll overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th
                rowSpan={2}
                className="sticky left-0 z-20 min-w-[180px] bg-zinc-50 px-3 py-2 dark:bg-zinc-900"
              >
                <button
                  onClick={() => toggleSort("name")}
                  className="font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-200"
                >
                  VPN {sortIcon("name")}
                </button>
              </th>
              <th
                rowSpan={2}
                className="bg-zinc-50 px-3 py-2 text-center dark:bg-zinc-900"
              >
                <button
                  onClick={() => toggleSort("overall")}
                  className="font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-200"
                >
                  Overall {sortIcon("overall")}
                </button>
              </th>
              {CATEGORIES.filter((c) => !hidden.has(c.id)).map((c) => {
                const n = visibleCriteria.filter((cr) => cr.category === c.id).length;
                return (
                  <th
                    key={c.id}
                    colSpan={n}
                    className="border-l border-zinc-200 bg-zinc-50 px-3 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {c.label}
                  </th>
                );
              })}
            </tr>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              {visibleCriteria.map((cr, i) => {
                const firstInCat =
                  i === 0 || visibleCriteria[i - 1].category !== cr.category;
                return (
                  <th
                    key={cr.id}
                    title={cr.explain}
                    className={`bg-zinc-50 px-2 py-2 text-center align-bottom dark:bg-zinc-900 ${
                      firstInCat ? "border-l border-zinc-200 dark:border-zinc-800" : ""
                    }`}
                  >
                    <button
                      onClick={() => toggleSort(cr.id)}
                      className="whitespace-nowrap text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    >
                      {cr.short} {sortIcon(cr.id)}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.vpn.slug}
                className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/60 dark:border-zinc-800/60 dark:hover:bg-zinc-900/40"
              >
                <th
                  scope="row"
                  className="sticky left-0 z-10 min-w-[180px] bg-background px-3 py-2.5 text-left font-normal"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.has(r.vpn.slug)}
                      onChange={() => toggleSet(selected, setSelected, r.vpn.slug)}
                      aria-label={`Select ${r.vpn.name} to compare`}
                      className="accent-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/vpn/${r.vpn.slug}`}
                          className="font-semibold text-zinc-900 hover:text-emerald-600 dark:text-zinc-100 dark:hover:text-emerald-400"
                        >
                          {r.vpn.name}
                        </Link>
                        {r.vpn.type !== "provider" && <TypeBadge type={r.vpn.type} />}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {r.vpn.jurisdiction.country}
                      </div>
                    </div>
                  </div>
                </th>
                <td className="px-3 py-2.5 text-center">
                  <ScoreBadge score={r.score.overall} />
                </td>
                {visibleCriteria.map((cr, i) => {
                  const firstInCat =
                    i === 0 || visibleCriteria[i - 1].category !== cr.category;
                  return (
                    <td
                      key={cr.id}
                      className={`px-2 py-2.5 text-center ${
                        firstInCat ? "border-l border-zinc-100 dark:border-zinc-800/60" : ""
                      }`}
                    >
                      <ScoreCell cell={r.score.cells[cr.id]} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compare bar */}
      {selected.size >= 2 && (
        <div className="sticky bottom-4 z-20 mt-4 flex items-center justify-center">
          <Link
            href={`/compare?vpns=${[...selected].join(",")}`}
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-emerald-500"
          >
            Compare {selected.size} side-by-side →
          </Link>
        </div>
      )}
    </div>
  );
}
