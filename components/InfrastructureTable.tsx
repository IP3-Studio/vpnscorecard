import Link from "next/link";
import { ScoreCell, ScoreBadge } from "./ScoreCell";
import { TypeBadge } from "./TypeBadge";
import type { Row } from "./ComparisonGrid";

/**
 * Networks and protocols rather than consumer VPN subscriptions: mixnets, device
 * meshes and decentralised infrastructure. Most of the VPN-app rubric (refunds,
 * server counts, provider no-logs policies) simply doesn't apply, so this table
 * carries only the columns that mean something here.
 */

const COLUMNS: { id: string; label: string; title: string }[] = [
  { id: "openSource", label: "Open source", title: "Is the code open to inspection?" },
  { id: "multihop", label: "Multi-hop", title: "Routes through more than one hop, so no single node sees both ends." },
  { id: "anonymousSignup", label: "Anon signup", title: "Can you use it with no email or personal info?" },
  { id: "anonymousPayment", label: "Anon payment", title: "Accepts cash and/or cryptocurrency." },
];

export function InfrastructureTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null;

  return (
    <div>
      {/* Cards (mobile + tablet) */}
      <div className="space-y-3 lg:hidden">
        {rows.map(({ vpn, score }) => (
          <div
            key={vpn.slug}
            className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Link
                    href={`/vpn/${vpn.slug}`}
                    className="font-semibold hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {vpn.name}
                  </Link>
                  <TypeBadge type={vpn.type} />
                </div>
                <div className="text-[11px] text-zinc-500">{vpn.jurisdiction.country}</div>
              </div>
              <ScoreBadge score={score.overall} />
            </div>
            {vpn.tagline && (
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">{vpn.tagline}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {COLUMNS.map((c) => (
                <span key={c.id} className="flex items-center gap-1">
                  <span className="text-zinc-500">{c.label}:</span>
                  <ScoreCell cell={score.cells[c.id]} />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Table (desktop) */}
      <div className="thin-scroll hidden overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 lg:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="min-w-[170px] bg-zinc-50 px-3 py-2 font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                Network
              </th>
              <th className="min-w-[280px] bg-zinc-50 px-3 py-2 font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                What it is
              </th>
              {COLUMNS.map((c) => (
                <th
                  key={c.id}
                  title={c.title}
                  className="whitespace-nowrap border-l border-zinc-200 bg-zinc-50 px-3 py-2 text-center text-[11px] font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {c.label}
                </th>
              ))}
              <th className="border-l border-zinc-200 bg-zinc-50 px-3 py-2 text-center font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ vpn, score }) => (
              <tr
                key={vpn.slug}
                className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/60 dark:border-zinc-800/60 dark:hover:bg-zinc-900/40"
              >
                <th scope="row" className="px-3 py-2.5 text-left font-normal align-top">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link
                      href={`/vpn/${vpn.slug}`}
                      className="font-semibold text-zinc-900 hover:text-emerald-600 dark:text-zinc-100 dark:hover:text-emerald-400"
                    >
                      {vpn.name}
                    </Link>
                    <TypeBadge type={vpn.type} />
                  </div>
                  <div className="text-[11px] text-zinc-500">{vpn.jurisdiction.country}</div>
                </th>
                <td className="px-3 py-2.5 align-top text-xs text-zinc-600 dark:text-zinc-400">
                  {vpn.tagline}
                </td>
                {COLUMNS.map((c) => (
                  <td
                    key={c.id}
                    className="border-l border-zinc-100 px-3 py-2.5 text-center align-top dark:border-zinc-800/60"
                  >
                    <ScoreCell cell={score.cells[c.id]} />
                  </td>
                ))}
                <td className="border-l border-zinc-100 px-3 py-2.5 text-center align-top dark:border-zinc-800/60">
                  <ScoreBadge score={score.overall} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
