import { CRITERIA } from "./criteria";
import { scoreVpn } from "./scoring";
import type { Vpn } from "./schema";

/**
 * Transparent, rule-based "find my VPN" recommender (no LLM). It re-weights the
 * same criteria used for scoring, emphasising the ones the user cares about,
 * applies a budget filter, and explains every result.
 */

export type UseCase = "general" | "streaming" | "torrenting" | "activism";
export type Budget = "free" | "cheap" | "any";
export type PriorityId =
  | "openSource"
  | "audited"
  | "anonSignup"
  | "anonPayment"
  | "noEyes"
  | "obfuscation"
  | "freeOrCheap";

export interface Prefs {
  useCase: UseCase;
  budget: Budget;
  priorities: PriorityId[];
}

export interface Recommendation {
  vpn: Vpn;
  /** 0..100 personalised score. */
  score: number;
  reasons: string[];
  caveats: string[];
}

/** UI metadata for the quiz. */
export const USE_CASES: { id: UseCase; label: string; desc: string }[] = [
  { id: "general", label: "General privacy", desc: "Hide from your ISP and on public Wi-Fi." },
  { id: "streaming", label: "Streaming", desc: "Watch geo-restricted content reliably." },
  { id: "torrenting", label: "Torrenting / P2P", desc: "Leak-proof downloading." },
  { id: "activism", label: "High-risk / activism", desc: "Journalists, activists, censorship." },
];

export const BUDGETS: { id: Budget; label: string; desc: string }[] = [
  { id: "free", label: "Free only", desc: "Must have a genuine free tier." },
  { id: "cheap", label: "Budget", desc: "Around $5/mo or less." },
  { id: "any", label: "No limit", desc: "Pay for the best fit." },
];

export const PRIORITIES: { id: PriorityId; label: string; desc: string }[] = [
  { id: "openSource", label: "Open-source apps", desc: "Code you can inspect." },
  { id: "audited", label: "Independently audited", desc: "Claims checked by third parties." },
  { id: "anonSignup", label: "Anonymous signup", desc: "Create an account with no email or personal info." },
  { id: "anonPayment", label: "Anonymous payment", desc: "Pay with cash or cryptocurrency." },
  { id: "noEyes", label: "Outside 14 Eyes", desc: "Privacy-friendly jurisdiction." },
  { id: "obfuscation", label: "Beats censorship", desc: "Disguises VPN traffic." },
  { id: "freeOrCheap", label: "Easy on the wallet", desc: "Low price or free tier." },
];

const PRIORITY_CRITERIA: Record<PriorityId, string[]> = {
  openSource: ["openSource"],
  audited: ["audits"],
  anonSignup: ["anonymousSignup"],
  anonPayment: ["anonymousPayment"],
  noEyes: ["jurisdiction"],
  obfuscation: ["obfuscation"],
  freeOrCheap: ["price", "freeTier"],
};

const USECASE_CRITERIA: Record<UseCase, string[]> = {
  general: ["noLogsTraffic", "audits"],
  streaming: ["price", "obfuscation"],
  torrenting: ["killSwitch", "noLogsTraffic", "ownDns"],
  activism: [
    "jurisdiction",
    "noLogsTraffic",
    "noLogsMetadata",
    "audits",
    "obfuscation",
    "anonymousSignup",
    "anonymousPayment",
  ],
};

function passesBudget(v: Vpn, budget: Budget): boolean {
  if (budget === "free") return v.pricing.freeTier === "yes";
  if (budget === "cheap") return (v.pricing.bestPerMonthUsd ?? 99) <= 5.5;
  return true;
}

const EMPHASIS = 3;

export function recommend(vpns: Vpn[], prefs: Prefs): Recommendation[] {
  const emphasized = new Set<string>([
    ...prefs.priorities.flatMap((p) => PRIORITY_CRITERIA[p]),
    ...USECASE_CRITERIA[prefs.useCase],
  ]);

  return vpns
    .filter((v) => v.type !== "mesh") // mesh tools aren't traffic-routing providers
    .filter((v) => passesBudget(v, prefs.budget))
    .map((v) => {
      const { cells } = scoreVpn(v);
      let sum = 0;
      let wsum = 0;
      for (const cr of CRITERIA) {
        const cell = cells[cr.id];
        if (cell.score == null) continue;
        const w = cr.weight * (emphasized.has(cr.id) ? EMPHASIS : 1);
        sum += cell.score * w;
        wsum += w;
      }
      const score = wsum === 0 ? 0 : Math.round((sum / wsum) * 100);

      const reasons: string[] = [];
      const caveats: string[] = [];
      for (const id of emphasized) {
        const cr = CRITERIA.find((c) => c.id === id);
        const cell = cells[id];
        if (!cr || !cell) continue;
        if (cell.verdict === "good") reasons.push(cr.label);
        else if (cell.verdict === "bad") caveats.push(cr.label);
      }
      return { vpn: v, score, reasons, caveats };
    })
    .sort((a, b) => b.score - a.score);
}
