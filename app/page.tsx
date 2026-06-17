import Link from "next/link";
import { getAllVpns, getPendingCount } from "@/lib/load";
import { scoreVpn } from "@/lib/scoring";
import { ComparisonGrid, type Row } from "@/components/ComparisonGrid";

export default function Home() {
  const vpns = getAllVpns();
  const rows: Row[] = vpns.map((vpn) => ({ vpn, score: scoreVpn(vpn) }));
  const pending = getPendingCount();

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
          and backed by primary sources — and we take no affiliate money.
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

      <ComparisonGrid rows={rows} />

      <p className="mt-6 text-xs text-zinc-500">
        Legend: <span className="text-emerald-600 dark:text-emerald-400">✓ good</span>{" "}
        · <span className="text-amber-600 dark:text-amber-400">∼ partial</span> ·{" "}
        <span className="text-rose-600 dark:text-rose-400">✗ poor</span> · ? unknown.
        Scores exclude unknown values so missing data never inflates or sinks a
        rating.
      </p>
    </div>
  );
}
