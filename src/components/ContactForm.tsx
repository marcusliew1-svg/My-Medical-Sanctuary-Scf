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
  "Education with Ling",
];

const enquiringFor = ["Myself", "Family member", "Company", "Executive team", "Other"];

const fieldClass =
  "min-h-12 rounded-[0.9rem] border border-gold-light/45 bg-[#fbf8f2] px-4 font-normal text-charcoal transition placeholder:text-warm-gray/55 hover:border-gold/55 focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-light/35";

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
      message: [
        String(formData.get("message") ?? ""),
        `Enquiring for: ${String(formData.get("enquiringFor") ?? "Not specified")}`,
        `Preferred membership: ${String(formData.get("preferredMembership") ?? "Not sure yet")}`,
      ].filter(Boolean).join("\n"),
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
      <div className="rounded-[1.5rem] border border-gold-light bg-white/[0.94] p-8 shadow-premium">
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
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-[2rem] border border-gold-light/45 bg-white/[0.96] p-6 shadow-[0_30px_90px_rgba(11,26,46,0.10)] md:grid-cols-2 md:p-9">
      <div className="md:col-span-2">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-gold/35 bg-gold/10 text-[0.65rem] font-bold text-deep-green">01</span>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-deep-green">Private discovery enquiry</p>
        </div>
        <h3 className="mt-4 font-serif text-3xl text-navy md:text-4xl">Tell us where to begin.</h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-warm-gray">
          This is not a medical consultation. It helps MMS understand who should contact you and what pathway may be relevant.
        </p>
      </div>
      <label className={labelClass}>
        Full name
        <input name="fullName" required className={fieldClass} />
      </label>
      <label className={labelClass}>
        Phone / WhatsApp
        <input name="phone" required className={fieldClass} placeholder="+60 / +65 / +66 ..." />
      </label>
      <label className={labelClass}>
        Email
        <input name="email" type="email" required className={fieldClass} />
      </label>
      <label className={labelClass}>
        Country / City
        <input name="countryCity" required className={fieldClass} placeholder="e.g. Kuala Lumpur" />
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
        Preferred support level
        <select name="preferredMembership" className={fieldClass}>
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
        <input name="preferredContactTime" required className={fieldClass} placeholder="e.g. Weekday mornings" />
      </label>
      <label className={`${labelClass} md:col-span-2`}>
        What would you like MMS to help you understand?
        <textarea name="message" rows={5} className={`${fieldClass} py-3`} placeholder="Share the concern, goal or question that brought you here." />
      </label>
      <label className="flex gap-3 rounded-[1rem] border border-gold-light/35 bg-[#faf7f1] p-4 text-sm leading-6 text-charcoal md:col-span-2">
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
          {isSubmitting ? "Submitting..." : "Send private enquiry"}
        </CTAButton>
      </div>
    </form>
  );
}
