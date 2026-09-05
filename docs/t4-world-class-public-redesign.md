# T4 World-Class Public Redesign

## Scope

T4 redesigns the public patient experience on `mms/integration-next16-foundation`. It does not change internal Operations, Commission Control Centre, Partner Hub, authentication, database, deployment, feature-gate or production behavior.

The redesign covers the public shell, homepage, health journeys, memberships, treatment education, Health Intelligence, locations, international continuity, About MMS, medical-team placeholder state, Ling and supporting public orientation pages.

## Design System

- Editorial light/dark section rhythm replaces repetitive card grids.
- Image-led storytelling uses approved repository assets with responsive `next/image` sizing.
- Serif display headings, restrained gold accents and deep green/navy surfaces support an institutional healthcare tone.
- Lists, timelines and bordered editorial indexes are used when information hierarchy matters more than decorative containers.
- Hover enhancement is supplementary. Essential content remains visible without hover and with reduced motion.
- CTAs are limited to clear patient actions: understand, enquire, book or continue reading.

## Clinical And Content Boundaries

- Screening and discovery precede personalised recommendations.
- Treatments show purpose, evidence, uncertainty, suitability and professional-review boundaries.
- Medicine pricing remains verified-data-led and never fabricates comparisons.
- Regional care does not promise access, availability, importation, visas or suitability.
- Clinician profiles remain in a clearly labelled verification state until real names, qualifications, registrations, roles and photography are approved.
- Ling may explain, organise, navigate, prepare questions and route enquiries. Ling may not diagnose, prescribe, choose treatment, determine suitability, direct medicine changes, authorise importation or override clinical judgement.

## Asset Status

Current photography is drawn from existing MMS public assets. Final launch still requires approved, current photography of real facilities, clinicians and care teams plus documented image usage rights. Generic imagery must not be presented as evidence that a planned centre is operational.

## Compatibility

- Existing public route identities, aliases, sitemap source, canonical configuration and multilingual roots are preserved.
- EN remains the canonical complete public experience. MS, ZH and TH retain their approved partial status and safe English fallback.
- Public visual modules are not imported by protected internal console roots.
- Production feature gates remain default-off for unfinished surfaces.

## Validation

- The complete automated suite passes 173/173, including ten T4 structural checks.
- TypeScript and the production build pass on Next.js 16.3.4 and React 19.2.8.
- ESLint reports zero errors and only the six pre-existing Partner Hub warnings.
- Production-only and full dependency audits report zero vulnerabilities.
- The built client assets contain no database, operator-session, service-role, internal-token, reviewer-note or commercial-note markers.
- The generated application manifest remains at 163 entries. Because route sources and generated parameter registries are unchanged from the approved baseline, the expanded inventory remains 188 with zero additions and zero removals.
- Browser QA covers the homepage plus nine representative public templates at 1440, 1280, 768 and 390 pixels. All 40 checks return 200 with one H1, no console errors, no broken images and no horizontal overflow.
- Live interaction QA confirms homepage navigation, accessible mobile-menu dialog semantics, Escape dismissal, focus restoration and all four approved language choices.

## Performance Observations

- Public pages remain server components unless interaction requires a client boundary.
- Responsive `next/image` sizing is retained, with priority reserved for primary hero media.
- Long public pages use `content-visibility` with intrinsic sizing to reduce off-screen rendering work.
- Motion remains limited to short visual transitions and is disabled for reduced-motion preferences.

## Rollback

T4 is split into independently reversible commits. Revert the T4 commits in reverse order, beginning with the final T4.7 commit and ending with T4.1. Do not reset the branch or discard unrelated work.
