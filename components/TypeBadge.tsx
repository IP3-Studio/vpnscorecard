import type { Vpn } from "@/lib/schema";

export const TYPE_META: Record<
  Vpn["type"],
  { label: string; short: string; cls: string; blurb: string; notScoredReason?: string }
> = {
  provider: {
    label: "VPN provider",
    short: "Provider",
    cls: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
    blurb: "A conventional VPN that routes your traffic through the company's own servers.",
  },
  mixnet: {
    label: "Mixnet VPN",
    short: "Mixnet",
    cls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    blurb:
      "Routes traffic through a multi-hop mix network with cover traffic, resisting the traffic-correlation attacks ordinary VPNs can't.",
  },
  network: {
    label: "Network / Mesh",
    short: "Network / Mesh",
    cls: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
    blurb:
      "A decentralised anonymity network you route through (Tor onion routing, HOPR mixnet) or a private device mesh (Tailscale-style), rather than a commercial VPN provider. Listed but not scored head-to-head.",
    notScoredReason:
      "is a decentralised anonymity network or device mesh rather than a commercial VPN, so there's no provider no-logs policy, jurisdiction, or server network to rate on the conventional rubric",
  },
};

export function TypeBadge({
  type,
  className = "",
}: {
  type: Vpn["type"];
  className?: string;
}) {
  const m = TYPE_META[type];
  return (
    <span
      title={m.blurb}
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${m.cls} ${className}`}
    >
      {m.short}
    </span>
  );
}
