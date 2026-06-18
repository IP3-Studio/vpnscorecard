import {
  CATEGORIES,
  CRITERIA,
  CRITERIA_BY_CATEGORY,
  type CategoryId,
  type Cell,
} from "./criteria";
import type { Vpn } from "./schema";

/**
 * Hybrid scoring: every criterion is evaluated into a 0..1 cell (criteria.ts),
 * category scores are the weighted mean of their criteria, and the overall
 * score is the weighted mean of category scores. `unknown`/`neutral` cells
 * (score === null) are excluded so missing data never drags a score down.
 */

export interface CategoryScore {
  id: CategoryId;
  label: string;
  /** 0..100, or null when the VPN has no scored criteria in this category. */
  score: number | null;
}

export interface VpnScore {
  /** 0..100 overall, or null if nothing could be scored. */
  overall: number | null;
  categories: CategoryScore[];
  /** criterionId -> evaluated cell, reused by the grid and scorecards. */
  cells: Record<string, Cell>;
}

function weightedMean(
  pairs: { score: number | null; weight: number }[],
): number | null {
  let sum = 0;
  let wsum = 0;
  for (const p of pairs) {
    if (p.score == null) continue;
    sum += p.score * p.weight;
    wsum += p.weight;
  }
  return wsum === 0 ? null : sum / wsum;
}

export function scoreVpn(v: Vpn): VpnScore {
  const cells: Record<string, Cell> = {};
  for (const cr of CRITERIA) cells[cr.id] = cr.evaluate(v);

  // Mesh VPNs link your own devices; they aren't traffic-routing providers, so
  // we don't assign a comparable score — only the data sheet is shown.
  if (v.type === "mesh") {
    return {
      overall: null,
      categories: CATEGORIES.map((c) => ({ id: c.id, label: c.label, score: null })),
      cells,
    };
  }

  const categories: CategoryScore[] = CATEGORIES.map((cat) => {
    const mean = weightedMean(
      CRITERIA_BY_CATEGORY[cat.id].map((cr) => ({
        score: cells[cr.id].score,
        weight: cr.weight,
      })),
    );
    return {
      id: cat.id,
      label: cat.label,
      score: mean == null ? null : Math.round(mean * 100),
    };
  });

  const overallMean = weightedMean(
    categories.map((c) => ({
      score: c.score == null ? null : c.score / 100,
      weight: CATEGORIES.find((x) => x.id === c.id)!.weight,
    })),
  );

  return {
    overall: overallMean == null ? null : Math.round(overallMean * 100),
    categories,
    cells,
  };
}

/** A→F letter grade for a 0..100 score, for compact display. */
export function grade(score: number | null): string {
  if (score == null) return "–";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
