# My Medical Sanctuary Website v0.1

Production-ready v0.1 corporate website for **My Medical Sanctuary (MMS)**.

Tagline: **Preventive Care • Personalised Longevity**

## Stack

- Next.js 14 App Router
- React
- TypeScript
- Tailwind CSS
- Client-side contact form placeholder
- Zoho-ready data capture structure

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Build

```bash
npm run build
```

## Folder Structure

```text
src/
  app/
    page.tsx
    about-mms/page.tsx
    memberships/page.tsx
    how-it-works/page.tsx
    education/page.tsx
    corporate-executive-wellness/page.tsx
    contact/page.tsx
    privacy-disclaimer/page.tsx
    layout.tsx
    globals.css
  components/
    Navbar.tsx
    FooterV01.tsx
    Hero.tsx
    CTAButton.tsx
    SectionHeader.tsx
    MembershipCard.tsx
    StepCard.tsx
    WellnessAreaCard.tsx
    DisclaimerBox.tsx
    ContactForm.tsx
    EducationCard.tsx
    CorporateCTA.tsx
  data/
    memberships.ts
    wellnessAreas.ts
    steps.ts
    educationPosts.ts
```

## Primary Pages

- `/`
- `/about-mms`
- `/memberships`
- `/how-it-works`
- `/education`
- `/corporate-executive-wellness`
- `/contact`
- `/privacy-disclaimer`

## Zoho Integration Notes

The contact form currently:

- captures required discovery fields
- logs a Zoho-ready payload to the browser console
- shows a success message

Future Zoho steps:

1. Confirm Zoho CRM module and field API names.
2. Add server route for secure lead submission.
3. Store consent value, source page and timestamp.
4. Add validation and spam protection.
5. Add success/error analytics events.

Suggested Zoho mapping:

| Form Field | Zoho Field |
|---|---|
| Full name | Full Name |
| Phone | Mobile |
| Email | Email |
| Country / City | Country / City |
| Main interest | Interested Service |
| Preferred membership | Preferred Membership |
| Enquiring for | Enquiry Type |
| Preferred contact time | Preferred Contact Time |
| Consent | Consent to Contact |

## Compliance Notes

Use cautious wording:

- designed to support
- structured wellness journey
- preventive care
- personalised longevity
- HRM coordination
- professional review
- suitability assessment
- discovery discussion

Avoid exaggerated medical claims.
