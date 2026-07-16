# My Medical Sanctuary Website Production Handoff

## 1. Website Sitemap

- `/` - Home
- `/about-mms` - About MMS
- `/our-philosophy` - Our Philosophy
- `/health-screening` - Health Screening
- `/preventive-care` - Preventive Care
- `/longevity-medicine` - Longevity Medicine
- `/iv-therapy` - IV Therapy
- `/weight-management` - Weight Management
- `/corporate-wellness` - Corporate Wellness
- `/professional-alliance-programme` - Professional Alliance Programme
- `/medical-tourism` - Medical Tourism (Future)
- `/health-articles` - Health Articles / Blog
- `/faq` - FAQ
- `/contact` - Contact
- `/book-appointment` - Book Appointment
- `/privacy-policy` - Privacy Policy
- `/terms-of-use` - Terms of Use

Legacy/supporting routes currently preserved:

- `/why-mms`
- `/health-journey`
- `/knowledge-hub`
- `/ling`
- `/membership`
- `/privacy-pdpa`
- `/terms`

## 2. Navigation Structure

Primary navigation:

- Home
- About MMS
- Our Philosophy
- Membership
- Knowledge Hub
- Ling
- Contact

Conversion routes are exposed through CTAs and footer links:

- Health Screening
- Book Appointment
- Corporate Wellness
- Professional Alliance Programme

Treatments such as IV Therapy are not positioned as top-level navigation items. They sit inside the service ecosystem and use suitability language.

## 3. Wireframes

### Home

1. Hero: brand promise, Book Appointment, WhatsApp / Ling
2. Why Prevention Matters
3. Your Health Journey cards
4. Our Services grid
5. Why MMS trust section
6. Member Journey timeline
7. Meet Our Doctors
8. Testimonials placeholder
9. Latest Health Articles
10. Professional Alliance CTA
11. Corporate Wellness CTA
12. Final appointment CTA
13. Footer

### Service Page

1. Dark premium hero
2. Trust and suitability explanation
3. Educational cards
4. Conservative clinical boundary
5. Conversion panel: Book Appointment / WhatsApp / Call Clinic

### Contact / Booking

1. Hero: start with clarity
2. Lead form
3. Zoho CRM mapping table
4. Footer

## 4. UI Component Library

Implemented components:

- `SiteHeader`
- `MobileNav`
- `Footer`
- `BrandMark`
- `ButtonLink`
- `Section`
- `PageHero`
- `ConversionPanel`
- `LingPanel`

Design principles:

- Large white space
- Premium dark hero sections
- Teal medical accent
- Rounded corners capped at 8px for cards/panels
- Clear CTAs
- Conservative medical language
- Mobile drawer navigation

## 5. CMS Recommendation

Recommended CMS: Sanity or Contentful.

Preferred for MMS: Sanity.

Reasons:

- Strong structured content for health articles
- Good medical review workflows
- Flexible doctor profiles and clinic locations
- Localisation-ready for ASEAN expansion
- Can power AI/Ling knowledge contexts later

Suggested CMS collections:

- Articles
- Doctors
- Clinics
- Services
- FAQs
- Testimonials
- Corporate programmes
- Alliance partner content
- SEO metadata

## 6. Deployment Guide

Recommended hosting: Vercel.

Steps:

1. Push repository to GitHub.
2. Import project into Vercel.
3. Set framework preset to Next.js.
4. Add environment variables:
   - `OPENAI_API_KEY`
   - `ZOHO_CLIENT_ID`
   - `ZOHO_CLIENT_SECRET`
   - `ZOHO_REFRESH_TOKEN`
   - `ZOHO_ORG_ID`
5. Configure production domain.
6. Enable Vercel Web Analytics and Speed Insights.
7. Run production smoke test after deployment.

## 7. SEO Checklist

- Unique title per page
- Unique meta description per page
- Open Graph image and metadata
- Sitemap XML
- Robots TXT
- LocalBusiness / MedicalOrganization schema
- FAQ schema on FAQ page
- Article schema for blog content
- Internal links from Home to all priority conversion pages
- Optimised images using `next/image`
- Fast LCP hero images
- No exaggerated medical claims
- Malaysia-first keywords, ASEAN-ready content structure

## 8. Launch Checklist

- Legal review for Privacy Policy / PDPA
- Legal review for Terms of Use
- Medical review for service pages
- Consent review for testimonials
- Zoho CRM production field confirmation
- Booking form test to Zoho sandbox
- WhatsApp and clinic phone routing confirmed
- Analytics installed
- Sitemap submitted to Google Search Console
- Mobile QA across iOS and Android
- Accessibility pass for forms and navigation
- Production performance check

## 9. Production Stack Recommendation

- Next.js App Router
- React
- TypeScript
- TailwindCSS
- Vercel hosting
- GitHub source control
- Sanity CMS
- Zoho CRM
- OpenAI API for Ling educational assistant
- Vercel Analytics / Google Analytics 4
- Future: member portal and doctor portal via authenticated app routes

## 10. Medical Claims Standard

Avoid:

- Guaranteed
- Cure
- Permanent
- Miracle
- 100%

Use:

- Subject to doctor assessment.
- Suitable candidates only.
- Individual outcomes vary.
- Evidence-informed.
- Doctor-led.
