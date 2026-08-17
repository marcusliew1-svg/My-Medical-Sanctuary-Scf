"use client";

import { FormEvent, useState } from "react";

type ApiState = { kind: "idle" | "busy" | "error"; message?: string };

const fieldClass =
  "mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-navy outline-none transition focus:border-gold";
const labelClass = "text-xs font-bold uppercase tracking-[.12em] text-deep-green";

async function submitForm(endpoint: string, form: HTMLFormElement) {
  const response = await fetch(endpoint, { method: "POST", body: new FormData(form) });
  const payload = (await response.json().catch(() => ({}))) as { status?: string; message?: string; checkoutUrl?: string };
  return { response, payload };
}

export function MembershipCheckoutForm({ membership, enabled }: { membership: string; enabled: boolean }) {
  const [state, setState] = useState<ApiState>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || state.kind === "busy") return;
    setState({ kind: "busy" });
    try {
      const { response, payload } = await submitForm("/api/checkout", event.currentTarget);
      if (response.ok && payload.checkoutUrl) {
        window.location.assign(payload.checkoutUrl);
        return;
      }
      setState({ kind: "error", message: payload.message || "Checkout could not be started." });
    } catch {
      setState({ kind: "error", message: "Checkout could not be started. Please try again later." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3">
      <input type="hidden" name="membership" value={membership} />
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="block">
        <span className={labelClass}>Full name</span>
        <input name="fullName" required minLength={2} maxLength={120} autoComplete="name" className={fieldClass} disabled={!enabled} />
      </label>
      <label className="block">
        <span className={labelClass}>Email</span>
        <input name="email" type="email" required maxLength={254} autoComplete="email" className={fieldClass} disabled={!enabled} />
      </label>
      <button type="submit" disabled={!enabled || state.kind === "busy"} className="w-full rounded-full bg-gold px-5 py-3 text-sm font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-45">
        {!enabled ? "Online payment opening soon" : state.kind === "busy" ? "Preparing secure checkout…" : `Pay for ${membership}`}
      </button>
      {state.message ? <p role="alert" className="text-xs leading-5 text-terracotta">{state.message}</p> : null}
    </form>
  );
}

export function SalesPartnerApplicationForm({ enabled }: { enabled: boolean }) {
  const [state, setState] = useState<ApiState>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || state.kind === "busy") return;
    setState({ kind: "busy" });
    try {
      const { response, payload } = await submitForm("/api/sales-partner-application", event.currentTarget);
      if (!response.ok) {
        setState({ kind: "error", message: payload.message || "The application could not be submitted." });
        return;
      }
      setState({ kind: "idle" });
    } catch {
      setState({ kind: "error", message: "The application could not be submitted. Please try again later." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-[2rem] bg-white p-6 shadow-soft md:p-8">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="sourcePath" value="/join-mms" />

      <div>
        <p className="font-serif text-xl text-navy">Tell us about your market and experience</p>
        <p className="mt-1 text-sm leading-6 text-warm-gray">Applications are reviewed before agreement, training and activation. A permanent MMS Partner ID is issued only after approval.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field name="fullName" label="Full name" required disabled={!enabled} autoComplete="name" />
        <Field name="email" label="Email" type="email" required disabled={!enabled} autoComplete="email" />
        <Field name="mobile" label="Mobile / WhatsApp" required disabled={!enabled} autoComplete="tel" />
        <Field name="country" label="Country" required disabled={!enabled} autoComplete="country-name" />
        <Field name="city" label="City" disabled={!enabled} />
        <Field name="nationality" label="Nationality" disabled={!enabled} />
        <Field name="occupation" label="Current occupation / company" disabled={!enabled} />
        <label className="block">
          <span className={labelClass}>Preferred market / territory</span>
          <select name="preferredTerritory" required disabled={!enabled} className={fieldClass} defaultValue="">
            <option value="" disabled>Select a territory</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Thailand">Thailand</option>
            <option value="Malaysia + Thailand">Malaysia + Thailand</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Expected monthly activity</span>
          <select name="expectedMonthlyActivity" required disabled={!enabled} className={fieldClass} defaultValue="">
            <option value="" disabled>Select expected activity</option>
            <option value="0-5">0–5 memberships / month</option>
            <option value="6-15">6–15 memberships / month</option>
            <option value="16+">16+ memberships / month</option>
            <option value="Building team / leadership">Building team / leadership</option>
          </select>
        </label>
        <Field name="referrerCode" label="Existing MMS Partner ID" disabled={!enabled} placeholder="Optional, e.g. MMSP-1001" />
        <Field name="introducer" label="Introducer / referral name" disabled={!enabled} />
      </div>

      <TextArea name="salesBackground" label="Sales background" required disabled={!enabled} placeholder="Tell us what you have sold, your customer profile and how you usually generate relationships or leads." />
      <TextArea name="relevantExperience" label="Relevant healthcare / financial / premium-consumer experience" disabled={!enabled} />

      <div className="grid gap-3 rounded-2xl bg-ivory p-4 md:p-5">
        <p className="text-sm font-semibold text-navy">Application declarations</p>
        <Check name="complianceDeclaration" disabled={!enabled}>I agree to follow MMS compliance rules and use only approved materials, processes and claims.</Check>
        <Check name="approvedRepresentationsDeclaration" disabled={!enabled}>I understand that I must not diagnose, prescribe, guarantee medical outcomes or make unapproved treatment, income or investment claims when representing MMS.</Check>
        <Check name="agreementAcknowledgement" disabled={!enabled}>I understand that approval is not activation. If approved, I must complete the Sales Partner Agreement and required training before representing MMS as an active partner.</Check>
        <Check name="privacyConsent" disabled={!enabled}>I consent to MMS processing this information for Sales Partner recruitment, screening and follow-up.</Check>
      </div>

      <button type="submit" disabled={!enabled || state.kind === "busy"} className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45">
        {!enabled ? "Online applications opening soon" : state.kind === "busy" ? "Submitting…" : "Submit Sales Partner application"}
      </button>
      {state.message ? <p role="alert" className="text-sm text-terracotta">{state.message}</p> : null}
      <p className="text-xs leading-5 text-warm-gray">Bank, tax and payout details are not requested at application stage. They are collected only after approval through the authorised onboarding process.</p>
    </form>
  );
}

export function CareersApplicationForm({ enabled, roles }: { enabled: boolean; roles: string[] }) {
  const [state, setState] = useState<ApiState>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || state.kind === "busy") return;
    setState({ kind: "busy" });
    try {
      const { response, payload } = await submitForm("/api/careers-application", event.currentTarget);
      if (!response.ok) {
        setState({ kind: "error", message: payload.message || "The application could not be submitted." });
        return;
      }
      setState({ kind: "idle" });
    } catch {
      setState({ kind: "error", message: "The application could not be submitted. Please try again later." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-soft md:p-8">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="sourcePath" value="/careers" />
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="fullName" label="Full name" required disabled={!enabled} autoComplete="name" />
        <Field name="email" label="Email" type="email" required disabled={!enabled} autoComplete="email" />
        <Field name="mobile" label="Mobile" required disabled={!enabled} autoComplete="tel" />
        <Field name="location" label="Current location" required disabled={!enabled} />
        <label className="block">
          <span className={labelClass}>Role family</span>
          <select name="role" required disabled={!enabled} className={fieldClass} defaultValue="">
            <option value="" disabled>Select a role family</option>
            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
        </label>
        <Field name="currentPosition" label="Current position" disabled={!enabled} />
        <Field name="yearsExperience" label="Years of relevant experience" disabled={!enabled} />
        <Field name="availability" label="Notice period / availability" disabled={!enabled} />
        <Field name="expectedSalary" label="Expected salary (optional)" disabled={!enabled} />
        <Field name="linkedin" label="LinkedIn (optional)" type="url" disabled={!enabled} />
        <Field name="portfolio" label="Portfolio link (optional)" type="url" disabled={!enabled} />
        <Field name="resumeReference" label="CV / resume reference" disabled={!enabled} placeholder="Upload connection will be enabled with HR system" />
      </div>
      <Check name="privacyConsent" disabled={!enabled}>I consent to MMS processing this information for recruitment, screening and follow-up.</Check>
      <button type="submit" disabled={!enabled || state.kind === "busy"} className="rounded-full bg-deep-green px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45">
        {!enabled ? "Online applications opening soon" : state.kind === "busy" ? "Submitting…" : "Submit career application"}
      </button>
      {state.message ? <p role="alert" className="text-sm text-terracotta">{state.message}</p> : null}
      <p className="text-xs leading-5 text-warm-gray">CV upload and permanent applicant storage will be enabled only when the approved HR system is connected.</p>
    </form>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="block"><span className={labelClass}>{label}</span><input {...props} className={fieldClass} /></label>;
}

function TextArea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return <label className="block"><span className={labelClass}>{label}</span><textarea {...props} rows={4} className={fieldClass} /></label>;
}

function Check({ name, disabled, children }: { name: string; disabled?: boolean; children: React.ReactNode }) {
  return <label className="flex items-start gap-3 text-sm leading-6 text-warm-gray"><input type="checkbox" name={name} value="true" required disabled={disabled} className="mt-1 size-4 accent-[#315B4C]" /><span>{children}</span></label>;
}
