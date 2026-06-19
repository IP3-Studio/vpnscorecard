import type { ReactNode } from "react";
import type { Vpn } from "@/lib/schema";
import { PROTOCOLS, type ProtocolRating } from "@/lib/protocols";

const RATING_STYLE: Record<ProtocolRating, string> = {
  modern: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  trusted: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  legacy: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};
const RATING_LABEL: Record<ProtocolRating, string> = {
  modern: "Modern",
  trusted: "Trusted",
  legacy: "Legacy",
};

function KV({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-zinc-500">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}

function feat(v: string): { v: string; good: boolean | null } {
  if (v === "yes") return { v: "Yes", good: true };
  if (v === "no") return { v: "No", good: false };
  return { v: "Unknown", good: null };
}

export function ProtocolsEncryption({ vpn }: { vpn: Vpn }) {
  const t = vpn.technical;
  const offered = (["wireguard", "openvpn", "ikev2"] as const).filter((k) => t[k] === "yes");

  const ipv6Label = { supported: "Supported", blocked: "Blocked", leak: "Leaks", unknown: "Unknown" }[t.ipv6];

  const features: { k: string; v: string; good: boolean | null }[] = [];
  if (vpn.encryption.dataCipher) features.push({ k: "Stated data cipher", v: vpn.encryption.dataCipher, good: null });
  if (vpn.encryption.handshake) features.push({ k: "Stated handshake", v: vpn.encryption.handshake, good: null });
  features.push({
    k: "Perfect forward secrecy",
    v: offered.length > 0 ? "Yes" : "Unknown",
    good: offered.length > 0 ? true : null,
  });
  if (t.postQuantum !== "unknown") features.push({ k: "Post-quantum resistant", ...feat(t.postQuantum) });
  features.push({ k: "RAM-only servers", ...feat(t.ramOnly) });
  features.push({ k: "Kill switch", ...feat(t.killSwitch) });
  features.push({ k: "First-party DNS (leak protection)", ...feat(t.ownDns) });
  features.push({
    k: "IPv6",
    v: ipv6Label,
    good: t.ipv6 === "leak" ? false : t.ipv6 === "supported" ? true : null,
  });

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold">Protocols &amp; encryption</h2>
      <p className="mb-4 mt-1 text-sm text-zinc-500">
        The tunnelling protocols this service offers and the cryptography behind them.
      </p>

      {offered.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {offered.map((k) => {
            const p = PROTOCOLS[k];
            return (
              <div key={k} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{p.name}</h3>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${RATING_STYLE[p.rating]}`}>
                    {RATING_LABEL[p.rating]}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{p.summary}</p>
                <dl className="mt-3 space-y-1 text-xs">
                  <KV k="Data cipher" v={p.dataCipher} />
                  <KV k="Key exchange" v={p.keyExchange} />
                  <KV k="Integrity" v={p.integrity} />
                </dl>
              </div>
            );
          })}
        </div>
      )}

      {t.proprietaryProtocol && (
        <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50/40 p-4 text-sm dark:border-indigo-500/20 dark:bg-indigo-500/5">
          <span className="font-semibold">In-house protocol. </span>
          <span className="text-zinc-600 dark:text-zinc-300">{t.proprietaryProtocol}</span>
        </div>
      )}

      <div className="mt-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="border-b border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
          This provider&apos;s setup
        </div>
        <dl className="space-y-2 p-4 text-sm">
          {features.map((f) => (
            <KV
              key={f.k}
              k={f.k}
              v={
                <span
                  className={
                    f.good === true
                      ? "text-emerald-600 dark:text-emerald-400"
                      : f.good === false
                        ? "text-rose-600 dark:text-rose-400"
                        : ""
                  }
                >
                  {f.v}
                </span>
              }
            />
          ))}
        </dl>
      </div>
    </section>
  );
}
