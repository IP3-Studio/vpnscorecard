import type { Vpn } from "@/lib/schema";

/**
 * Documented-concern UI. A flagged service keeps its data cells (they are still
 * useful) but loses its overall score, and says plainly why.
 */

export function ConcernBadge({ className = "" }: { className?: string }) {
  return (
    <span
      title="Documented concerns on record. See the full report."
      className={`inline-flex items-center gap-1 rounded bg-rose-100 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 ${className}`}
    >
      ⚠ Concerns
    </span>
  );
}

export function ConcernPanel({ vpn }: { vpn: Vpn }) {
  if (vpn.concerns.length === 0) return null;
  return (
    <section className="mt-6 rounded-lg border border-rose-300 bg-rose-50 p-4 dark:border-rose-500/30 dark:bg-rose-500/5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-rose-800 dark:text-rose-300">
        ⚠ Documented concerns
      </h2>
      <p className="mt-1.5 text-sm text-zinc-700 dark:text-zinc-300">
        We don&apos;t give {vpn.name} an overall score. A proven logging breach, or an
        ownership history in adware or surveillance, is not something a good feature
        list should be able to average away. The data below is still shown in full so
        you can judge it yourself.
      </p>
      <ul className="mt-3 space-y-3">
        {vpn.concerns.map((c, i) => (
          <li key={i} className="text-sm">
            <div className="font-medium text-zinc-900 dark:text-zinc-100">
              {c.year ? `${c.year}: ` : ""}
              {c.label}
            </div>
            <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">{c.detail}</p>
            {c.url && (
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-block text-xs text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Source ↗
              </a>
            )}
          </li>
        ))}
      </ul>
      {vpn.mitigating.length > 0 && (
        <div className="mt-4 rounded-md border border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-500/25 dark:bg-emerald-500/5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
            What counts in their favour
          </h3>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-zinc-700 dark:text-zinc-300">
            {vpn.mitigating.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-3 text-xs text-zinc-500">
        Listing a concern is a statement about the documented record, not a claim about
        how the service behaves today. Where a provider has since changed owner,
        jurisdiction or policy, that is noted above and in the report below.
      </p>
    </section>
  );
}
