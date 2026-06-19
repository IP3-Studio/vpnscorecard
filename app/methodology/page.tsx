import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, CRITERIA_BY_CATEGORY } from "@/lib/criteria";
import { TypeBadge } from "@/components/TypeBadge";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How VPN Scorecard scores and ranks VPNs: the exact criteria, weights, verification policy, licensing and limitations.",
};

export default function MethodologyPage() {
  const totalCatWeight = CATEGORIES.reduce((s, c) => s + c.weight, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Methodology</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Our scoring is <strong>hybrid</strong>: every VPN is evaluated against a
        fixed list of criteria, each criterion becomes a colour-coded cell worth
        0–1, category scores are the weighted average of their criteria, and the
        overall score is the weighted average of category scores. There are no
        hidden numbers. This page is generated from the same configuration that
        powers the grid.
      </p>

      {/* Tool types */}
      <h2 className="mt-10 text-xl font-bold">Three kinds of tool</h2>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        Not everything called a &ldquo;VPN&rdquo; is the same product, and scoring
        them on one scale would mislead. We tag each tool by type, and only the
        traffic-routing ones are ranked against each other:
      </p>
      <div className="mt-3 space-y-3 text-sm">
        <div className="flex gap-3">
          <TypeBadge type="provider" className="mt-0.5 shrink-0" />
          <p className="text-zinc-600 dark:text-zinc-400">
            <strong>Provider.</strong> A conventional VPN that routes your traffic
            through the company&apos;s own servers (Mullvad, Proton, IVPN…). Scored in full.
          </p>
        </div>
        <div className="flex gap-3">
          <TypeBadge type="mixnet" className="mt-0.5 shrink-0" />
          <p className="text-zinc-600 dark:text-zinc-400">
            <strong>Mixnet.</strong> Routes traffic through a multi-hop mix network
            with cover traffic that resists the traffic-correlation attacks ordinary
            VPNs can&apos;t (e.g. NymVPN). Still a traffic-routing service, so it&apos;s
            scored on the same rubric.
          </p>
        </div>
        <div className="flex gap-3">
          <TypeBadge type="mesh" className="mt-0.5 shrink-0" />
          <p className="text-zinc-600 dark:text-zinc-400">
            <strong>Mesh.</strong> Links your <em>own</em> devices privately,
            Tailscale-style (e.g. NostrVPN), with no traffic-exit provider. There is no
            provider no-logs policy, jurisdiction, or server network to rate, so we{" "}
            <strong>list mesh tools but don&apos;t give them a head-to-head score</strong>.
            Comparing one to NordVPN would be apples to oranges.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800">
        <h2 className="font-semibold">How a cell is scored</h2>
        <ul className="mt-2 space-y-1 text-zinc-600 dark:text-zinc-400">
          <li><span className="text-emerald-600 dark:text-emerald-400">✓ Good</span>: meets the bar (score 1.0).</li>
          <li><span className="text-amber-600 dark:text-amber-400">∼ Partial</span>: partially meets it (0.25 to 0.6).</li>
          <li><span className="text-rose-600 dark:text-rose-400">✗ Poor</span>: fails it (score 0).</li>
          <li>? Unknown or N/A: <strong>excluded</strong> from averages, so missing data never inflates or sinks a score.</li>
        </ul>
      </div>

      {/* Category weights */}
      <h2 className="mt-10 text-xl font-bold">Category weights</h2>
      <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-sm">
          <tbody>
            {CATEGORIES.map((c) => (
              <tr key={c.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60">
                <td className="px-4 py-2.5 font-medium">{c.label}</td>
                <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">{c.blurb}</td>
                <td className="px-4 py-2.5 text-right font-mono">
                  {Math.round((c.weight / totalCatWeight) * 100)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Criteria per category */}
      <h2 className="mt-10 text-xl font-bold">Criteria</h2>
      <div className="mt-3 space-y-6">
        {CATEGORIES.map((cat) => {
          const crs = CRITERIA_BY_CATEGORY[cat.id];
          const totalW = crs.reduce((s, c) => s + c.weight, 0);
          return (
            <div key={cat.id}>
              <h3 className="mb-2 font-semibold">{cat.label}</h3>
              <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-sm">
                  <tbody>
                    {crs.map((cr) => (
                      <tr key={cr.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60">
                        <td className="w-44 px-4 py-2.5 align-top font-medium">{cr.label}</td>
                        <td className="px-4 py-2.5 align-top text-zinc-600 dark:text-zinc-400">{cr.explain}</td>
                        <td className="w-16 px-4 py-2.5 text-right align-top font-mono text-zinc-500">
                          {Math.round((cr.weight / totalW) * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verification */}
      <h2 className="mt-10 text-xl font-bold">Verification policy</h2>
      <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
        <li>· A VPN appears on the site <strong>only</strong> once we have re-verified it against primary sources. Unverified or legacy data is never shown as current.</li>
        <li>· Every published record carries a <code>lastVerified</code> date and a list of sources, enforced at build time.</li>
        <li>· Anything we cannot confirm is marked <em>unknown</em> rather than guessed.</li>
        <li>· The data reflects a point in time. VPNs change pricing, ownership and policies often, so always confirm on the provider&apos;s own site.</li>
      </ul>

      {/* What we don't (yet) measure */}
      <h2 className="mt-10 text-xl font-bold">What we don&apos;t (yet) score</h2>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        Price, refund windows and free tiers are shown for context but kept out of
        the score: cheaper isn&apos;t safer, and rewarding low prices would distort a
        privacy comparison. Connection speed is excluded too, because it is volatile,
        route- and time-dependent, and easily gamed by marketing. Website-privacy
        metrics (trackers, cookies) are collected in our schema but not yet scored.
      </p>

      {/* Licensing */}
      <h2 className="mt-10 text-xl font-bold">Attribution &amp; licence</h2>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        The comparison framework is adapted from{" "}
        <a href="https://thatoneprivacysite.net" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline dark:text-emerald-400">
          That One Privacy Site
        </a>
        &apos;s VPN comparison chart, used under the{" "}
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline dark:text-emerald-400">
          Creative Commons BY-NC-SA 4.0
        </a>{" "}
        licence. In keeping with that licence and our own principles, this site
        is <strong>non-commercial and carries no affiliate links</strong>. We are
        not paid by, and do not accept money from, any VPN we rank. The visual
        approach is inspired by{" "}
        <a href="https://privacytests.org" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline dark:text-emerald-400">
          PrivacyTests.org
        </a>
        .
      </p>

      <p className="mt-8 text-sm">
        <Link href="/" className="text-emerald-600 hover:underline dark:text-emerald-400">
          ← Back to the comparison
        </Link>
      </p>
    </div>
  );
}
