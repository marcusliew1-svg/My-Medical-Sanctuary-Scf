"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CTAButton } from "@/components/CTAButton";
import {
  bookingEnquiringFor,
  bookingInterests,
  bookingLocales,
  bookingMembershipOptions,
} from "@/lib/bookingOptions";
import { BOOKING_CONSENT_VERSION } from "@/lib/bookingSubmission";
import { appendSafeAttributionQuery, currentLocaleForPath } from "@/lib/i18nRouting";

const fieldClass =
  "min-h-12 min-w-0 w-full rounded-md border border-gold-light/50 bg-ivory/45 px-4 font-normal text-charcoal transition focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-light/45";

const labelClass = "grid gap-2 text-sm font-semibold text-charcoal";

export function ContactForm() {
  const pathname = usePathname();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionLock = useRef(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionLock.current) return;
    submissionLock.current = true;
    setError(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const query = new URLSearchParams(appendSafeAttributionQuery("/", window.location.search).split("?")[1] || "");
    const requestedLocale = new URLSearchParams(window.location.search).get("locale") || "";
    const preferredLanguage = bookingLocales.includes(requestedLocale as (typeof bookingLocales)[number])
      ? requestedLocale
      : currentLocaleForPath(pathname);
    query.set("locale", preferredLanguage);

    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      mobileNumber: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      country: String(formData.get("countryCity") ?? "").trim(),
      preferredLanguage,
      interestedIn: String(formData.get("mainInterest") ?? "").trim(),
      preferredMembership: String(formData.get("preferredMembership") ?? "").trim(),
      enquiringFor: String(formData.get("enquiringFor") ?? "").trim(),
      preferredContactMethod: "not_specified",
      preferredAppointmentDate: String(formData.get("preferredContactTime") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      consentToContact: formData.get("consent") === "on" ? "true" : "false",
      consentVersion: BOOKING_CONSENT_VERSION,
      sourcePath: pathname,
      sourceQuery: query.toString(),
      website: String(formData.get("website") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as { status?: string; message?: string } | null;

      if (response.ok && data?.status === "persisted") {
        setSubmitted(true);
        form.reset();
        return;
      }

      if (response.status === 400) {
        setError(data?.message || "Please check your details and try again.");
      } else if (response.status === 429) {
        setError("Too many attempts were received. Please wait and try again later.");
      } else if (response.status === 503) {
        setError("Online enquiry submission is temporarily unavailable. Please try again later.");
      } else {
        setError("We could not submit the enquiry. Please try again later.");
      }
    } catch {
      setError("We could not submit the enquiry. Please try again later.");
    } finally {
      submissionLock.current = false;
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div role="status" aria-live="polite" className="rounded-[1.5rem] border border-gold-light bg-white/[0.94] p-8 shadow-premium">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gold">Enquiry Received</p>
        <h3 className="font-serif text-3xl text-navy">Thank you.</h3>
        <p className="mt-4 leading-7 text-warm-gray">
          Your discovery enquiry has been captured. The MMS team will review your context and guide the next appropriate step.
        </p>
        <CTAButton onClick={() => setSubmitted(false)} className="mt-6">
          Submit another enquiry
        </CTAButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={isSubmitting} className="grid min-w-0 w-full gap-5 rounded-[1.5rem] border border-gold-light/50 bg-white/[0.94] p-6 shadow-premium md:grid-cols-2 md:p-8">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="md:col-span-2">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Discovery Enquiry</p>
        <h3 className="mt-2 font-serif text-3xl text-navy">Tell us where to begin.</h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-warm-gray">
          This is not a medical consultation. It helps MMS understand who should contact you and what pathway may be relevant.
        </p>
      </div>
      <label className={labelClass}>
        Full name
        <input name="fullName" required minLength={2} maxLength={120} autoComplete="name" className={fieldClass} />
      </label>
      <label className={labelClass}>
        Phone
        <input name="phone" type="tel" inputMode="tel" required minLength={6} maxLength={40} autoComplete="tel" className={fieldClass} />
      </label>
      <label className={labelClass}>
        Email
        <input name="email" type="email" required maxLength={254} autoComplete="email" className={fieldClass} />
      </label>
      <label className={labelClass}>
        Country / City
        <input name="countryCity" required maxLength={120} autoComplete="country-name" className={fieldClass} />
      </label>
      <label className={labelClass}>
        Main interest
        <select name="mainInterest" required className={fieldClass}>
          {bookingInterests.map((interest) => (
            <option key={interest.value} value={interest.value}>{interest.label}</option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        Preferred membership
        <select name="preferredMembership" required className={fieldClass}>
          {bookingMembershipOptions.map((membership) => (
            <option key={membership.value} value={membership.value}>{membership.label}</option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        Enquiring for
        <select name="enquiringFor" required className={fieldClass}>
          {bookingEnquiringFor.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        Preferred contact time
        <input name="preferredContactTime" required maxLength={120} className={fieldClass} />
      </label>
      <p className="rounded-md border border-gold-light/40 bg-ivory p-4 text-sm leading-6 text-charcoal md:col-span-2">
        Please do not include identity numbers, medical records, prescriptions, laboratory results or detailed medical history. Share only the context needed to route your enquiry.
      </p>
      <label className={`${labelClass} md:col-span-2`}>
        Message
        <textarea name="message" rows={5} maxLength={1500} className={`${fieldClass} py-3`} />
      </label>
      <label className="flex gap-3 rounded-md border border-gold-light/40 bg-ivory p-4 text-sm leading-6 text-charcoal md:col-span-2">
        <input name="consent" type="checkbox" required className="mt-1 size-4 accent-gold" />
        <span>
          I consent to My Medical Sanctuary contacting me about my enquiry. I understand this form does not create a medical relationship.
        </span>
      </label>
      {error ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 md:col-span-2">
          {error}
        </p>
      ) : null}
      <div className="md:col-span-2">
        <CTAButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Discovery Enquiry"}
        </CTAButton>
      </div>
    </form>
  );
}
