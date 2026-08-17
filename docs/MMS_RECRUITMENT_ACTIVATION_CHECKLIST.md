# MMS Recruitment Activation Checklist

Status: operational checklist for Preview validation and eventual live activation. This is not a substitute for final legal, privacy, HR or Finance approval.

## A. Sales Partner intake — code readiness

- `/join-mms` application form renders correctly on desktop and mobile.
- Required fields validate before submission.
- Honeypot control remains active.
- Invalid MMS Partner referral codes are rejected.
- Application route never returns a success state unless the intended persistence layer has accepted the record.
- Permanent Partner ID is not issued during application.
- Bank, tax and payout details are not collected at application stage.
- No patient/member medical information is collected.

## B. Zoho CRM — Preview activation

Use the MMS CRM organisation only. Do not reuse iPivot or another company's CRM credentials.

Required Vercel Preview environment values:

```text
ZOHO_CLIENT_ID=<MMS server-side OAuth client>
ZOHO_CLIENT_SECRET=<MMS server-side OAuth secret>
ZOHO_REFRESH_TOKEN=<MMS refresh token>
ZOHO_DC=com
ZOHO_LEADS_MODULE_API_NAME=Leads
MMS_CRM_DEBUG=false
MMS_SALES_PARTNER_CRM_MODE=leads
MMS_SALES_PARTNER_LEAD_SOURCE=Partner
MMS_SALES_PARTNER_APPLICANT_TAG=MMS Sales Partner Applicant
MMS_SALES_PARTNER_APPLICATIONS_ENABLED=true
```

Keep these server-side only. Never create `NEXT_PUBLIC_ZOHO_*` values.

Before the first Preview write:

1. Confirm the OAuth client and refresh token belong to the MMS Zoho CRM organisation.
2. Confirm `Leads` is the correct MMS Leads module API name.
3. Confirm `Partner` is a valid `Lead_Source` value in that organisation.
4. Confirm the private CRM view `MMS Sales Partner Applicants` is available to the intended reviewer.
5. Confirm the applicant tag is exactly `MMS Sales Partner Applicant`.
6. Confirm the public page remains `noindex` while the workflow is under controlled testing.

Controlled Preview test:

1. Submit one clearly named test applicant from the Vercel Preview `/join-mms` page.
2. Confirm the browser receives `status: accepted` and an `MMS-SPA-...` application reference.
3. Confirm exactly one Lead appears in the MMS CRM.
4. Confirm name, email, mobile, city/country and company/occupation mapping.
5. Confirm `Lead_Source = Partner`.
6. Confirm `Lead_Status = Not Contacted`.
7. Confirm tag `MMS Sales Partner Applicant`.
8. Confirm Description contains application reference, Applicant stage, territory, expected activity, referral/introducer, declarations and source path.
9. Confirm no health information is present.
10. Confirm no permanent `MMSP-...` Partner ID has been issued.
11. Delete or clearly mark the test record according to CRM test-data policy after verification.

Failure test:

- Temporarily enable debug mode or remove one Preview credential and verify the website does not display a false success state.
- Verify raw Zoho error bodies and secrets are never returned to the browser.

After Preview validation, return `MMS_SALES_PARTNER_APPLICATIONS_ENABLED=false` until legal/privacy/operational launch approval is given.

## C. Sales Partner operating approvals before public launch

Required decisions/approvals:

- Final Sales Partner Agreement.
- Final commission policy.
- Finance approval for payout cycle. Current implementation preparation uses weekly batches, ordinarily targeted within 14 calendar days after cleared customer funds, subject to eligibility and checks.
- Referral attribution window.
- Referral overwrite rules.
- Self-referral policy.
- Referral dispute authority and evidence standard.
- Refund/cancellation/chargeback treatment.
- Suspension/termination consequences for pending commissions.
- Chairman qualification rules.
- Training content owner and version-control process.
- Compliance escalation owner.
- Privacy/PDPA wording and applicant retention schedule.

Activation gate for a Partner remains:

```text
Approved
+ Sales Partner Agreement completed
+ Core training completed
+ Compliance acknowledgement completed
= Active
```

Only Active partners may be represented as authorised active MMS Sales Partners.

## D. Referral and Partner ID controls

- Permanent Partner IDs follow `MMSP-1001+` format.
- IDs are allocated only from a transactional system of record after approval; never from browser state.
- IDs are never recycled.
- Suspended/inactive partners retain historical IDs for audit purposes.
- Referral URL uses controlled `?ref=MMSP-1001` format.
- QR code resolves to the same referral URL.
- Referral attribution contains no medical data.
- Cleared sales and commission rates are never editable by Partners.

## E. Commission ledger minimum fields

One immutable/auditable row per qualifying transaction or renewal:

- Partner ID
- Member/customer commercial reference only
- Membership code
- Payment transaction reference
- Cleared amount
- Commission rate
- Gross commission
- Adjustments/chargebacks
- Approved commission
- Payout status: Pending / Approved / Held / Paid / Reversed
- Payout cycle/date
- Notes/audit reason

Commission calculation and payout data must remain separate from clinical records.

## F. Careers / HR — readiness

The public `/careers` structure is code-ready for:

```text
Applied
-> HR Screening
-> Shortlisted
-> Interview
-> Credential Verification (where relevant)
-> Offer
-> Onboarding
-> Hired
```

with Rejected and Withdrawn as controlled exits.

Do not enable `MMS_CAREERS_APPLICATIONS_ENABLED=true` until all of the following exist:

- Approved ATS / Zoho Recruit destination.
- Secure CV upload/storage path.
- Applicant access controls.
- Retention/deletion policy.
- Role owner/hiring manager.
- Interview and credential-verification process.
- Privacy consent wording approved for the actual stored data.
- Test application successfully persists to the intended HR system.

Do not route employee candidates into Sales Partner CRM records merely to make the form live.

## G. Anti-abuse and security before public activation

- Keep honeypot controls.
- Add shared/platform rate limiting before public application gates are enabled; do not rely on process-memory counters.
- No CAPTCHA unless MMS later chooses to change this policy.
- Keep all Zoho/Stripe/ATS credentials server-side.
- Log operational failures without logging secrets or unnecessary applicant personal data.
- Do not expose raw third-party API errors to applicants.

## H. Current go-live position

Code may remain in a draft PR and be preview-tested while all public submission gates are false by default.

Do not merge to production or enable live applicant intake merely because the build passes. The controlled Preview test plus operational, privacy and legal approvals above are the actual activation gate.
