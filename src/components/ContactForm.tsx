"use client";

import { useState } from "react";
import { memberships } from "@/data/memberships";
import { CTAButton } from "@/components/CTAButton";

const interests = [
  "Discovery discussion",
  "Membership",
  "Health screening",
  "Personalised longevity",
  "Corporate executive wellness",
  "International medicine access intelligence",
  "SCF lab roadmap",
  "Education with Ling",
];

const enquiringFor = ["Myself", "Family member", "Company", "Executive team", "Other"];

const fieldClass =
  "min-h-12 rounded-md border border-gold-light/50 bg-ivory/40 px-4 font-normal text-charcoal transition focus:border-gold focus:bg-white focus:outline-none";

const labelClass = "grid gap-2 text-sm font-semibold text-charcoal";

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
      fullName: String(formData.get("fullName") ?? ""),
      mobileNumber: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      country: String(formData.get("countryCity") ?? ""),
      preferredLanguage: "",
      interestedIn: String(formData.get("mainInterest") ?? ""),
      preferredContactMethod: "Not specified",
      preferredAppointmentDate: String(formData.get("preferredContactTime") ?? ""),
      message: String(formData.get("message") ?? ""),
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

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
      form.reset();
    } catch {
      setError("We could not submit the enquiry. Please contact MMS directly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-gold-light bg-white/[0.94] p-8 shadow-premium">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gold">Enquiry Received</p>
        <h3 className="font-serif text-3xl text-navy">Thank you.</h3>
        <p className="mt-4 leading-7 text-warm-gray">
          Your discovery enquiry has been captured. The MMS team can connect this flow to Zoho later.
        </p>
        <CTAButton onClick={() => setSubmitted(false)} className="mt-6">
          Submit another enquiry
        </CTAButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-gold-light/50 bg-white/[0.94] p-6 shadow-premium md:grid-cols-2 md:p-8">
      <div className="md:col-span-2">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Discovery Enquiry</p>
        <h3 className="mt-2 font-serif text-3xl text-navy">Tell MMS where to begin.</h3>
      </div>
      <label className={labelClass}>
        Full name
        <input name="fullName" required className={fieldClass} />
      </label>
      <label className={labelClass}>
        Phone
        <input name="phone" required className={fieldClass} />
      </label>
      <label className={labelClass}>
        Email
        <input name="email" type="email" required className={fieldClass} />
      </label>
      <label className={labelClass}>
        Country / City
        <input name="countryCity" required className={fieldClass} />
      </label>
      <label className={labelClass}>
        Main interest
        <select name="mainInterest" required className={fieldClass}>
          {interests.map((interest) => (
            <option key={interest}>{interest}</option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        Preferred membership
        <select name="preferredMembership" required className={fieldClass}>
          <option>Not sure yet</option>
          {memberships.map((membership) => (
            <option key={membership.name}>{membership.name}</option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        Enquiring for
        <select name="enquiringFor" required className={fieldClass}>
          {enquiringFor.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        Preferred contact time
        <input name="preferredContactTime" required className={fieldClass} />
      </label>
      <label className={`${labelClass} md:col-span-2`}>
        Message
        <textarea name="message" rows={5} className={`${fieldClass} py-3`} />
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
        <CTAButton type="submit" className={isSubmitting ? "pointer-events-none opacity-70" : ""}>
          {isSubmitting ? "Submitting..." : "Submit Discovery Enquiry"}
        </CTAButton>
      </div>
    </form>
  );
}
