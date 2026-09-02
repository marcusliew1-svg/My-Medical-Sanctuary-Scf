# T3 Wave 4 Multilingual Integration

## Scope and readiness

| Locale | Status | Public scope |
| --- | --- | --- |
| English (`en`) | READY | The authoritative and complete public experience. |
| Bahasa Malaysia (`ms`) | PARTIAL | Regional home plus eight reviewed navigation summaries. Detailed clinical pages and interactive Ling remain English. |
| Simplified Chinese (`zh-CN`) | PARTIAL | Regional home plus eight reviewed navigation summaries. Detailed clinical pages and interactive Ling remain English. |
| Thai (`th`) | PARTIAL | Regional home plus eight reviewed navigation summaries. Detailed clinical pages and interactive Ling remain English. |

The selector does not imply full-site translation. Each regional page declares `data-locale-status="partial"`, includes medical-information boundaries and links explicitly to the full English route. No runtime machine translation is used.

## Historical inventory

| Area | Classification | Wave 4 decision |
| --- | --- | --- |
| Locale scope and translated copy | KEEP | Preserve the historical `ms`, `zh` and `th` scope and its eight patient-path summaries. |
| Regional root routes | ALREADY PRESENT / ADAPT | Retain `/ms`, `/zh` and `/th`; replace their unqualified Ling embed with the honest partial regional experience. |
| Dynamic regional section routes | ADAPT | Selectively port and convert to strict Next 16 Promise params, static params and locale metadata. |
| Language switcher | ADAPT | Implement against current navigation, preserve safe attribution only, and fall back to a locale root for unsupported pages. |
| Historical navigation and public design | DROP / SUPERSEDED | Current MMS information architecture and components remain authoritative. |
| Historical site configuration and sitemap | DROP / SUPERSEDED | Extend current `siteConfig`, `siteRoutes` and sitemap instead of creating parallel registries. |
| Historical request API assumptions | DROP / SUPERSEDED | Sync-or-Promise route props were replaced with strict Next 16 async props. |
| Medical detail, treatment claims and condition pages | MANUAL REVIEW | No new high-risk translation. Use explicit English fallback until medical-language review. |
| Ling medical answers | MANUAL REVIEW | Only safe navigation copy is regionalised. The Ling interaction and medical-answer boundary are unchanged. |
| Forms | ADAPT | Regional contact summaries link to the English canonical form so display translation cannot mutate backend enums. |
| Health Intelligence | ALREADY PRESENT | Public and internal products remain English; medicine names and matching semantics are not translated. |
| Internal consoles | ALREADY PRESENT | Operations, Commission Control Centre and internal Health Intelligence remain English and are not duplicated. |
| Referral cookie | ALREADY PRESENT | The authoritative proxy remains unchanged; site-wide cookie scope persists across locale paths. |

## Authoritative routing

`src/lib/siteRoutes.ts` is the public route, navigation and sitemap source. `src/lib/i18nRouting.ts` adds only the regional locale mechanics and maps eight approved regional sections to their existing English destinations. Canonical host selection remains exclusively in `src/lib/siteConfig.ts`.

Supported regional sections are: Ling, memberships, treatments, health concerns, clinics, medical tourism, online doctor and contact. There are no locale-prefixed internal, portal, checkout, prototype, partner or Health Intelligence routes.

## Fallback behavior

- A supported translated section switches to the corresponding section in another supported locale.
- An unsupported English page switches to the selected locale root, never a fabricated translated URL.
- Switching back to English from a regional section returns its canonical English page.
- Unknown regional section URLs do not resolve.
- Detailed clinical content, the complete Ling experience and the enquiry form remain on clearly labelled English routes.
- Only `ref` and approved `utm_*` values are copied during a client-side language switch. Authentication tokens and arbitrary query data are discarded. The server-owned referral cookie persists independently.

## SEO

Regional roots and approved sections have self-canonicals derived from `https://www.scf.center` through central configuration. Reciprocal alternates use `en`, `ms`, `zh-CN`, `th` and English `x-default`. The sitemap includes alternates only for routes with real regional variants; untranslated public pages receive no misleading hreflang.

## Security and forms

Feature-gate evaluation removes a known regional prefix before matching protected route prefixes. This is defense in depth against paths such as `/ms/operations`, `/zh/partner-hub` and `/th/internal/health-intelligence`; no localized protected route is generated.

The public enquiry continues sending stable English canonical values and the existing consent version. Regional contact pages link to that form rather than storing translated enum values. Rate limiting, body validation and server-side honeypot validation remain intact; Wave 4 restores the matching hidden honeypot field in the client form.

## Known limitations requiring manual review

- The root HTML document language remains English because this integration does not introduce locale layouts or request-time rewrites. Regional page content is correctly marked with a `lang` attribute. A later architecture decision can introduce per-locale root documents if required without weakening static routing.
- Clinical detail, high-risk therapies, condition content and Ling medical answers are not translated.
- Form labels and consent text are English until legal and medical translation review approves locale-native forms.
- Regional summaries require native-speaker and medical-language sign-off before they can be described as fully translated experiences.

## Validation checkpoint

- Pre-wave recovery point: `44530ded8880a0ff4d36c5bf6987c2feb07bcb02`.
- Original route inventory: 153 manifest entries and 157 expanded routes.
- Final route inventory: 156 manifest entries and 181 expanded routes.
- Additions: three locale section route patterns and 24 statically generated regional section variants.
- Existing regional roots `/ms`, `/zh` and `/th` were preserved and adapted; they are not new route additions.
- Removed routes: 0. Redirects introduced: 0. Existing aliases are unchanged.
- Automated tests: 113 passed, including 18 targeted multilingual tests.
- Typecheck and production build: passed.
- Lint: 0 errors; seven unchanged Partner Hub warnings.
- Production and full dependency audits: 0 vulnerabilities.
- Responsive QA: passed at 1440px desktop, 820px tablet and 390px mobile with no overflow, broken images, failed requests, console errors or framework overlays.
