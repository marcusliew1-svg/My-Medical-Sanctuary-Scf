# T6.43 — Partner Hub Package Comparison

**Status:** IMPLEMENTED — PREVIEW VALIDATION PENDING  
**Scope:** Preview/integration only. Production/main remain untouched.

## Gap closed

The Phase 1 Partner Hub architecture requires a package-comparison capability. The current integration branch already contains authenticated Partner Hub access, Academy, Presentation Centre, lead workflows, applications and commission surfaces, but did not expose a dedicated package-comparison page.

## Implementation

T6.43 adds:

- authenticated `/partner-hub/package-comparison`;
- comparison across the four existing membership pathways from the canonical `src/data/memberships.ts` source;
- access note, intended audience, coordination model and typical first-30-day pathway;
- explicit commercial-vs-clinical boundary language;
- instruction to rely on current approved Presentation Centre materials where commercial wording changes;
- Partner Hub navigation entry.

## Source-of-truth rule

No new package names, prices, inclusions, clinical claims or eligibility rules are introduced in T6.43.

The page consumes the existing membership data source already used by the website. Pricing and clinical suitability are intentionally not inferred or invented.

## Boundaries

T6.43 does not:

- determine medical suitability;
- expose patient or clinical records;
- create or change membership pricing;
- alter commission rules;
- activate Production;
- bypass Presentation Centre approval controls.

## Validation required

Before merge to `mms/integration-next16-foundation`:

1. Vercel Preview reaches READY.
2. TypeScript/build pass.
3. Authenticated Partner Hub layout still protects the route.
4. Package comparison renders all four current membership pathways.
5. Production/main remain untouched.
