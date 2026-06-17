import type { ReactNode } from "react";
import type { Vpn } from "@/lib/schema";

/**
 * Comprehensive, "That One Privacy Guy"-style data sheet: every raw attribute
 * for one VPN, grouped, with good/bad colouring. Server component (no hooks).
 */

const GOOD = "text-emerald-600 dark:text-emerald-400";
const BAD = "text-rose-600 dark:text-rose-400";
const WARN = "text-amber-600 dark:text-amber-400";
const MUTE = "text-zinc-400 dark:text-zinc-500";

const dash = <span className={MUTE}>—</span>;

function tone(text: string, cls: string): ReactNode {
  return <span className={cls}>{text}</span>;
}

/** yes = good, no = neutral-bad, unknown = muted. */
function tri(v?: string): ReactNode {
  if (v === "yes") return tone("Yes", GOOD);
  if (v === "no") return tone("No", "text-zinc-600 dark:text-zinc-300");
  return tone("Unknown", MUTE);
}

/** For "bad if yes" attributes (enemy of internet, false claims, contradictions). */
function flagBadIfYes(v: string | undefined, yes: string, no: string): ReactNode {
  if (v === "yes") return tone(yes, BAD);
  if (v === "no") return tone(no, GOOD);
  return tone("Unknown", MUTE);
}

function logf(v?: string): ReactNode {
  if (v === "none") return tone("None kept", GOOD);
  if (v === "some") return tone("Some", WARN);
  if (v === "yes") return tone("Logged", BAD);
  return tone("Unknown", MUTE);
}

function eyesf(v?: string): ReactNode {
  switch (v) {
    case "none": return tone("Outside 5/9/14 Eyes", GOOD);
    case "fourteen": return tone("14 Eyes", WARN);
    case "nine": return tone("9 Eyes", WARN);
    case "five": return tone("5 Eyes", BAD);
    default: return tone("Unknown", MUTE);
  }
}

function supportf(v?: string): ReactNode {
  if (v === "yes") return tone("Yes — all apps", GOOD);
  if (v === "partial") return tone("Partial", WARN);
  if (v === "no") return tone("No", BAD);
  return tone("Unknown", MUTE);
}

function ipv6f(v?: string): ReactNode {
  if (v === "supported") return tone("Supported", GOOD);
  if (v === "blocked") return tone("Blocked", "text-zinc-600 dark:text-zinc-300");
  if (v === "leak") return tone("Leaks", BAD);
  return tone("Unknown", MUTE);
}

function linuxf(v?: string): ReactNode {
  if (v === "gui") return tone("GUI app", GOOD);
  if (v === "cli") return tone("CLI / config", "text-zinc-600 dark:text-zinc-300");
  if (v === "none") return tone("No", BAD);
  return tone("Unknown", MUTE);
}

function txt(v?: string | number): ReactNode {
  return v == null || v === "" ? dash : <span>{v}</span>;
}
function money(v?: number): ReactNode {
  return v == null ? dash : <span>${v.toFixed(2)}</span>;
}
function days(v?: number): ReactNode {
  return v == null ? dash : <span>{v === 0 ? "None" : `${v} days`}</span>;
}

interface Row {
  k: string;
  v: ReactNode;
}
interface Group {
  title: string;
  rows: Row[];
  note?: string;
}

function build(vpn: Vpn): Group[] {
  const sim = vpn.infra.simultaneousConnections;
  return [
    {
      title: "Company & jurisdiction",
      rows: [
        { k: "Based in", v: txt(vpn.jurisdiction.country) },
        { k: "Eyes alliance", v: eyesf(vpn.jurisdiction.eyes) },
        { k: "Enemy of the Internet", v: flagBadIfYes(vpn.jurisdiction.enemyOfInternet, "Yes", "No") },
        { k: "Owner", v: txt(vpn.company.parent) },
        { k: "Conglomerate", v: txt(vpn.company.conglomerate) },
        { k: "Founded", v: txt(vpn.company.founded) },
      ],
    },
    {
      title: "Logging",
      note: vpn.logging.summary,
      rows: [
        { k: "Traffic / activity", v: logf(vpn.logging.traffic) },
        { k: "DNS requests", v: logf(vpn.logging.dns) },
        { k: "Timestamps", v: logf(vpn.logging.timestamps) },
        { k: "Bandwidth", v: logf(vpn.logging.bandwidth) },
        { k: "Source IP address", v: logf(vpn.logging.ip) },
      ],
    },
    {
      title: "Payment & anonymity",
      rows: [
        { k: "Anonymous signup", v: tri(vpn.privacy.anonymousSignup) },
        { k: "Accepts cash", v: tri(vpn.privacy.acceptsCash) },
        { k: "Accepts crypto", v: tri(vpn.privacy.acceptsCrypto) },
        { k: "PGP key", v: tri(vpn.privacy.pgpKey) },
      ],
    },
    {
      title: "Protocols & features",
      rows: [
        { k: "OpenVPN", v: tri(vpn.technical.openvpn) },
        { k: "WireGuard", v: tri(vpn.technical.wireguard) },
        { k: "Proprietary protocol", v: txt(vpn.technical.proprietaryProtocol) },
        { k: "Multi-hop", v: tri(vpn.technical.multihop) },
        { k: "Obfuscation", v: tri(vpn.technical.obfuscation) },
        { k: "Kill switch", v: tri(vpn.technical.killSwitch) },
        { k: "First-party DNS", v: tri(vpn.technical.ownDns) },
        { k: "RAM-only servers", v: tri(vpn.technical.ramOnly) },
        { k: "Port forwarding", v: tri(vpn.technical.portForwarding) },
        { k: "P2P / torrenting", v: tri(vpn.technical.p2p) },
        { k: "IPv6", v: ipv6f(vpn.technical.ipv6) },
      ],
    },
    {
      title: "Encryption",
      rows: [
        { k: "Data cipher", v: txt(vpn.encryption.dataCipher) },
        { k: "Handshake", v: txt(vpn.encryption.handshake) },
      ],
    },
    {
      title: "Transparency",
      note: vpn.transparency.realWorldNoLog,
      rows: [
        { k: "Open-source clients", v: supportf(vpn.transparency.openSourceClients) },
        { k: "Independent audits", v: vpn.transparency.audits.length ? tone(String(vpn.transparency.audits.length), GOOD) : tone("None", BAD) },
        { k: "Transparency report", v: tri(vpn.transparency.transparencyReport) },
        { k: "Court / seizure-tested", v: vpn.transparency.courtTested === "yes" ? tone("Proven", GOOD) : vpn.transparency.courtTested === "no" ? tone("Untested", "text-zinc-600 dark:text-zinc-300") : tone("Unknown", MUTE) },
      ],
    },
    {
      title: "Infrastructure",
      rows: [
        { k: "Simultaneous devices", v: txt(typeof sim === "number" ? sim : sim === "unlimited" ? "Unlimited" : undefined) },
        { k: "Countries", v: txt(vpn.infra.countries) },
        { k: "Servers", v: txt(vpn.infra.servers) },
        { k: "Linux support", v: linuxf(vpn.infra.linux) },
      ],
    },
    {
      title: "Pricing",
      rows: [
        { k: "Month-to-month", v: money(vpn.pricing.monthlyUsd) },
        { k: "Best $/mo", v: money(vpn.pricing.bestPerMonthUsd) },
        { k: "On plan", v: txt(vpn.pricing.bestPlanTerm) },
        { k: "Free trial", v: days(vpn.pricing.freeTrialDays) },
        { k: "Refund window", v: days(vpn.pricing.refundDays) },
        { k: "Free tier", v: tri(vpn.pricing.freeTier) },
      ],
    },
    {
      title: "Ethics",
      rows: [
        { k: "Logging policy", v: flagBadIfYes(vpn.ethics.contradictoryLogging, "Contradictory", "Consistent") },
        { k: "Marketing honesty", v: flagBadIfYes(vpn.ethics.falseClaims, "Overclaims", "No overclaiming") },
      ],
    },
  ];
}

export function DataSheet({ vpn }: { vpn: Vpn }) {
  const groups = build(vpn);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {groups.map((g) => (
        <div key={g.title} className="rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
            {g.title}
          </div>
          <table className="w-full text-sm">
            <tbody>
              {g.rows.map((row) => (
                <tr key={row.k} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/50">
                  <td className="px-4 py-1.5 text-zinc-500">{row.k}</td>
                  <td className="px-4 py-1.5 text-right font-medium">{row.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {g.note && (
            <p className="border-t border-zinc-100 px-4 py-2 text-xs leading-relaxed text-zinc-500 dark:border-zinc-800/50">
              {g.note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
