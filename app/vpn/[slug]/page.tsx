import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllSlugs, getVpnBySlug } from "@/lib/load";
import { scoreVpn } from "@/lib/scoring";
import { ScoreBadge, ScoreBar } from "@/components/ScoreCell";
import { DataSheet } from "@/components/DataSheet";
import { TypeBadge, TYPE_META } from "@/components/TypeBadge";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vpn = getVpnBySlug(slug);
  if (!vpn) return { title: "Not found" };
  return {
    title: vpn.name,
    description:
      vpn.tagline ??
      `Privacy, security, transparency, value and ethics breakdown for ${vpn.name}.`,
  };
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}

export default async function VpnPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vpn = getVpnBySlug(slug);
  if (!vpn) notFound();
  const score = scoreVpn(vpn);

  const devices =
    vpn.infra.simultaneousConnections === undefined
      ? "—"
      : String(vpn.infra.simultaneousConnections);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400"
      >
        ← All VPNs
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-start sm:justify-between dark:border-zinc-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{vpn.name}</h1>
            {vpn.type !== "provider" && <TypeBadge type={vpn.type} className="text-xs" />}
          </div>
          {vpn.tagline && (
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">{vpn.tagline}</p>
          )}
          <a
            href={vpn.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-emerald-600 hover:underline dark:text-emerald-400"
          >
            {vpn.website.replace(/^https?:\/\//, "")} ↗
          </a>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          {vpn.type === "mesh" ? (
            <span className="rounded-md bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              Mesh tool — not scored
            </span>
          ) : (
            <>
              <ScoreBadge score={score.overall} className="text-2xl" />
              <span className="text-xs text-zinc-500">Overall score</span>
            </>
          )}
        </div>
      </div>

      {/* Quick facts */}
      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4 lg:grid-cols-6">
        <Fact
          label="Jurisdiction"
          value={`${vpn.jurisdiction.country}${
            vpn.jurisdiction.eyes !== "none" && vpn.jurisdiction.eyes !== "unknown"
              ? ` (${vpn.jurisdiction.eyes} eyes)`
              : ""
          }`}
        />
        <Fact label="Founded" value={vpn.company.founded ? String(vpn.company.founded) : "—"} />
        <Fact label="Owner" value={vpn.company.parent ?? "—"} />
        <Fact
          label="Best price"
          value={
            vpn.pricing.bestPerMonthUsd != null
              ? `$${vpn.pricing.bestPerMonthUsd.toFixed(2)}/mo`
              : "—"
          }
        />
        <Fact label="Devices" value={devices} />
        <Fact label="Free tier" value={vpn.pricing.freeTier === "yes" ? "Yes" : "No"} />
      </dl>

      {/* Type explainer (mixnet / mesh) */}
      {vpn.type !== "provider" && (
        <p className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
          <span className="font-semibold">{TYPE_META[vpn.type].label}.</span>{" "}
          {TYPE_META[vpn.type].blurb}
        </p>
      )}

      {/* Category scores (providers + mixnet only) */}
      {vpn.type === "mesh" ? (
        <div className="mt-6 rounded-lg border border-violet-200 bg-violet-50/50 p-4 text-sm text-zinc-600 dark:border-violet-500/20 dark:bg-violet-500/5 dark:text-zinc-300">
          <strong>{vpn.name} is a mesh VPN</strong>, so we don&apos;t give it a head-to-head
          score. There&apos;s no provider no-logs policy, jurisdiction, or server network to
          rate — only your own devices, linked privately. The data sheet below shows what it
          does offer.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {score.categories.map((c) => (
            <div key={c.id} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">{c.label}</span>
                <span className="font-mono text-sm">{c.score ?? "–"}</span>
              </div>
              <div className="mt-2">
                <ScoreBar score={c.score} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Best for / Not for */}
      {(vpn.bestFor.length > 0 || vpn.notFor.length > 0) && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <h2 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Best for</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {vpn.bestFor.map((b) => (
                <li key={b}>· {b}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-500/20 dark:bg-rose-500/5">
            <h2 className="text-sm font-semibold text-rose-700 dark:text-rose-300">Not ideal for</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {vpn.notFor.map((b) => (
                <li key={b}>· {b}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Pros / Cons */}
      {(vpn.pros.length > 0 || vpn.cons.length > 0) && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-2 text-sm font-semibold">Strengths</h2>
            <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
              {vpn.pros.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-sm font-semibold">Weaknesses</h2>
            <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
              {vpn.cons.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-rose-500">✗</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Full data sheet (in the spirit of the original chart) */}
      <h2 className="mt-10 text-xl font-bold">Full data sheet</h2>
      <p className="mb-4 mt-1 text-sm text-zinc-500">
        Every attribute we track — coloured by whether it helps or hurts your privacy.
      </p>
      <DataSheet vpn={vpn} />

      {/* Audits */}
      {vpn.transparency.audits.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-2 text-lg font-bold">Independent audits</h2>
          <ul className="space-y-1.5 text-sm">
            {vpn.transparency.audits.map((a, i) => (
              <li key={i} className="flex flex-wrap items-center gap-x-2">
                <span className="font-medium">{a.firm}</span>
                <span className="text-zinc-500">· {a.year} · {a.scope}</span>
                {a.url && (
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline dark:text-emerald-400">
                    report ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {vpn.notes && (
        <p className="mt-6 rounded-lg bg-zinc-100 p-4 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
          {vpn.notes}
        </p>
      )}

      {/* Sources */}
      <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 className="mb-2 text-sm font-semibold">Sources</h2>
        <ul className="space-y-1 text-sm">
          {vpn.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline dark:text-emerald-400">
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
        {vpn.lastVerified && (
          <p className="mt-3 text-xs text-zinc-500">
            Last verified {vpn.lastVerified}. Point-in-time data — always confirm on the provider&apos;s own site.
          </p>
        )}
      </div>
    </div>
  );
}
