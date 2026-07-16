# MMS CRM Integration Infrastructure Runbook v1

Project: My Medical Sanctuary website  
Role boundary: Infrastructure, deployment, environment setup  
Date reviewed: 2026-07-16  

## Scope

This review covers deployment readiness for the DeepSeek CRM integration handoff. It does not redesign the website, change brand wording, add a database, add payments, add member login, or add medical records.

## Current Findings

### CRM Integration Files Reviewed

- `src/components/ContactForm.tsx`
- `src/app/api/booking/route.ts`
- `.env.example`
- `package.json`
- `postcss.config.mjs`
- `next.config.mjs`
- `README.md`

### CRM Route Status

Requested endpoint:

```text
/api/crm/discovery-lead
```

Current codebase status:

- `/api/crm/discovery-lead` does not exist yet.
- Existing server route is `/api/booking`.
- Current contact form does not submit to a server route; it logs the form payload in the browser console and shows a local success state.
- Because `/api/crm/discovery-lead` is absent, it cannot yet be confirmed as server-side only.

Infrastructure recommendation:

- Treat this as a CRM integration gap for DeepSeek or the integration owner.
- When added, `/api/crm/discovery-lead` must live under `src/app/api/crm/discovery-lead/route.ts`.
- It must read Zoho secrets only from server-side `process.env`.
- The contact form should post to this route only after mock mode passes.

## Next.js Build Compatibility

Build command run:

```bash
npm run build
```

Result: blocked locally before CRM execution.

Resolved build-prep items:

- Restored dependencies from `package.json`.
- Generated `package-lock.json`.
- Confirmed installed versions:

```text
next@14.2.23
tailwindcss@3.4.19
```

- Converted unsupported `next.config.ts` to supported `next.config.mjs`.
- Updated `tsconfig.json` to avoid stale `.next/dev` type inclusion and deployment-time incremental metadata writes.
- Confirmed TypeScript check passes:

```bash
npx tsc --noEmit --pretty false
```

Remaining local build blocker:

- This managed workspace denies new directory creation from shell/Node.
- `next build` fails when trying to create the build output directory.
- Direct directory creation also fails:

```text
EPERM: operation not permitted, mkdir ...\next-build
```

Interpretation:

- This is a local workspace filesystem restriction.
- It is not caused by CRM code.
- Vercel should be able to create its build output directory in its own build container.

Earlier failure now resolved:

- Local `node_modules` previously contained `next@16.2.9` and `tailwindcss@4.3.2`.
- `package.json` declares `next@14.2.23` and `tailwindcss@^3.4.17`.
- The mismatch caused a Tailwind 4 PostCSS error.
- Reinstalling from `package.json` fixed the dependency mismatch.
- `postcss.config.mjs` remains compatible with Tailwind 3:

```js
plugins: {
  tailwindcss: {},
  autoprefixer: {},
}
```

Earlier build error:

```text
It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.
The PostCSS plugin has moved to a separate package...
```

Package direction:

- Keep Next.js 14 unless DeepSeek explicitly upgrades the app.
- Keep Tailwind 3 unless DeepSeek explicitly migrates to Tailwind 4.

Security note:

- `npm install` reported one moderate and one critical vulnerability and a warning that `next@14.2.23` is deprecated due a security issue.
- Do not run `npm audit fix --force` without DeepSeek approval because it may introduce breaking framework upgrades.
- Recommended next step is for DeepSeek to approve a patched Next.js version and test the site.

## Vercel Environment Variable Checklist

Set these in Vercel Project Settings → Environment Variables.

Server-side only:

```text
ZOHO_CLIENT_ID
ZOHO_CLIENT_SECRET
ZOHO_REFRESH_TOKEN
ZOHO_DC
ZOHO_ORGANIZATION_ID
ZOHO_CRM_OWNER_ID
ZOHO_LEADS_MODULE_API_NAME=Leads
MMS_DEFAULT_LEAD_SOURCE=Website Discovery Form
MMS_CRM_DEBUG=true
```

Optional:

```text
ZOHO_ORGANIZATION_ID
ZOHO_CRM_OWNER_ID
```

Mock mode first:

```text
MMS_CRM_DEBUG=true
```

Live Zoho mode:

```text
MMS_CRM_DEBUG=false
```

Security rule:

- Do not create `NEXT_PUBLIC_ZOHO_*` variables.
- Do not put `ZOHO_CLIENT_SECRET` or `ZOHO_REFRESH_TOKEN` in client components.
- Do not commit `.env.local`, `.env.production`, or real secrets.

## Zoho Organisation Separation

Zoho One login:

```text
marcusliew1@gmail.com
```

Important setup rule:

- Confirm the active Zoho CRM organisation belongs to My Medical Sanctuary before generating or using credentials.
- Do not use iPivot or any other company CRM organisation, modules, owners, or refresh token.
- Confirm `ZOHO_ORGANIZATION_ID` if multiple CRM organisations are present.
- Confirm `ZOHO_LEADS_MODULE_API_NAME=Leads` maps to the MMS CRM Leads module.
- Confirm `ZOHO_CRM_OWNER_ID` belongs to an MMS user if owner assignment is enabled.

## Staging Deployment Checklist

Pre-deploy:

1. Resolve dependency mismatch.
2. Generate and commit `package-lock.json`.
3. Confirm `npx tsc --noEmit --pretty false` passes locally.
4. Confirm `npm run build` passes in an environment that allows Node to create build directories.
4. Confirm `/api/crm/discovery-lead` exists before CRM testing.
5. Confirm `.env.example` contains placeholders only.
6. Confirm no real Zoho secrets are committed.

Vercel setup:

1. Create or select MMS Vercel project.
2. Link the correct GitHub repository.
3. Set framework preset to Next.js.
4. Set build command:

```text
npm run build
```

5. Set install command:

```text
npm install
```

6. Add Vercel environment variables for Preview first.
7. Set `MMS_CRM_DEBUG=true`.
8. Deploy preview.

## Mock Mode Test Instructions

Required before live Zoho testing:

1. Open Vercel preview URL.
2. Go to `/contact`.
3. Submit the discovery enquiry form with test data.
4. Confirm the browser does not expose Zoho secrets.
5. Confirm the API response returns mock/safe status only.
6. Confirm consent is captured.
7. Confirm no lead is created in Zoho while `MMS_CRM_DEBUG=true`.
8. Confirm raw Zoho errors are not shown to the user.

Expected current result:

- Cannot complete this test yet because the current contact form does not submit to `/api/crm/discovery-lead`.

## Live Zoho Test Instructions

Run only after mock mode passes and credentials are confirmed for MMS.

1. Confirm active Zoho CRM organisation is MMS, not iPivot or another company.
2. Set Vercel Preview `MMS_CRM_DEBUG=false`.
3. Confirm all Zoho credentials are present.
4. Submit one test lead from `/contact`.
5. Confirm lead appears in MMS Zoho CRM `Leads`.
6. Confirm lead source equals:

```text
Website Discovery Form
```

7. Confirm consent field is stored.
8. Confirm owner assignment if `ZOHO_CRM_OWNER_ID` is set.
9. Confirm no duplicate or wrong-company CRM record is created.
10. Switch back to `MMS_CRM_DEBUG=true` if more UI testing is required.

## Security Review Checklist

- No Zoho secrets in browser bundle.
- No `NEXT_PUBLIC_ZOHO_*` variables.
- No secrets committed to GitHub.
- API route validates input.
- Consent captured before CRM submission.
- Raw Zoho errors not exposed to the user.
- Mock mode available for testing.
- Server route uses server-side environment variables only.
- Zoho organisation explicitly checked for MMS.
- IT / deployment admin actions are auditable.

## GitHub Commit Structure

Recommended branch:

```text
infra/mms-zoho-crm-vercel-staging
```

Recommended commits:

```text
chore(env): document MMS Zoho CRM Vercel variables
chore(build): restore reproducible Next dependency lockfile
docs(infra): add CRM deployment and security runbook
test(crm): verify mock discovery lead submission
```

Current Git note:

- The reviewed website folder contains a `.git` directory entry, but `git status` does not recognise it as a valid repository in this workspace.
- A valid Git repository must be restored or re-cloned before preparing commits.

## Rollback Instructions

Vercel rollback:

1. Open Vercel project.
2. Go to Deployments.
3. Select last known good deployment.
4. Promote it to production or redeploy it.

Environment rollback:

1. Set `MMS_CRM_DEBUG=true` to stop live Zoho writes.
2. Remove or rotate exposed Zoho credentials if leakage is suspected.
3. Restore previous environment variable set from Vercel history or secure notes.

Zoho rollback:

1. Identify test leads by lead source `Website Discovery Form`.
2. Verify they are MMS test records.
3. Delete or mark test records according to MMS CRM governance policy.

Code rollback:

1. Revert the CRM integration commit.
2. Re-run build.
3. Deploy preview.
4. Promote only after mock mode test passes.

## Open Blockers

1. Local `next build` is blocked by workspace filesystem restrictions preventing directory creation.
2. `/api/crm/discovery-lead` is not present.
3. Contact form currently logs payload client-side and does not submit to a server route.
4. Vercel CLI is not installed in this workspace, so preview deployment was not executed locally.
5. Vercel MCP deployment was not executed because the project path is not linked and the local build cannot complete in this workspace.
6. Live Zoho credentials have not been provided.
7. Next.js version should be reviewed for the reported security advisory before production.
