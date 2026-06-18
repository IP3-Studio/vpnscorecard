import type { Vpn } from "@/lib/schema";

export const TYPE_META: Record<
  Vpn["type"],
  { label: string; short: string; cls: string; blurb: string }
> = {
  provider: {
    label: "VPN provider",
    short: "Provider",
    cls: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
    blurb: "Routes your traffic through the company's own servers — a conventional VPN.",
  },
  mixnet: {
    label: "Mixnet VPN",
    short: "Mixnet",
    cls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    blurb:
      "Routes traffic through a multi-hop mix network with cover traffic — resists the traffic-correlation attacks ordinary VPNs can't.",
  },
  mesh: {
    label: "Mesh VPN",
    short: "Mesh",
    cls: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    blurb:
      "Links your own devices privately (Tailscale-style). Not a traffic-exit provider, so it isn't scored head-to-head with VPN services.",
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
