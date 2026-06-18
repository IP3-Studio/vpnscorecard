import type { Metadata } from "next";
import { getAllVpns } from "@/lib/load";
import { RecommendWizard } from "@/components/RecommendWizard";

export const metadata: Metadata = {
  title: "Find my VPN",
  description:
    "Answer a few questions and get a transparent, rule-based VPN recommendation with the reasons spelled out.",
};

export default function RecommendPage() {
  const vpns = getAllVpns();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Find my VPN</h1>
      <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Tell us what matters to you. We re-weight our published criteria
        accordingly and show the reasoning behind every result. It runs on a
        documented rubric you can read, and no result is paid placement.
      </p>
      <RecommendWizard vpns={vpns} />
    </div>
  );
}
