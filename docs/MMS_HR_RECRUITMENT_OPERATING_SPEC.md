# MMS Internal HR Recruitment Operating Specification

Status: implementation specification. Employee recruitment is separate from the MMS Sales Partner Programme.

## 1. Objective

Create one controlled employee recruitment workflow for Malaysia and Thailand that can later be connected to Zoho Recruit or another approved applicant-tracking system without storing candidate data in ad-hoc website files or mixing employee candidates with Sales Partners.

## 2. Role families

Initial MMS role families:

- Medical & Clinical
- Clinic Operations
- Member Concierge
- Sales Management
- Marketing & Content
- Finance & Administration
- Technology & CRM

A role may be published as a live vacancy only when the hiring owner, location, employment basis, role description and approval to recruit are confirmed.

## 3. Vacancy lifecycle

Canonical vacancy statuses:

1. Draft
2. Open
3. Paused
4. Closed
5. Filled

Each vacancy should carry a unique vacancy reference, title, role family, location, country, employment type, hiring owner, opening date, closing date if applicable, job description and required screening questions.

## 4. Candidate lifecycle

Canonical stages:

1. Applied
2. HR Screening
3. Shortlisted
4. Interview
5. Credential Verification where applicable
6. Offer
7. Onboarding
8. Hired
9. Rejected
10. Withdrawn

Clinical and regulated positions must not move to Offer/Hired without the required professional credential and licence checks.

## 5. Candidate application data

Public application fields:

- Full name
- Email
- Mobile
- Current location
- Role family / vacancy reference
- Current position
- Years of relevant experience
- Notice period / availability
- Expected salary where appropriate
- CV / resume
- LinkedIn / portfolio where relevant
- Recruitment privacy consent

Do not request medical or patient information in the recruitment form.

## 6. CV handling

The website must not pretend to accept a CV upload until an approved storage destination is connected.

Production options, in preference order:

1. Zoho Recruit candidate attachment upload if MMS Zoho Recruit is activated.
2. Another approved ATS with authenticated API/file handling.
3. Approved private HR storage with access controls and retention rules.

Public object storage, email-only attachment handling and permanent storage inside the website repository are prohibited.

## 7. Screening and interview controls

HR Screening should record:

- eligibility to work in the target country where relevant
- role fit
- relevant experience
- salary/availability alignment where appropriate
- conflict or compliance issues where relevant
- clinical credential requirement flag

Interview records should record interview date, interviewers, outcome and next action. Sensitive interview notes must remain in the approved HR system, not in website analytics or CRM marketing records.

## 8. Offer and onboarding

Offer stage should require an approved compensation package and authorised hiring owner. Onboarding should track only employment onboarding requirements appropriate to the role, including employment agreement, payroll/bank information, policy acknowledgements, system access and professional credentials where applicable.

## 9. Data governance

Before live recruitment:

- approve applicant privacy wording
- approve retention/deletion period
- define HR users allowed to access applications
- define country-specific storage/access requirements
- configure CV storage
- configure deletion/withdrawal handling
- keep candidates separate from Sales Partners and patients/members

## 10. Website go-live rule

`MMS_CAREERS_APPLICATIONS_ENABLED` remains false until a permanent HR system of record and CV-handling workflow are verified. The public Careers page may describe role families before then, but it must not claim an application was received unless the approved HR system actually accepted it.

## 11. Target Zoho Recruit mapping

When Zoho Recruit is available, map:

- candidate -> Candidate record
- role / vacancy -> Job Opening
- stage -> Candidate status / pipeline stage
- CV -> Candidate attachment
- interview -> Interview record/activity
- offer -> Offer workflow
- hiring owner -> Recruit owner / hiring manager

Do not reuse Zoho CRM Leads as the permanent employee ATS merely to avoid setting up Recruit.
