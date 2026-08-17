# MMS Commerce & Recruitment Foundation

Status: implementation preparation only. Do not expose payment or recruitment submission flows publicly until the relevant Stripe/Zoho credentials, policies and operational owners are confirmed.

## 1. Customer payment architecture

Preferred launch path: Stripe Checkout (hosted or embedded) rather than a custom card form.

Customer journey:
1. Customer explores MMS memberships and speaks with Ling / MMS where appropriate.
2. MMS confirms the membership or payment purpose.
3. Website creates a Stripe Checkout Session using a server-side Stripe Price ID.
4. Customer completes payment on Stripe.
5. Stripe webhook verifies payment completion.
6. MMS creates/updates the customer record in Zoho CRM using a non-clinical payment reference.
7. MMS care/onboarding workflow begins.

Data boundary:
- Stripe: payment/customer basics only (name, email, membership code, transaction/reference ID).
- MMS clinical/health information: keep outside Stripe and route only through approved MMS systems.
- Never put Stripe secret keys in NEXT_PUBLIC_* variables or browser code.

Initial Stripe product mapping:
- ASCEND -> STRIPE_PRICE_ASCEND
- EVOLVE -> STRIPE_PRICE_EVOLVE
- ETERNA -> STRIPE_PRICE_ETERNA
- PINNACLE -> STRIPE_PRICE_PINNACLE

Public pricing remains a separate commercial decision. Price IDs can exist server-side without publishing package prices on marketing pages.

Required Stripe events for first release:
- checkout.session.completed
- checkout.session.async_payment_succeeded (if delayed payment methods are enabled)
- checkout.session.async_payment_failed (if delayed payment methods are enabled)

Do not mark an MMS membership paid from the browser redirect alone. Fulfilment must rely on a verified Stripe webhook.

## 2. Sales Partner recruitment

Public route: /join-mms

Positioning:
- Professional MMS Sales Partner opportunity.
- Not a job application unless explicitly offered as an employed sales role.
- Avoid MLM language and recruitment-chain framing.

Core proposition:
- Premium preventive health and personalised longevity platform.
- Malaysia + Thailand care ecosystem.
- Ling-assisted education and structured MMS sales materials.
- Client relationship focused rather than one-off product selling.

Commission framework for recruitment material:
- Base commission: 10%.
- Performance structure may progress to 15% base, 18% personal-target tier and 23% group-target tier, subject to the approved MMS commission rules.
- 2% residual may be payable on eligible following-year renewal after full utilisation/renewal conditions are met.
- Levels: Associate (0-5/month), Senior (6-15/month), Elite (16+/month), Chairman leadership tier.

Commission payout timing:
- Do not publish a fixed T+ number until Finance approves the formal payout policy.
- Website-safe wording: "Approved commission is processed on the applicable MMS payout cycle after customer payment has cleared and eligibility, cancellation/refund and compliance checks are satisfied."
- Recommended policy decision still required: weekly/T+7, T+14, or twice-monthly settlement.

Application fields (pre-approval):
- Full name
- Email
- Mobile / WhatsApp
- Country / city
- Nationality
- Current occupation / company (optional)
- Sales background
- Healthcare / financial / premium-consumer sales experience
- Preferred market / territory
- Expected monthly activity
- Referral / introducer (optional)
- Compliance declaration
- Privacy consent

Post-approval only:
- Bank payout details
- tax/payment documentation
- signed Sales Partner Agreement
- partner ID / referral code

Recommended workflow:
Apply -> screening -> interview/approval -> agreement -> partner ID -> CRM activation -> training -> referral link/QR -> active selling -> commission reporting.

## 3. Internal HR recruitment

Public route: /careers

Keep employee recruitment operationally separate from Sales Partner recruitment.

Initial role families may include:
- Medical / clinical
- Clinic operations
- Member concierge / care coordination
- Sales management
- Marketing / content
- Finance / administration
- Technology / CRM / platform support

Candidate application fields:
- Full name
- Email
- Mobile
- Location
- Role applied for
- Current position
- Years of relevant experience
- Notice period / availability
- Expected salary (optional by market policy)
- CV / resume
- LinkedIn / portfolio (optional)
- Privacy consent

Recommended workflow:
Vacancy -> application -> HR screening -> interview -> professional/credential verification where relevant -> offer -> onboarding.

Preferred system of record: Zoho Recruit if enabled for MMS. If not yet enabled, do not build a permanent applicant database into the website as a substitute.

## 4. Partner portal - phase 2

After the application and CRM rules are stable, approved partners should be able to see:
- Partner ID
- referral link / QR
- assigned / self-generated prospects
- completed membership sales
- pending commission
- approved commission
- payout cycle / payment history
- training and compliance content
- approved marketing assets
- notices / policy updates

Do not expose client health information in the partner portal.

## 5. Security and compliance gates

Before enabling live payment/application submission:
- Stripe production keys configured only in server environment.
- Stripe webhook secret configured and signature verification implemented.
- Zoho CRM / Recruit production mapping verified.
- Real shared/platform rate limiting enabled for public submission endpoints.
- Honeypot / bot controls retained where appropriate.
- Privacy / PDPA wording approved for the data actually collected.
- Terms, refund/cancellation and membership conditions approved.
- Sales Partner Agreement and commission policy approved.
- HR applicant retention/access rules approved.
- No medical information collected in the payment or sales-partner application forms.

## 6. Suggested implementation order

1. Configure Stripe products + Price IDs in Stripe account.
2. Implement /api/checkout and /api/stripe/webhook.
3. Connect successful Stripe payments to the MMS CRM/member onboarding process.
4. Build /join-mms + Sales Partner application data contract.
5. Connect partner applications to the appropriate Zoho CRM module/workflow.
6. Build /careers + role/application data contract.
7. Connect careers to Zoho Recruit or an approved HR system.
8. Build partner referral tracking and portal only after the above is stable.

## 7. Go-live rule

A page may be visually public before its submission/payment action is enabled, but the UI must state truthfully when an application or payment function is not yet active. Never display a success state unless the server-side transaction or application has actually been accepted by the intended system of record.
