import fs from "node:fs";
import path from "node:path";
import { VpnSchema, type Vpn } from "./schema";

/**
 * Loads VPN records from data/vpns/*.json at build time, validates each against
 * the Zod schema, and exposes only verified+active records for public display.
 *
 * All pages are statically generated, so these synchronous fs reads run during
 * `next build`, never on a request.
 */

const DATA_DIR = path.join(process.cwd(), "data", "vpns");

let cache: Vpn[] | null = null;

function readAll(): Vpn[] {
  if (cache) return cache;
  let files: string[] = [];
  try {
    files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  } catch {
    files = [];
  }
  const vpns: Vpn[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf8");
    const parsed = VpnSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      throw new Error(
        `Invalid VPN record "${file}":\n${JSON.stringify(parsed.error.format(), null, 2)}`,
      );
    }
    // Build-time integrity guard: a published record must cite its work.
    if (parsed.data.verified) {
      if (parsed.data.sources.length === 0) {
        throw new Error(`Verified record "${file}" has no sources.`);
      }
      if (!parsed.data.lastVerified) {
        throw new Error(`Verified record "${file}" has no lastVerified date.`);
      }
    }
    vpns.push(parsed.data);
  }
  cache = vpns;
  return vpns;
}

/** Verified, active VPNs (the only ones shown publicly), sorted by name. */
export function getAllVpns(): Vpn[] {
  return readAll()
    .filter((v) => v.verified && v.status === "active")
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getVpnBySlug(slug: string): Vpn | undefined {
  return getAllVpns().find((v) => v.slug === slug);
}

export function getAllSlugs(): string[] {
  return getAllVpns().map((v) => v.slug);
}

/** Count of records still awaiting verification (for an honest "coming soon"). */
export function getPendingCount(): number {
  return readAll().filter((v) => !v.verified || v.status !== "active").length;
}
