# Health Intelligence source legal and terms review

Status: preliminary technical review, not legal advice  
Research date: 30 August 2026

Public visibility does not establish a right to copy, automate, republish or commercially reuse data. Only Singapore's data.gov.sg dataset has a clear reuse route in this review.

## Review matrix

| Source | Owner/operator | Public/private | Relevant terms and notices | Reuse | Automation | Attribution | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| NPRA QUEST3+ | NPRA, Malaysia MOH | public search | [QUEST3+ disclaimer](https://www.npra.gov.my/images/q3plus/161214_Disclaimers_of_industry_testing.pdf) says material is owned/licensed by NPRA and reproduction requires permission | unclear/restricted | unclear | source citation required if permission granted | `legal_review_required`; manual lookup only |
| MyPriMe | Pharmaceutical Services Programme, Malaysia MOH | public table | [portal privacy/terms notice](https://pharmacy.moh.gov.my/en/content/privacy-policy.html) states all rights reserved and disclaims reliance loss | no explicit dataset licence | unclear | factual source citation; no endorsement | `legal_review_required`; no connector |
| BIG Caring Group | BIG Pharmacy Healthcare Sdn Bhd and affiliates | commercial | [terms of use](https://www.bigpharmacy.com.my/corporate/terms-conditions) govern lawful platform, pharmacy and purchase use | no data-reuse grant found | not authorized | source and observation date if approved | manual observation only after legal approval |
| Alpro OneClick | Alpro Pharmacy Sdn Bhd | commercial | retail/promotional terms; prices may change; no general data licence found | unclear | not authorized | source and observation date if approved | manual observation only after legal approval |
| Thai NDI product database | National Drug Information, Thailand | public search | site footer states copyright and all rights reserved | unclear/restricted | unclear | retain source and Thai original | `legal_review_required`; manual lookup only |
| Thailand central-price database/export | National Drug Policy Division / NDI | public table/export | official Excel export exists; site still states all rights reserved | unclear | unclear | official notice/version required | research/manual file only; connector blocked |
| Fascino Telepharmacy | Fascino | commercial | [platform terms](https://telepharmacy.fascino.co.th/terms/) govern service and purchase use | no data-reuse grant found | not authorized | source and observation date if approved | manual observation only after legal approval |
| HSA registered therapeutic products on data.gov.sg | HSA / data.gov.sg | public dataset/API | [Open Data Licence](https://data.gov.sg/open-data-licence) permits commercial/non-commercial use; [API terms](https://data.gov.sg/privacy-and-terms) apply | permitted with conditions | permitted subject to API terms/rate limits | conspicuous source and licence notice | suitable for Release 2D.1 connector design |
| Singapore MOH subsidised-drug list | Singapore MOH | public web page | MOH website terms apply; no dataset licence identified on the page | unclear | unclear | source, version date, no endorsement | manual/context-only pending review |
| HSA pharmacy licence search | HSA | public interactive lookup with security check | public search; no bulk reuse licence identified | unclear | do not bypass security check | factual source citation | manual validation only |
| Watsons Singapore | Watson's Personal Care Pte. Ltd. | commercial | [terms](https://www.watsons.com.sg/terms-conditions) state prices may change and govern eStore purchase use | no data-reuse grant found | not authorized | source and observation date if approved | manual observation only after legal approval |

## Robots and access controls

This review did not treat `robots.txt` as a licence. Before any connector activation, record a dated copy or hash of:

1. robots/access policy;
2. source terms and dataset licence;
3. API documentation and rate limits;
4. any authentication, CAPTCHA or security control;
5. written permission or owner correspondence.

Never bypass CAPTCHA, authentication, anti-bot controls or technical restrictions. A structured export button does not by itself authorize scheduled collection or republication.

## Singapore Open Data obligations

For HSA data.gov.sg ingestion:

- display conspicuous attribution with dataset name, access date, source and current licence link;
- do not imply official MMS status or HSA/Government endorsement;
- respect API credentials, published rate limits and technical requirements;
- do not mask client identity or disrupt the API;
- retain the dataset version/access date and raw-file checksum;
- account for third-party rights, trademarks and personal data exclusions;
- monitor licence and API-term changes.

Recommended attribution:

> Contains information from the HSA Listing of Registered Therapeutic Products, accessed on [date], from data.gov.sg, made available under the Singapore Open Data Licence version 1.0.

## Evidence publication boundaries

- Public provenance may include source name, source type, URL, observation date, basis and licence attribution.
- Private evidence may include screenshots, downloaded files, hashes, reviewer notes, correspondence, manual quotes and supplier details.
- Do not publish copyrighted screenshots or full source records unless the licence or written permission allows it.
- Do not publish pharmacy staff names, phone numbers, commercial terms or private correspondence.

## Legal approval checklist

No source moves beyond `under_review` until an owner-approved record confirms:

- permitted purpose, including commercial/public comparison where applicable;
- permitted fields and derived values;
- manual versus automated access rights;
- rate limits and security controls;
- retention and screenshot/file evidence rights;
- attribution wording;
- right to display source name and link;
- termination/change monitoring;
- jurisdictional medical-advertising and consumer-protection review.

## Current decisions

- **Approved for connector design, not activation:** HSA data.gov.sg registered therapeutic products.
- **Research/manual only pending permission:** MyPriMe, NPRA, Thai NDI and Thailand central prices.
- **Manual candidate only pending legal review:** commercial pharmacy sources.
- **Do not automate:** any interactive source with CAPTCHA/security checks or unclear terms.
