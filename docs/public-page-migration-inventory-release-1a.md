# Public Page Migration Inventory - Release 1A

This inventory records current public-route direction without changing page content.

| Route | Current purpose | Current metadata | SEO value/risk | Medical-claims risk | Future MMS destination | Action |
|---|---|---|---|---|---|---|
| `/` | Main public front door and positioning page. | `Preventive Care • Personalised Longevity` | High value; currently draft and visually unfinished. | Medium, broad preventive/longevity positioning needs clinical review. | Public homepage. | REDESIGN |
| `/about-mms` | Institutional story, trust and philosophy. | `About MMS` | High value for brand trust. | Low-medium, must avoid invented facilities/licences. | About MMS. | REDESIGN |
| `/why-mms` | Alternative trust/philosophy page. | Shared editorial metadata helper. | Duplicate/overlap risk with About and Our Philosophy. | Low-medium. | Merge into About / Philosophy. | MERGE |
| `/our-philosophy` | Prevention-first philosophy page. | Shared editorial metadata helper. | Useful, but overlaps About/How It Works. | Low-medium. | Our Approach or About. | MERGE |
| `/how-it-works` | Patient journey explanation. | `Our Approach` | High value for conversion. | Low if kept process-focused. | Our Approach / How MMS Works. | REDESIGN |
| `/health-journey` | Older patient journey route. | Shared editorial metadata helper. | Moderate; overlaps How It Works. | Low-medium. | Redirect or merge into How It Works. | MERGE |
| `/health-discovery` | Discovery-first explanation. | `Health Discovery` | Good long-tail conversion value. | Low. | Discovery / Contact funnel. | KEEP |
| `/health-screening` | Screening-first education and CTA. | `Health Screening` | High SEO value. | Medium; diagnostic wording needs careful review. | Health Screening. | REDESIGN |
| `/preventive-care` | Preventive care service education. | Shared editorial metadata helper. | Good SEO value. | Medium. | Preventive Care. | REWRITE_MEDICALLY |
| `/longevity-medicine` | Longevity education. | Shared editorial metadata helper. | Good SEO value but sensitive. | Medium-high, longevity claims need strong evidence boundaries. | Longevity Medicine. | REWRITE_MEDICALLY |
| `/weight-management` | Weight/metabolic service education. | Shared editorial metadata helper. | Good SEO value. | Medium, treatment implication risk. | Weight Management. | REWRITE_MEDICALLY |
| `/iv-therapy` | IV therapy education. | Shared editorial metadata helper. | Moderate SEO value, advertising-sensitive. | High, must avoid overpromising. | Advanced Care education. | REWRITE_MEDICALLY |
| `/treatments` | Treatment education hub. | `Treatments Explained` | High future hub value; current category needs stronger medical governance. | High due advanced treatment topics. | Health Intelligence / Advanced Care. | REWRITE_MEDICALLY |
| `/treatments/[slug]` | Individual treatment explainers. | Dynamic treatment metadata. | High long-tail value; index currently gated. | High. | Clinically reviewed treatment education. | REWRITE_MEDICALLY |
| `/treatments/research` | Research-oriented treatment index. | Noindex by default. | Useful internally, risky public if unreviewed. | High. | Clinically reviewed evidence library. | PRIVATE/GATE |
| `/health-concerns` | Condition/concern hub. | Noindex by default. | High long-tail future SEO value. | High if symptom pages imply diagnosis. | Health Intelligence after medical review. | REWRITE_MEDICALLY |
| `/health-concerns/[slug]` | Individual health concern pages. | Dynamic noindex by default. | High future SEO value. | High. | Clinician-reviewed education. | REWRITE_MEDICALLY |
| `/memberships` | Membership programme continuum. | `Memberships` | High conversion value. | Low-medium; avoid public prices/outcome promises. | Memberships. | REDESIGN |
| `/membership` | Legacy/singular membership route. | Unknown/legacy route. | Duplicate risk. | Low-medium. | Redirect to `/memberships`. | REDIRECT |
| `/membership-checkout` | Payment preparation surface. | Noindex. | Low public SEO; unfinished commercial route. | Medium commercial/compliance risk. | Authenticated/payment flow later. | PRIVATE/GATE |
| `/international-medicine-access` | Medicine price/access intelligence positioning. | `International Medicine Access Intelligence` | High commercial and SEO opportunity; requires legal/pharmacy review. | High if it appears to sell medicine directly. | Public discovery + private review workflow later. | REWRITE_MEDICALLY |
| `/medicine-intelligence` | Alias/export of medicine access page. | Same as international medicine access. | Duplicate route risk. | High. | Canonical to international medicine access or future Medicine Intelligence hub. | MERGE |
| `/malaysia-thailand-care` | Regional care access route. | `Malaysia Thailand Care` style page. | Good ASEAN positioning. | Medium; jurisdictional claims need review. | Regional Care Access. | REDESIGN |
| `/medical-tourism` | Future medical tourism page. | Medical tourism metadata. | Moderate future value. | Medium-high. | Care Travel / Regional Care. | REWRITE_MEDICALLY |
| `/scf-lab-roadmap` | Future lab capability explanation. | `SCF Lab Roadmap` | Good investor/credibility context if carefully bounded. | Medium-high if misunderstood as current capability. | Future Capability / SCF Roadmap. | KEEP |
| `/ling` | Ling education companion page. | `Ling` | High brand differentiation. | Medium; AI medical boundary must stay explicit. | Ling. | REDESIGN |
| `/api/ling` | Educational route suggestion placeholder. | API route. | Not SEO. | Medium if future AI enabled without safety review. | Server AI only after approval. | PRIVATE/GATE for production AI |
| `/education` | Education landing page. | `Education` | Moderate, overlaps Knowledge Hub/Insights. | Medium. | Health Intelligence. | MERGE |
| `/knowledge-hub` | Knowledge hub. | Knowledge metadata. | Moderate; naming overlap. | Medium. | Health Intelligence. | MERGE |
| `/health-articles` | Blog/article listing. | Health Articles. | Good future SEO. | Medium. | Health Intelligence articles. | REDESIGN |
| `/insights` | Health Intelligence page. | `Health Intelligence` | High future content hub value. | Medium-high until reviewed. | Health Intelligence. | REDESIGN |
| `/media-room` | Video/media placeholder. | Media Room. | Moderate. | Low-medium. | Health Intelligence / Media. | KEEP |
| `/clinics` | Location/clinic positioning. | `Clinics` | High local SEO potential; should not invent addresses/status. | Medium if facilities are overstated. | Locations. | REWRITE_MEDICALLY |
| `/corporate-executive-wellness` | Corporate wellness offering. | Corporate Executive Wellness. | Good B2B SEO. | Medium. | Corporate Wellness. | REDESIGN |
| `/corporate-wellness` | Corporate wellness route. | Corporate Wellness. | Duplicate/overlap risk. | Medium. | Corporate Wellness. | MERGE |
| `/professional-alliance-programme` | Partner recruitment. | Professional Alliance Programme. | Good recruitment value; compliance-sensitive. | Medium commercial/compliance risk. | Professional Alliance. | REWRITE_MEDICALLY |
| `/join-mms` | Sales partner application route. | Noindex. | Low public SEO; application workflow. | Medium commercial compliance. | Partner recruitment application. | PRIVATE/GATE |
| `/partner-hub` and children | Partner portal preview. | Noindex. | No public SEO. | High if exposed as real portal. | Authenticated Partner Hub. | PRIVATE/GATE |
| `/login` | Simulated patient login. | Inherits root metadata. | No public SEO. | High privacy/trust risk if mistaken for real login. | Authenticated My Sanctuary. | PRIVATE/GATE |
| `/register` | Simulated patient registration. | Inherits root metadata. | No public SEO. | High privacy/trust risk if mistaken for real registration. | Authenticated My Sanctuary. | PRIVATE/GATE |
| `/onboarding` | Simulated patient onboarding. | Inherits root metadata. | No public SEO. | High. | Authenticated My Sanctuary. | PRIVATE/GATE |
| `/my-sanctuary` | Simulated patient dashboard. | Inherits root metadata. | No public SEO. | High. | Authenticated My Sanctuary. | PRIVATE/GATE |
| `/prototype` and children | Synthetic operations prototype. | Prototype UI. | No public SEO. | High operational confusion if public. | Internal prototype only. | PRIVATE/GATE |
| `/online-doctor` | Virtual consultation concept. | `Online Doctor Session` | Moderate future value. | Medium-high; telehealth jurisdiction/privacy review needed. | Online Doctor. | REWRITE_MEDICALLY |
| `/careers` | Careers application placeholder. | Noindex. | Low public SEO. | Low. | Careers. | KEEP |
| `/faq` | Frequently asked questions. | FAQ metadata helper. | High support SEO potential. | Medium. | FAQ. | REDESIGN |
| `/contact` | Discovery enquiry and booking. | `Contact / Discovery Form` | High conversion value. | Low-medium; consent/privacy must remain clear. | Contact / Discovery. | REDESIGN |
| `/book-appointment` | Booking CTA route. | Booking metadata. | High conversion value. | Low-medium. | Book Appointment. | MERGE |
| `/privacy-policy` | Privacy policy. | Privacy metadata. | Required trust/legal. | Low. | Privacy Policy. | KEEP |
| `/privacy-pdpa` | PDPA-specific privacy. | Privacy / PDPA metadata. | Required Malaysia trust/legal. | Low. | Privacy / PDPA. | KEEP |
| `/privacy-disclaimer` | Medical disclaimer. | Privacy / Disclaimer metadata. | Required trust/legal. | Low. | Disclaimer. | KEEP |
| `/terms` | Terms page. | Terms metadata. | Required legal. | Low. | Terms of Use. | MERGE |
| `/terms-of-use` | Terms of use page. | Terms of Use metadata. | Required legal. | Low. | Terms of Use. | KEEP |
| `/ms`, `/zh`, `/th` | Language placeholders/pages. | Locale routes. | Future local SEO value; current translation quality must be reviewed. | Medium. | Localised MMS site. | REWRITE_MEDICALLY |
