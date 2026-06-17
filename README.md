# VPN Privacy Tests

An independent, **non-commercial** comparison of VPN tools — the way
[PrivacyTests.org](https://privacytests.org) compares browsers. Every VPN is
scored against a [published rubric](./lib/criteria.ts), every fact is backed by
a primary source, and the project carries **no affiliate links**.

A project of [IP3 Studio](https://github.com/IP3-Studio). Live site: _TBD_.

## Principles

- **No affiliate links, ever.** We take no money from the services we rank.
- **Sourced or unknown.** Every published value cites a source or is marked `unknown` — never guessed.
- **Transparent scoring.** The whole rubric is generated from one config and rendered on the [`/methodology`](./app/methodology/page.tsx) page.
- **Point-in-time honesty.** Every record carries a `lastVerified` date.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Zod. Statically
generated; deploys to Vercel with zero config.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-checks + validates data + static-generates
```

## How the data works

Each VPN is one JSON file in [`data/vpns/`](./data/vpns), validated at build
time against [`lib/schema.ts`](./lib/schema.ts). A record only appears on the
site when `verified: true`, and the build **fails** if a verified record lacks
`sources` or a `lastVerified` date.

To add or update a VPN:

1. Copy an existing file in `data/vpns/` (e.g. `mullvad.json`).
2. Fill in what you can verify from primary sources; leave anything uncertain as `"unknown"`.
3. Add `sources` (label + URL) and today's `lastVerified` date, then set `verified: true`.
4. `npm run build` to validate.

### Scoring

Hybrid and fully documented. Each criterion in [`lib/criteria.ts`](./lib/criteria.ts)
maps a field to a colour-coded cell worth 0–1; category scores are the weighted
mean of their criteria, and the overall score is the weighted mean of category
scores. `unknown`/`N-A` cells are excluded so missing data never skews a rating.
See [`/methodology`](./app/methodology/page.tsx).

## Project layout

| Path | What |
|------|------|
| `lib/schema.ts` | Zod schema + types for a VPN record |
| `lib/criteria.ts` | Criteria registry: labels, weights, cell evaluation |
| `lib/scoring.ts` | Category + overall score computation |
| `lib/recommend.ts` | Rule-based "find my VPN" recommender |
| `lib/load.ts` | Build-time loader + verified-only filter |
| `data/vpns/*.json` | One re-verified record per VPN |
| `data/raw/` | Seed material (the 2019 source chart) — not published as current |
| `components/ComparisonGrid.tsx` | Sortable/filterable home grid |
| `app/vpn/[slug]` · `app/compare` · `app/recommend` · `app/methodology` | Pages |

## Status

First batch of **6 verified services** (Mullvad, Proton VPN, IVPN, NordVPN,
Surfshark, Windscribe). More are added in batches as they are re-researched.

## Roadmap

- More verified VPNs (re-researching the full active set from primary sources).
- AI assistant — a Claude-powered, dataset-grounded chat (phase 2).
- Website-privacy and speed metrics (collected in the schema, not yet scored).

## Licensing

- **Code:** [MIT](./LICENSE).
- **Comparison data & framework:** adapted from
  [That One Privacy Site](https://thatoneprivacysite.net)'s VPN comparison chart
  under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
  In keeping with that licence, this project is non-commercial. Visual approach
  inspired by [PrivacyTests.org](https://privacytests.org).
