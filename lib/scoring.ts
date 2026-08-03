import {
  CATEGORIES,
  CRITERIA,
  CRITERIA_BY_CATEGORY,
  type CategoryId,
  type Cell,
} from "./criteria";
import { SCORED_TYPES, type Vpn } from "./schema";

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

/**
 * Whether a service gets a head-to-head overall score. Two things disqualify:
 * a tool type that isn't a conventional traffic-routing provider, and any
 * documented integrity concern (see `concerns` in the schema).
 */
export function isScored(v: Vpn): boolean {
  return SCORED_TYPES.has(v.type) && v.concerns.length === 0;
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

  // Not scored: either the tool type isn't a conventional provider (device
  // meshes, decentralised networks), or there is a documented concern on
  // record. Individual cells are still shown, so the data stays useful.
  if (!isScored(v)) {
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
  if (score == null) return "n/a";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
