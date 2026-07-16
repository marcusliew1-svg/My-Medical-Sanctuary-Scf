# MMS v0.1 Code Index

This workspace contains the complete v0.1 Next.js 14 + TypeScript + Tailwind CSS implementation for My Medical Sanctuary.

## Required Install

The source files target the dependencies in `package.json`.

Run:

```bash
npm install
npm run dev
npm run build
```

Note: the previous workspace had Next 16 / Tailwind 4 installed in `node_modules`. A fresh `npm install` is required to reconcile dependencies for the requested Next 14 / Tailwind 3 project.

## Main Files

```text
package.json
tailwind.config.js
postcss.config.mjs
next.config.ts
src/app/globals.css
src/app/layout.tsx
```

## Pages

```text
src/app/page.tsx
src/app/about-mms/page.tsx
src/app/memberships/page.tsx
src/app/how-it-works/page.tsx
src/app/education/page.tsx
src/app/corporate-executive-wellness/page.tsx
src/app/contact/page.tsx
src/app/privacy-disclaimer/page.tsx
```

## Components

```text
src/components/Navbar.tsx
src/components/FooterV01.tsx
src/components/Hero.tsx
src/components/CTAButton.tsx
src/components/SectionHeader.tsx
src/components/MembershipCard.tsx
src/components/StepCard.tsx
src/components/WellnessAreaCard.tsx
src/components/DisclaimerBox.tsx
src/components/ContactForm.tsx
src/components/EducationCard.tsx
src/components/CorporateCTA.tsx
```

## Data Files

```text
src/data/memberships.ts
src/data/wellnessAreas.ts
src/data/steps.ts
src/data/educationPosts.ts
```

## Zoho Placeholder

`ContactForm.tsx` currently logs a Zoho-ready payload and displays a success message.

Future integration:

- create secure API route
- map fields to Zoho CRM
- add consent timestamp
- add spam protection
- add success/error analytics

## Compliance Scan

Restricted medical-claim wording was scanned in `src/` and no matches were found after cleanup.
