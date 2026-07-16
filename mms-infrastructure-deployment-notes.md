# MMS Infrastructure Deployment Notes

Project: My Medical Sanctuary website  
Scope: Infrastructure only. Do not redesign or rewrite brand content unless a deployment error requires it.

## Current Build Status

Local production build command:

```bash
npm run build
```

Latest result: Passed.

Current app stack:

- Next.js `16.2.9`
- React `19.2.7`
- React DOM `19.2.7`
- Local Node tested: `v24.14.0`
- npm tested: `11.9.0`

Compatibility note:

- Next.js 16 requires Node `20.9.0+`.
- `package.json` now declares `"node": ">=20.9.0"`.
- GitHub CI is configured to build on Node `22`.

## Build Error Found And Fixed

Issue:

```text
next/font: Failed to fetch Geist from Google Fonts
```

Cause:

- `src/app/layout.tsx` used `next/font/google`.
- The build environment could not fetch Google Fonts.

Fix applied:

- Removed the external Google font dependency.
- Kept a local/system sans-serif font stack in `src/app/globals.css`.

Files changed for this deployment fix:

- `src/app/layout.tsx`
- `src/app/globals.css`

## GitHub Repository Setup Steps

If creating the repo manually:

```bash
git init
git add .
git commit -m "Initial MMS website infrastructure-ready build"
git branch -M main
git remote add origin https://github.com/<org-or-user>/<repo-name>.git
git push -u origin main
```

Recommended repo name:

```text
mms-website
```

Recommended branch model:

- `main` - production
- `staging` - Vercel preview/staging
- feature branches - short-lived branches for changes

Included GitHub CI:

```text
.github/workflows/ci.yml
```

CI does:

- checkout
- setup Node 22
- `npm ci`
- `npm run build`

## Vercel Deployment Steps

1. Push project to GitHub.
2. Open Vercel dashboard.
3. Add New Project.
4. Import the GitHub repository.
5. Framework preset: Next.js.
6. Install command:

```bash
npm ci
```

7. Build command:

```bash
npm run build
```

8. Output directory:

```text
.next
```

9. Set environment variables.
10. Deploy.
11. Test production URL.

## Environment Variable Checklist

Current `.env.example` placeholders:

```text
OPENAI_API_KEY=
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
ZOHO_ORG_ID=
```

Future recommended variables:

```text
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GA_ID=
ZOHO_ACCOUNTS_BASE_URL=
ZOHO_CRM_BASE_URL=
ZOHO_LEADS_MODULE=Leads
MMS_DEFAULT_CLINIC=
MMS_WHATSAPP_NUMBER=
MMS_CLINIC_PHONE=
```

Do not commit real secrets.

## Zoho Forms / Zoho CRM Notes

Current booking endpoint:

```text
/api/booking
```

Current mode:

- Placeholder only.
- Returns the Zoho Lead payload shape.
- Does not send data to Zoho yet.

Current CRM mapping:

| Website Field | Zoho CRM Lead Field |
|---|---|
| Full Name | Full Name |
| Mobile Number | Mobile |
| Email | Email |
| Country | Country |
| Preferred Language | Preferred Language |
| Interested In | Interested Service |
| Preferred Contact Method | Preferred Contact Method |
| Preferred Appointment Date | Next Follow-up / Appointment Preference |
| Source | Website |
| Consent to Contact | Consent to Contact |

Future Zoho integration tasks:

1. Confirm exact Zoho field API names.
2. Confirm required fields in Zoho Leads module.
3. Add server-side Zoho OAuth refresh token flow.
4. Submit lead from `/api/booking`.
5. Store consent timestamp and source URL.
6. Add spam protection.
7. Add success and failure states to the form.

## Domain DNS Checklist

Likely domain:

```text
mymedicalsanctuary.com
```

Before connecting:

- Confirm final domain owner and registrar access.
- Confirm whether root domain or `www` should be primary.
- Confirm email provider before changing DNS.
- Export current DNS records.

Typical Vercel DNS:

For apex/root domain:

```text
A @ 76.76.21.21
```

For `www`:

```text
CNAME www cname.vercel-dns.com
```

Post-DNS checks:

- HTTPS issued.
- `www` redirects correctly.
- Apex redirects correctly.
- No email DNS records were removed.
- Google Search Console domain property verified.

## Build / Test Command Checklist

Install:

```bash
npm ci
```

Local development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Production start after build:

```bash
npm run start
```

Smoke-test URLs:

- `/`
- `/about-mms`
- `/health-screening`
- `/preventive-care`
- `/longevity-medicine`
- `/iv-therapy`
- `/weight-management`
- `/corporate-wellness`
- `/professional-alliance-programme`
- `/health-articles`
- `/faq`
- `/book-appointment`
- `/privacy-policy`
- `/terms-of-use`

## Deployment Troubleshooting Notes

### Google Font Fetch Failure

Symptom:

```text
next/font: Failed to fetch Geist from Google Fonts
```

Resolution:

- Already fixed by removing `next/font/google`.
- Keep system font stack unless self-hosting fonts locally.

### Node Version Mismatch

Symptom:

```text
You are using Node.js < required version
```

Resolution:

- Use Node `22` on GitHub CI and Vercel if available.
- Ensure Node is at least `20.9.0`.

### Missing Environment Variables

Current build does not require secrets.

Future Zoho/OpenAI functionality will require environment variables. Add them in Vercel Project Settings before enabling live integrations.

### Form Not Creating Zoho Lead

Expected for now. `/api/booking` is a placeholder and only returns the mapped payload.

### Domain Not Working

Check:

- DNS propagation.
- Vercel project domain settings.
- Apex `A` record.
- `www` CNAME.
- Registrar DNSSEC issues.
- Conflicting old records.
