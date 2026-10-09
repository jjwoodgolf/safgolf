# Project rules

- Shared public-page building blocks live in `src/components/site/` (PageHeader, Section, DonateBand, PlaybookCTA, PhotoGallery, photos registry, org facts) — keeps headers, CTAs and claims consistent across pages.
- `Layout` renders the bottom donation band and mobile donate bar on every public page; pass `hideDonateBand` only on the donate flow — guarantees a donation CTA everywhere without per-page duplication.
- Every public factual claim and photo must be listed in `docs/SAF-content-sources.md` — prevents unverified copy from reaching donors.
- Legacy `/programs/*` duplicates redirect to canonical pages rather than being deleted — preserves old inbound links.
