"use client";

import { useState } from "react";
import { CTAButton } from "@/components/CTAButton";
import {
  bookingEnquiringFor,
  bookingInterests,
  bookingMembershipOptions,
} from "@/lib/bookingOptions";

const fieldClass =
  "min-h-12 rounded-md border border-gold-light/50 bg-ivory/40 px-4 font-normal text-charcoal transition focus:border-gold focus:bg-white focus:outline-none";

const labelClass = "grid gap-2 text-sm font-semibold text-charcoal";
const onlineEnquiryAvailable = false;

type BookingResponse = {
  status?: string;
  message?: string;
};

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      mobileNumber: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      country: String(formData.get("countryCity") ?? "").trim(),
      interestedIn: String(formData.get("mainInterest") ?? "").trim(),
      preferredMembership: String(formData.get("preferredMembership") ?? "").trim(),
      enquiringFor: String(formData.get("enquiringFor") ?? "").trim(),
      preferredContactTime: String(formData.get("preferredContactTime") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim(),
      consentToContact: formData.get("consent") === "on" ? "true" : "false",
      consentVersion: "MMS-WEB-2026-08-v1",
      sourcePath: window.location.pathname,
    };

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as BookingResponse | null;

      if (response.ok && data?.status === "persisted") {
        setSubmitted(true);
        form.reset();
        return;
      }

      if (response.status === 503 && data?.status === "not_persisted") {
        setError("Online enquiry submission is temporarily unavailable. Please try again later.");
        return;
      }

      if (response.status === 400) {
        setError(data?.message ?? "Please check your details and try again.");
        return;
      }

      if (response.status === 429) {
        setError("Too many attempts were received. Please wait and try again later.");
        return;
      }

      setError("We could not submit the enquiry. Please try again later.");
    } catch {
      setError("We could not submit the enquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!onlineEnquiryAvailable) {
    return (
      <div className="rounded-lg border border-gold-light bg-white/[0.94] p-8 shadow-premium">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gold">Discovery Enquiry</p>
        <h3 className="font-serif text-3xl text-navy">Online submission is temporarily unavailable.</h3>
        <p className="mt-4 leading-7 text-warm-gray">
          MMS is not yet saving website enquiries into its CRM. The online form will return once verified persistence is enabled.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-lg border border-gold-light bg-white/[0.94] p-8 shadow-premium"
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gold">Enquiry Sent</p>
        <h3 className="font-serif text-3xl text-navy">Thank you.</h3>
        <p className="mt-4 leading-7 text-warm-gray">
          Your enquiry was successfully received by MMS and is ready for human review.
        </p>
        <CTAButton onClick={() => setSubmitted(false)} className="mt-6">
          Submit another enquiry
        </CTAButton>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
      className="grid gap-5 rounded-lg border border-gold-light/50 bg-white/[0.94] p-6 shadow-premium md:grid-cols-2 md:p-8"
    >
      <div className="md:col-span-2">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Discovery Enquiry</p>
        <h3 className="mt-2 font-serif text-3xl text-navy">Tell MMS where to begin.</h3>
      </div>

      <label className={labelClass}>
        Full name
        <input name="fullName" autoComplete="name" maxLength={120} required className={fieldClass} />
      </label>

      <label className={labelClass}>
        Phone
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={40}
          required
          className={fieldClass}
        />
      </label>

      <label className={labelClass}>
        Email
        <input name="email" type="email" autoComplete="email" maxLength={254} required className={fieldClass} />
      </label>

      <label className={labelClass}>
        Country / City
        <input name="countryCity" autoComplete="off" maxLength={120} required className={fieldClass} />
      </label>

      <label className={labelClass}>
        Main interest
        <select name="mainInterest" required className={fieldClass}>
          {bookingInterests.map((interest) => (
            <option key={interest}>{interest}</option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        Preferred membership
        <select name="preferredMembership" required className={fieldClass}>
          {bookingMembershipOptions.map((membership) => (
            <option key={membership}>{membership}</option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        Enquiring for
        <select name="enquiringFor" required className={fieldClass}>
          {bookingEnquiringFor.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        Preferred contact time
        <input name="preferredContactTime" maxLength={120} required className={fieldClass} />
      </label>

      <div className="md:col-span-2">
        <p className="rounded-md border border-gold-light/40 bg-ivory p-4 text-sm leading-6 text-charcoal">
          Please avoid adding medical records, identity numbers or unnecessary sensitive health details here. Share only what MMS needs to understand your enquiry.
        </p>
      </div>

      <label className={`${labelClass} md:col-span-2`}>
        Message
        <textarea name="message" rows={5} maxLength={1500} className={`${fieldClass} py-3`} />
      </label>

      <label aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
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
