import type { Vpn } from "./schema";

/**
 * The single source of truth for what we measure and how it is scored.
 *
 * The comparison grid columns, the per-VPN scorecard, the overall/category
 * scores (lib/scoring.ts) and the public methodology page are ALL generated
 * from the registry below; there are no hidden numbers.
 */

export type CellVerdict = "good" | "partial" | "bad" | "neutral" | "unknown";

export interface Cell {
  verdict: CellVerdict;
  /** Compact text shown in the grid cell, e.g. "Yes", "5 Eyes", "$5.00". */
  display: string;
  /** 0..1 contribution to the score, or `null` to exclude from averages. */
  score: number | null;
}

export type CategoryId =
  | "privacy"
  | "technical"
  | "transparency"
  | "ethics";

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
  /** Relative weight in the overall score. The set is normalised at runtime. */
  weight: number;
}

export interface Criterion {
  id: string;
  label: string;
  /** Compact column header for the grid. */
  short: string;
  category: CategoryId;
  /** Relative weight within its category. */
  weight: number;
  /** Plain-English description rendered on the methodology page. */
  explain: string;
  evaluate: (v: Vpn) => Cell;
}

export const CATEGORIES: Category[] = [
  {
    id: "privacy",
    label: "Privacy",
    blurb:
      "Jurisdiction, logging policy, and how anonymously you can sign up and pay.",
    weight: 0.3,
  },
  {
    id: "technical",
    label: "Security",
    blurb: "Protocols, kill switch, and leak-resistance features.",
    weight: 0.2,
  },
  {
    id: "transparency",
    label: "Transparency",
    blurb:
      "Independent audits, open-source clients, and diskless infrastructure.",
    weight: 0.3,
  },
  {
    id: "ethics",
    label: "Ethics",
    blurb: "Honest marketing and consistent privacy claims.",
    weight: 0.1,
  },
];

// ---------------------------------------------------------------------------
// Cell helpers
// ---------------------------------------------------------------------------

const good = (display: string, score = 1): Cell => ({
  verdict: "good",
  display,
  score,
});
const bad = (display: string, score = 0): Cell => ({
  verdict: "bad",
  display,
  score,
});
const partial = (display: string, score = 0.5): Cell => ({
  verdict: "partial",
  display,
  score,
});
const neutral = (display: string): Cell => ({
  verdict: "neutral",
  display,
  score: null,
});
const UNKNOWN: Cell = { verdict: "unknown", display: "?", score: null };

type TriV = "yes" | "no" | "unknown";
type LogV = "none" | "some" | "yes" | "unknown";

/** A `yes` is good, a `no` is bad. */
function yesGood(v: TriV, yesText = "Yes", noText = "No"): Cell {
  if (v === "yes") return good(yesText);
  if (v === "no") return bad(noText);
  return UNKNOWN;
}

/** A `yes` is good, but a `no` is merely neutral (not a penalty). */
function yesBonus(v: TriV, yesText = "Yes", noText = "No"): Cell {
  if (v === "yes") return good(yesText);
  if (v === "no") return neutral(noText);
  return UNKNOWN;
}

function logCell(v: LogV): Cell {
  switch (v) {
    case "none":
      return good("None");
    case "some":
      return partial("Some", 0.4);
    case "yes":
      return bad("Logs");
    default:
      return UNKNOWN;
  }
}

/** Worst (most logged) of several logging fields. */
function worstLog(...vals: LogV[]): LogV {
  if (vals.includes("yes")) return "yes";
  if (vals.includes("some")) return "some";
  if (vals.every((v) => v === "none") && vals.length > 0) return "none";
  return "unknown";
}

function eyesCell(v: Vpn["jurisdiction"]["eyes"]): Cell {
  switch (v) {
    case "none":
      return good("None");
    case "fourteen":
      return partial("14 Eyes", 0.55);
    case "nine":
      return partial("9 Eyes", 0.4);
    case "five":
      return bad("5 Eyes", 0.25);
    default:
      return UNKNOWN;
  }
}

function openSourceCell(v: Vpn["transparency"]["openSourceClients"]): Cell {
  switch (v) {
    case "yes":
      return good("Yes");
    case "partial":
      return partial("Partial", 0.6);
    case "no":
      return bad("No");
    default:
      return UNKNOWN;
  }
}

function auditCell(audits: Vpn["transparency"]["audits"]): Cell {
  const n = audits.length;
  if (n === 0) return bad("None");
  const latest = Math.max(...audits.map((a) => a.year));
  return {
    verdict: n >= 2 ? "good" : "partial",
    display: `${n}× (${latest})`,
    score: n >= 2 ? 1 : 0.7,
  };
}

// ---------------------------------------------------------------------------
// Criteria registry
// ---------------------------------------------------------------------------

export const CRITERIA: Criterion[] = [
  // --- Privacy ---
  {
    id: "jurisdiction",
    label: "Jurisdiction",
    short: "Jurisdiction",
    category: "privacy",
    weight: 3,
    explain:
      "Whether the operating country belongs to the 5/9/14 Eyes intelligence-sharing alliances. Outside all three scores best.",
    evaluate: (v) => eyesCell(v.jurisdiction.eyes),
  },
  {
    id: "noLogsTraffic",
    label: "No traffic logs",
    short: "Traffic logs",
    category: "privacy",
    weight: 3,
    explain:
      "Does the provider record the contents or destinations of your traffic? `None` is required for a credible privacy tool.",
    evaluate: (v) => logCell(v.logging.traffic),
  },
  {
    id: "noLogsMetadata",
    label: "No connection metadata logs",
    short: "Metadata logs",
    category: "privacy",
    weight: 2,
    explain:
      "Connection metadata: DNS requests, timestamps, and source IP. Scored as the worst of the three.",
    evaluate: (v) =>
      logCell(worstLog(v.logging.dns, v.logging.timestamps, v.logging.ip)),
  },
  {
    id: "anonymousSignup",
    label: "Anonymous signup",
    short: "Anon signup",
    category: "privacy",
    weight: 2,
    explain: "Can you create an account with no email address or personal info?",
    evaluate: (v) => yesGood(v.privacy.anonymousSignup),
  },
  {
    id: "anonymousPayment",
    label: "Anonymous payment",
    short: "Anon payment",
    category: "privacy",
    weight: 1,
    explain: "Accepts cash and/or cryptocurrency for untraceable payment.",
    evaluate: (v) => {
      const cash = v.privacy.acceptsCash;
      const crypto = v.privacy.acceptsCrypto;
      if (cash === "yes" && crypto === "yes") return good("Cash + crypto");
      if (cash === "yes") return good("Cash");
      if (crypto === "yes") return good("Crypto");
      if (cash === "no" && crypto === "no") return bad("Cards only");
      return UNKNOWN;
    },
  },

  // --- Security ---
  {
    id: "wireguard",
    label: "WireGuard",
    short: "WireGuard",
    category: "technical",
    weight: 2,
    explain: "Offers the modern, fast, audited WireGuard protocol.",
    evaluate: (v) => yesGood(v.technical.wireguard),
  },
  {
    id: "openvpn",
    label: "OpenVPN",
    short: "OpenVPN",
    category: "technical",
    weight: 1,
    explain: "Offers the mature, widely-trusted OpenVPN protocol.",
    evaluate: (v) => yesGood(v.technical.openvpn),
  },
  {
    id: "killSwitch",
    label: "Kill switch",
    short: "Kill switch",
    category: "technical",
    weight: 2,
    explain: "Blocks all traffic if the VPN tunnel drops, preventing IP leaks.",
    evaluate: (v) => yesGood(v.technical.killSwitch),
  },
  {
    id: "multihop",
    label: "Multi-hop",
    short: "Multi-hop",
    category: "technical",
    weight: 1,
    explain: "Routes through two servers so no single server sees both ends.",
    evaluate: (v) => yesBonus(v.technical.multihop),
  },
  {
    id: "obfuscation",
    label: "Obfuscation",
    short: "Obfuscation",
    category: "technical",
    weight: 1,
    explain: "Disguises VPN traffic to bypass censorship and DPI blocking.",
    evaluate: (v) => yesBonus(v.technical.obfuscation),
  },
  {
    id: "ownDns",
    label: "First-party DNS",
    short: "Own DNS",
    category: "technical",
    weight: 1,
    explain: "Runs its own DNS resolvers rather than leaking queries to third parties.",
    evaluate: (v) => yesGood(v.technical.ownDns),
  },

  // --- Transparency ---
  {
    id: "openSource",
    label: "Open-source clients",
    short: "Open source",
    category: "transparency",
    weight: 3,
    explain:
      "Are the apps open source so the privacy claims can be independently inspected?",
    evaluate: (v) => openSourceCell(v.transparency.openSourceClients),
  },
  {
    id: "audits",
    label: "Independent audits",
    short: "Audits",
    category: "transparency",
    weight: 3,
    explain:
      "Published third-party audits of no-logs claims, apps, or infrastructure. Two or more scores best.",
    evaluate: (v) => auditCell(v.transparency.audits),
  },
  {
    id: "ramOnly",
    label: "RAM-only servers",
    short: "RAM-only",
    category: "transparency",
    weight: 1,
    explain: "Diskless servers that wipe all state on reboot.",
    evaluate: (v) => yesBonus(v.technical.ramOnly),
  },
  {
    id: "transparencyReport",
    label: "Transparency report",
    short: "Transparency",
    category: "transparency",
    weight: 1,
    explain: "Publishes a warrant canary or regular transparency report.",
    evaluate: (v) => yesBonus(v.transparency.transparencyReport),
  },
  {
    id: "courtTested",
    label: "Court / seizure-tested no-logs",
    short: "Battle-tested",
    category: "transparency",
    weight: 2,
    explain:
      "No-logs proven in the real world by a server seizure, police raid, or subpoena that produced no usable user data. Counts as a bonus only.",
    evaluate: (v) =>
      v.transparency.courtTested === "yes"
        ? good("Proven")
        : v.transparency.courtTested === "no"
          ? neutral("Untested")
          : UNKNOWN,
  },

  // --- Ethics ---
  {
    id: "noFalseClaims",
    label: "No false claims",
    short: "Honest copy",
    category: "ethics",
    weight: 1,
    explain:
      'Avoids misleading "100% anonymous / military-grade / total privacy" marketing.',
    evaluate: (v) =>
      v.ethics.falseClaims === "no"
        ? good("Clean")
        : v.ethics.falseClaims === "yes"
          ? bad("Overclaims")
          : UNKNOWN,
  },
  {
    id: "consistentLogging",
    label: "Consistent logging policy",
    short: "Consistent",
    category: "ethics",
    weight: 1,
    explain: "No contradictions between the marketing copy and the privacy policy.",
    evaluate: (v) =>
      v.ethics.contradictoryLogging === "no"
        ? good("Consistent")
        : v.ethics.contradictoryLogging === "yes"
          ? bad("Contradictory")
          : UNKNOWN,
  },
];

export const CRITERIA_BY_CATEGORY: Record<CategoryId, Criterion[]> =
  CATEGORIES.reduce(
    (acc, c) => {
      acc[c.id] = CRITERIA.filter((cr) => cr.category === c.id);
      return acc;
    },
    {} as Record<CategoryId, Criterion[]>,
  );
