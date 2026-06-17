import { z } from "zod";

/**
 * The data model for a single VPN service.
 *
 * Design notes:
 * - Every factual field can be `unknown` so we never have to guess. A record is
 *   only shown publicly when `verified: true` (see lib/load.ts).
 * - Fields are grouped to mirror the original "That One Privacy Guy" chart
 *   categories, but modernised (audits, open-source clients, RAM-only servers,
 *   kill switch, ownership transparency).
 * - Nested groups carry `.default({})` so JSON records can omit whole sections;
 *   the per-field `unknown` defaults then apply.
 */

/** Generic tri-state. `unknown` is excluded from scoring. */
export const Tri = z.enum(["yes", "no", "unknown"]);
/** Graded support, e.g. open-source clients (some apps OSS, some not). */
export const Support = z.enum(["yes", "partial", "no", "unknown"]);
/** Logging state for a data category. `none` is best, `yes` is worst. */
export const LogState = z.enum(["none", "some", "yes", "unknown"]);
/** Intelligence-sharing alliance of the operating jurisdiction. */
export const Eyes = z.enum(["none", "five", "nine", "fourteen", "unknown"]);
/** Lifecycle status. Only `active` services are scored/ranked. */
export const Status = z.enum(["active", "legacy", "defunct"]);

export const SourceSchema = z.object({
  label: z.string(),
  url: z.url(),
});
export type Source = z.infer<typeof SourceSchema>;

export const AuditSchema = z.object({
  firm: z.string(),
  year: z.number().int(),
  /** What was audited, e.g. "no-logs", "apps + infrastructure", "security". */
  scope: z.string(),
  url: z.url().optional(),
});
export type Audit = z.infer<typeof AuditSchema>;

export const VpnSchema = z.object({
  slug: z.string(),
  name: z.string(),
  website: z.url(),
  /** Short one-liner shown on cards and the detail header. */
  tagline: z.string().optional(),
  status: Status.default("active"),
  /** Gate for public display. Unverified records never appear as current. */
  verified: z.boolean().default(false),

  jurisdiction: z
    .object({
      country: z.string().default("Unknown"),
      eyes: Eyes.default("unknown"),
      enemyOfInternet: Tri.default("unknown"),
    })
    .prefault({}),

  company: z
    .object({
      parent: z.string().optional(),
      /** Conglomerate owner if any, e.g. "Kape Technologies", "Nord Security". */
      conglomerate: z.string().optional(),
      founded: z.number().int().optional(),
    })
    .prefault({}),

  logging: z
    .object({
      traffic: LogState.default("unknown"),
      dns: LogState.default("unknown"),
      timestamps: LogState.default("unknown"),
      bandwidth: LogState.default("unknown"),
      ip: LogState.default("unknown"),
      summary: z.string().optional(),
    })
    .prefault({}),

  privacy: z
    .object({
      /** Sign up with no email / no personal info. */
      anonymousSignup: Tri.default("unknown"),
      acceptsCash: Tri.default("unknown"),
      acceptsCrypto: Tri.default("unknown"),
      pgpKey: Tri.default("unknown"),
    })
    .prefault({}),

  technical: z
    .object({
      openvpn: Tri.default("unknown"),
      wireguard: Tri.default("unknown"),
      /** Name of an in-house protocol, e.g. "NordLynx", "Lightway". */
      proprietaryProtocol: z.string().optional(),
      multihop: Tri.default("unknown"),
      obfuscation: Tri.default("unknown"),
      killSwitch: Tri.default("unknown"),
      ownDns: Tri.default("unknown"),
      ramOnly: Tri.default("unknown"),
      portForwarding: Tri.default("unknown"),
      p2p: Tri.default("unknown"),
      ipv6: z.enum(["supported", "blocked", "leak", "unknown"]).default("unknown"),
    })
    .prefault({}),

  encryption: z
    .object({
      dataCipher: z.string().optional(),
      handshake: z.string().optional(),
    })
    .prefault({}),

  transparency: z
    .object({
      openSourceClients: Support.default("unknown"),
      audits: z.array(AuditSchema).default([]),
      transparencyReport: Tri.default("unknown"),
      /** No-logs proven by a real seizure/raid/subpoena that produced no data. */
      courtTested: Tri.default("unknown"),
      /** Real-world no-logs evidence, e.g. a server seizure or court outcome. */
      realWorldNoLog: z.string().optional(),
    })
    .prefault({}),

  infra: z
    .object({
      simultaneousConnections: z
        .union([z.number().int(), z.literal("unlimited")])
        .optional(),
      countries: z.number().int().optional(),
      servers: z.number().int().optional(),
      linux: z.enum(["gui", "cli", "none", "unknown"]).default("unknown"),
    })
    .prefault({}),

  // Website-privacy metrics (collected for later; not yet scored). Named
  // distinctly from the top-level `website` URL above.
  sitePrivacy: z
    .object({
      persistentCookies: z.number().int().optional(),
      trackers: z.number().int().optional(),
      sslRating: z.string().optional(),
    })
    .prefault({}),

  pricing: z
    .object({
      /** Month-to-month price in USD. */
      monthlyUsd: z.number().optional(),
      /** Effective $/month on the cheapest long-term plan. */
      bestPerMonthUsd: z.number().optional(),
      bestPlanTerm: z.string().optional(),
      freeTrialDays: z.number().int().optional(),
      refundDays: z.number().int().optional(),
      freeTier: Tri.default("unknown"),
    })
    .prefault({}),

  ethics: z
    .object({
      contradictoryLogging: Tri.default("unknown"),
      /** Markets itself as "100% anonymous / effective". */
      falseClaims: Tri.default("unknown"),
    })
    .prefault({}),

  bestFor: z.array(z.string()).default([]),
  notFor: z.array(z.string()).default([]),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  notes: z.string().optional(),

  /** ISO date (YYYY-MM-DD) the record was last verified against sources. */
  lastVerified: z.string().optional(),
  sources: z.array(SourceSchema).default([]),
});

export type Vpn = z.infer<typeof VpnSchema>;
