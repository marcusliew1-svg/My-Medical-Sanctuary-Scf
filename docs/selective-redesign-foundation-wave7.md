# T3 Wave 7: Selective Redesign Foundation

## Boundary and source review

Wave 7 compares the integration recovery point `a8ddc4c128b83e8df6a493e44a6281c2762ce468` with `origin/mms-warm-sophisticated-home`, `origin/visual-refresh-phase2` and `origin/ux-trust-membership-batch`. These historical public redesign sources predate the Next 16, security, multilingual, enquiry, Partner Auth, Operations, Commission and Health Intelligence integration work. They are therefore visual references, not merge sources.

Public design primitives are intentionally isolated from Operations, Commission Control Centre, Partner Hub, internal Health Intelligence, operator authentication and privileged administration. No internal module imports the Wave 7 public visual layer.

## Source inventory and decisions

| Area | Historical source | Decision | Wave 7 result |
| --- | --- | --- | --- |
| Design tokens | Scattered CSS and Tailwind literals | ADAPT | Central public colour, spacing, radius, motion and focus tokens added without replacing internal styles. |
| Typography | Playfair Display and Inter | REUSE | Existing `next/font` loading and serif/sans hierarchy retained. No new font request or licence risk. |
| Colours | Midnight, green, ivory, champagne and gold | ADAPT | Current medically credible palette retained; salmon placeholder and neon treatments remain excluded. |
| Spacing | Large editorial section spacing | ADAPT | Shared section and container primitives establish consistent mobile-first spacing and line length. |
| Header | Historical public header | REBUILD | Current secure branch header rebuilt around the approved primary/right/utility hierarchy. |
| Mobile navigation | Historical overlay menu | REBUILD | Existing dialog retained and upgraded with focus containment, focus restoration, body scroll lock and 44px targets. |
| Footer | Historical multi-column footer | ADAPT | Approved primary, utility, Ling and legal destinations now share the authoritative route model. |
| Section shells | Mixed per-page wrappers | REBUILD | `PublicSectionShell` and `PublicContainer` provide restrained, reusable public bands. |
| Buttons | Duplicated pill-button classes | REBUILD | One CTA class authority now serves `CTAButton` and `ButtonLink`; hierarchy is small and rectangular with restrained radius. |
| Cards | Repeated oversized rounded panels | DROP / ADAPT | Card-heavy conventions are not ported. Existing homepage image features use restrained framing and editorial dividers. |
| Hero | Image-led public hero | REUSE / ADAPT | Current full-bleed hero retained with meaningful image alt text and justified priority loading. |
| Images | Next Image with per-component crops | ADAPT | Shared editorial image primitive supports responsive sizes, crop position, lazy loading and optional priority. |
| Layout primitives | Historical page-specific grids | REBUILD | Shared max-width container and light/dark section rhythm added. |
| Animation utilities | Global DOM observer, ambient orbs, scroll line | DROP | Global selectors, decorative orbs and scroll manipulation rejected. Only restrained image transition remains; reduced motion disables it. |
| Icon system | Decorative bespoke symbols | DROP | No new icon dependency or decorative icon layer introduced in foundation scope. |
| Homepage sections | Older monolithic redesign | ADAPT | Current homepage story and route-safe components retained; shell can support the approved T4 sequence without adding sections now. |
| Programmes | Historical marketing cards | DROP | No programme page redesign in Wave 7. Shared foundation is available for T4. |
| Treatments | Historical image tiles | DROP | No treatment or medical-copy redesign in Wave 7. Existing route identity and claims controls remain. |
| Health Intelligence | Historical editorial presentation | ADAPT | Only compatible public visual primitives retained. Matching, review, source, ingestion and redaction logic are unchanged. |
| Locations | Historical visual tiles | ADAPT | Current status-aware location model retained with calmer image framing. No operational claims added. |
| Ling | Avatar-heavy presentation | DROP | No avatar-led product redesign. Ling remains a restrained concierge/navigation destination. |
| Forms | Historical visual forms | DROP | Wave 5 validation, honeypot, consent, rate limits, canonical values and duplicate-submit protection remain authoritative. |
| Multilingual presentation | Absent from historical branch | REUSE | Current EN/MS/ZH/TH switcher and locale-safe routing retained in desktop and mobile navigation. |
| Accessibility | Partial menu semantics | REBUILD | Visible focus, semantic dialog, keyboard loop, Escape, focus restoration, tap targets and reduced motion are explicit. |
| Responsive behaviour | Historical broad breakpoints | ADAPT | Header breakpoint, text wrapping, image sizes and shared padding support 1440, 1280, 768 and 390 review widths. |

## Public design foundation

- **Colour:** midnight teal/navy and MMS green anchor trust; ivory and stone provide breathing room; bronze/gold is an accent and focus colour, not a dominant fill.
- **Typography:** Playfair Display is reserved for editorial headings. Inter remains the body and interface typeface. Body copy uses controlled measure and generous line height.
- **Spacing:** public bands use consistent mobile, tablet and desktop spacing through shared shells rather than nested cards.
- **CTA hierarchy:** primary for consultation or journey entry, secondary/dark for institutional actions, outline/light for lower emphasis. Ordinary navigation remains text.
- **Images:** one shared primitive provides stable dimensions, crop control, responsive `sizes`, lazy loading by default and explicit priority only when required.
- **Motion:** 180–280ms transitions with a restrained easing curve. No shimmer, particles, ambient orbs, spinning objects or page-wide observers. `prefers-reduced-motion` removes transitions and smooth scrolling.
- **Accessibility:** 44px minimum navigation targets, visible focus rings, mobile dialog semantics, focus containment/restoration, Escape handling and body scroll lock.

## Homepage and T4 readiness

Wave 7 does not add or finalise the thirteen future homepage sections. It preserves the current hero, trust, health-goal, care-method, location, programme, My Sanctuary, Health Intelligence and final CTA story while moving those sections onto reusable public shells. The foundation can support the approved T4 sequence without changing public URLs or prematurely expanding copy.

## Preserved contracts

- Existing public routes, canonical metadata, hreflang, sitemap, robots and JSON-LD remain unchanged.
- Production/default-off gates for My Sanctuary, Partner Hub/Auth, prototype, checkout and internal applications remain authoritative.
- Contact and enquiry implementation is not modified.
- Health Intelligence data, evidence, reviewer and commercial boundaries are not modified.
- No Production, Supabase, migration, DNS, secret or environment change is part of Wave 7.
- Generated route inventory remains 163 manifest entries and 188 expanded routes, with zero additions and zero removals from the approved recovery point.

## Known limitations

- Existing public pages still contain page-specific layout and colour literals that should be migrated selectively during T4, not by a broad mechanical rewrite.
- Final photography, full multilingual page copy and final thirteen-section homepage composition remain T4 work.
- Current image assets are treated as approved placeholders unless separately confirmed as final production photography.
