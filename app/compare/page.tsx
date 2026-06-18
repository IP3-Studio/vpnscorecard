import type { Metadata } from "next";
import { getAllVpns } from "@/lib/load";
import { scoreVpn } from "@/lib/scoring";
import { CompareTool } from "@/components/CompareTool";
import type { Row } from "@/components/ComparisonGrid";

export const metadata: Metadata = {
  title: "Compare side-by-side",
  description: "Compare up to four VPNs side-by-side across every criterion.",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ vpns?: string }>;
}) {
  const rows: Row[] = getAllVpns().map((vpn) => ({ vpn, score: scoreVpn(vpn) }));
  const { vpns } = await searchParams;
  const initialSlugs = (vpns ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => rows.some((r) => r.vpn.slug === s));
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Compare side-by-side</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        Pick up to four services to line them up across every criterion.
      </p>
      <CompareTool rows={rows} initialSlugs={initialSlugs} />
    </div>
  );
}
