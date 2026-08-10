import Link from "next/link";
import { getAllVpns, getPendingCount } from "@/lib/load";
import { scoreVpn } from "@/lib/scoring";
import { ComparisonGrid, type Row } from "@/components/ComparisonGrid";
import { InfrastructureTable } from "@/components/InfrastructureTable";

export default function Home() {
  const vpns = getAllVpns();
  const rows: Row[] = vpns.map((vpn) => ({ vpn, score: scoreVpn(vpn) }));
  const pending = getPendingCount();

  // Networks and protocols first, then the consumer apps that people actually buy.
  const infraRows = rows.filter((r) => r.vpn.type !== "provider");
  const appRows = rows.filter((r) => r.vpn.type === "provider");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <section className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Which VPN actually protects your privacy?
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          An independent, transparent comparison of VPN tools across privacy,
          security, transparency, value and ethics. Every cell is scored by a{" "}
          <Link href="/methodology" className="text-emerald-600 underline-offset-2 hover:underline dark:text-emerald-400">
            published rubric
          </Link>{" "}
          and backed by primary sources. We take no money from the VPNs we list.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/recommend"
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Find my VPN →
          </Link>
          <Link
            href="/methodology"
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            How we score
          </Link>
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          {rows.length} services independently verified
          {pending > 0 && ` · ${pending} more being researched`}. Tip: tick two
          or more rows to compare them side-by-side.
        </p>
      </section>

      {/* Infrastructure: networks and protocols, not consumer subscriptions */}
      <section className="mb-12">
        <h2 className="text-xl font-bold tracking-tight">
          Infrastructure: mixnets, meshes, marketplaces and protocols
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
          These are networks, marketplaces and protocol frameworks rather than products
          you subscribe to. Some have independent apps built on top of them. There is no
          single company holding your traffic, so most of the VPN rubric (a provider
          no-logs policy, a jurisdiction, a server fleet) doesn&apos;t apply, and we list
          them without a head-to-head score. NymVPN is the exception: it sells a
          conventional subscription on top of its mixnet, so it is scored.
        </p>
        <div className="mt-4">
          <InfrastructureTable rows={infraRows} />
        </div>
      </section>

      {/* Consumer VPN apps */}
      <section>
        <h2 className="text-xl font-bold tracking-tight">VPN apps</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
          Conventional VPN services: you pay a company, and it routes your traffic
          through its own servers. Scored in full on the{" "}
          <Link
            href="/methodology"
            className="text-emerald-600 underline-offset-2 hover:underline dark:text-emerald-400"
          >
            published rubric
          </Link>
          .
        </p>
        <div className="mt-4">
          <ComparisonGrid rows={appRows} />
        </div>
      </section>

      <p className="mt-6 text-xs text-zinc-500">
        Legend: <span className="text-emerald-600 dark:text-emerald-400">✓ good</span>{" "}
        · <span className="text-amber-600 dark:text-amber-400">∼ partial</span> ·{" "}
        <span className="text-rose-600 dark:text-rose-400">✗ poor</span> · ? unknown.
        Scores exclude unknown values so missing data never inflates or sinks a
        rating. A{" "}
        <span className="font-semibold text-rose-600 dark:text-rose-400">⚠ Concerns</span>{" "}
        tag marks a service with a documented incident or ownership history on record;
        those are listed with sources and receive no overall score.
      </p>
    </div>
  );
}
