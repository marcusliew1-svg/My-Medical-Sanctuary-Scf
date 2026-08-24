import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { HomeHeroVisual } from "@/components/HomeHeroVisual";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = {
  title: "Preventive Care • Personalised Longevity",
  description:
    "A private, physician-guided preventive health and personalised longevity journey across Malaysia and Thailand.",
};

const pathways = [
  {
    eyebrow: "01",
    title: "Preventive Health & Screening",
    copy: "Screening, health discovery and physician review designed to help you understand where you are today.",
    href: "/health-screening",
  },
  {
    eyebrow: "02",
    title: "Longevity & Cellular Wellness",
    copy: "A considered approach to energy, healthy ageing and selected physician-reviewed cellular wellness options.",
    href: "/longevity-medicine",
  },
  {
    eyebrow: "03",
    title: "Metabolic & Hormonal Health",
    copy: "Medical assessment and structured support around metabolic health, hormones, weight and vitality.",
    href: "/weight-management",
  },
  {
    eyebrow: "04",
    title: "Performance & Recovery",
    copy: "Sleep, stress, recovery and performance support for people who want to feel and function better.",
    href: "/treatments",
  },
  {
    eyebrow: "05",
    title: "Regenerative & Advanced Wellness",
    copy: "Selected advanced and regenerative pathways considered individually after professional review.",
    href: "/treatments",
  },
];

const method = [
  ["01", "Discover", "Goals, health history, screening and diagnostics."],
  ["02", "Understand", "Qualified medical review and interpretation."],
  ["03", "Personalise", "A plan shaped around you, not a generic protocol."],
  ["04", "Evolve", "Ongoing review, continuity and optimisation over time."],
];

const treatments = [
  ["Cellular wellness", "NAD+, antioxidant support and related physician-reviewed approaches."],
  ["Regenerative support", "PRP, PRGF and selected regenerative pathways where clinically appropriate."],
  ["Recovery & oxygen", "Hyperbaric oxygen, red-light and recovery-focused programmes."],
  ["Metabolic & hormonal", "Assessment-led support around hormones, metabolic health and vitality."],
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[#f4efe7]">
      <HomeHeroVisual />

      <section className="border-y border-[#d9cdbf]/70 bg-[#efe7dc] px-4 py-7">
        <div className="mx-auto grid max-w-7xl gap-5 text-center sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Physician guided", "Clinical decisions remain human"],
            ["Preventive focus", "Understand health before problems escalate"],
            ["Personalised", "Programmes shaped around individual goals"],
            ["Regional care", "Malaysia + Thailand coordination"],
          ].map(([title, copy]) => (
            <div key={title} className="px-4 py-2">
              <p className="font-serif text-xl text-navy">{title}</p>
              <p className="mt-1 text-xs leading-5 text-warm-gray">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f8f3eb] px-4 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[.24em] text-terracotta">Our point of view</p>
            <h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-6xl">
              Your health is more than a collection of symptoms.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              MMS brings screening, medical review, wellness planning and ongoing coordination into one more thoughtful health journey.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CTAButton href="/about-mms">Discover MMS</CTAButton>
              <CTAButton href="/how-it-works" variant="outline">How care works</CTAButton>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Understand", "Build a clearer picture through screening and professional review."],
              ["Personalise", "Shape the next step around your health, priorities and circumstances."],
              ["Optimise", "Continue with structured support for prevention, vitality and healthy ageing."],
            ].map(([title, copy], index) => (
              <article
                key={title}
                className={`min-h-[330px] rounded-[2rem] border p-6 shadow-[0_24px_60px_rgba(30,40,42,.08)] ${
                  index === 1
                    ? "border-[#b99172]/30 bg-[#173d43] text-ivory sm:-translate-y-7"
                    : "border-[#d8cabd] bg-white/75 text-navy"
                }`}
              >
                <p className={`text-[10px] font-bold uppercase tracking-[.2em] ${index === 1 ? "text-[#deb991]" : "text-terracotta"}`}>
                  0{index + 1}
                </p>
                <h3 className="mt-10 font-serif text-3xl">{title}</h3>
                <p className={`mt-5 text-sm leading-7 ${index === 1 ? "text-ivory/68" : "text-warm-gray"}`}>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#efe5d7] px-4 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.24em] text-terracotta">Signature health pathways</p>
              <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] text-navy md:text-6xl">
                Care designed around where you are — and where you want to go.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-warm-gray lg:justify-self-end">
              Start with the health question, not the treatment menu. Suitability and recommendations remain subject to professional assessment.
            </p>
          </div>

          <div className="mt-14 divide-y divide-[#cdbbaa] border-y border-[#cdbbaa]">
            {pathways.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group grid gap-4 py-7 transition md:grid-cols-[90px_1fr_1fr_36px] md:items-center md:py-9"
              >
                <span className="text-xs font-bold tracking-[.2em] text-terracotta">{item.eyebrow}</span>
                <h3 className="font-serif text-3xl text-navy transition group-hover:translate-x-1 md:text-4xl">{item.title}</h3>
                <p className="max-w-xl text-sm leading-7 text-warm-gray">{item.copy}</p>
                <span className="text-xl text-terracotta transition group-hover:translate-x-2">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[620px] overflow-hidden bg-navy">
        <Image
          src="/mms-membership-journey.webp"
          alt="Healthy ageing and quality of life"
          fill
          className="object-cover opacity-65"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,31,42,.95),rgba(10,31,42,.72)_45%,rgba(10,31,42,.18))]" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-4 py-20">
          <div className="max-w-2xl text-ivory">
            <p className="text-[11px] font-bold uppercase tracking-[.24em] text-[#e1b98f]">The long view</p>
            <blockquote className="mt-6 font-serif text-5xl leading-[1.04] md:text-7xl">
              Longevity is not simply about adding years.
              <span className="mt-2 block text-[#e8c9a8]">It is about protecting the quality of the years ahead.</span>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="bg-[#11343b] px-4 py-24 text-ivory md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.24em] text-[#ddb78f]">The MMS Method</p>
              <h2 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">A clearer path to better health decisions.</h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-ivory/64 lg:justify-self-end">
              Technology can organise information. Professional judgement determines what is appropriate for the individual.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-4">
            {method.map(([number, title, copy]) => (
              <div key={number} className="min-h-[310px] bg-[#11343b] p-7">
                <p className="text-xs font-bold tracking-[.2em] text-[#dcb389]">{number}</p>
                <div className="mt-20 h-px w-12 bg-[#dcb389]/45" />
                <h3 className="mt-7 font-serif text-3xl">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-ivory/62">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f1e8] px-4 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="relative min-h-[620px] overflow-hidden rounded-[2.5rem] bg-[#d6c9b9] shadow-[0_35px_90px_rgba(50,40,30,.16)]">
            <Image
              src="/mms-about-hero.png"
              alt="MMS physician-led care"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 52vw, 100vw"
            />
            <div className="absolute inset-x-6 bottom-6 rounded-[1.5rem] border border-white/25 bg-[#102f35]/82 p-6 text-ivory backdrop-blur-xl md:inset-x-8 md:bottom-8 md:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#e4bc93]">Medical leadership</p>
              <p className="mt-2 max-w-xl font-serif text-2xl md:text-3xl">Advanced options should never replace careful assessment and medical judgement.</p>
            </div>
          </div>

          <div className="lg:pl-10">
            <p className="text-[11px] font-bold uppercase tracking-[.24em] text-terracotta">Medical trust</p>
            <h2 className="mt-5 font-serif text-5xl leading-[1.03] text-navy md:text-6xl">Medicine remains at the centre of everything we do.</h2>
            <p className="mt-7 text-lg leading-8 text-warm-gray">
              Diagnostics, technology and advanced therapies can expand the conversation, but thoughtful care still begins with understanding the individual.
            </p>
            <p className="mt-5 text-base leading-8 text-warm-gray">
              MMS keeps personalised medical decisions with qualified healthcare professionals and uses Ling only to help people ask, understand and prepare.
            </p>
            <div className="mt-9"><CTAButton href="/about-mms">Our philosophy of care</CTAButton></div>
          </div>
        </div>
      </section>

      <section className="bg-[#e9dfd2] px-4 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.24em] text-terracotta">The sanctuary experience</p>
              <h2 className="mt-4 font-serif text-5xl leading-[1.05] text-navy md:text-6xl">Healthcare should feel considered from the moment you arrive.</h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-warm-gray lg:justify-self-end">
              Private conversations, calm spaces and coordinated care — designed to feel less transactional and more personal.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
            <div className="relative min-h-[520px] overflow-hidden rounded-[2rem]">
              <Image src="/mms-health-screening-hero.png" alt="MMS health and wellness environment" fill className="object-cover" sizes="(min-width: 1024px) 70vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 max-w-lg text-ivory">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#e8c59f]">Private preventive care</p>
                <p className="mt-2 font-serif text-3xl">A calmer environment for more thoughtful conversations about health.</p>
              </div>
            </div>
            <div className="grid gap-5">
              <div className="rounded-[2rem] bg-[#173f43] p-7 text-ivory">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#dfb98f]">Bangsar</p>
                <h3 className="mt-4 font-serif text-3xl">Wellness & preventive care.</h3>
                <p className="mt-4 text-sm leading-7 text-ivory/62">Designed as the warm, premium-facing wellness expression of MMS.</p>
              </div>
              <div className="rounded-[2rem] border border-[#cdb9a4] bg-[#f7f1e8] p-7 text-navy">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-terracotta">SS2</p>
                <h3 className="mt-4 font-serif text-3xl">Specialised medical care.</h3>
                <p className="mt-4 text-sm leading-7 text-warm-gray">A more clinically grounded setting for dedicated medical services.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#102f36] px-4 py-24 text-ivory md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.24em] text-[#dcb58e]">Memberships</p>
              <h2 className="mt-4 font-serif text-5xl leading-[1.04] md:text-6xl">A deeper relationship with your health.</h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-ivory/62 lg:justify-self-end">
              Four levels of continuity and coordination, designed around different depths of engagement rather than public price comparison.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {memberships.map((membership, index) => (
              <Link
                href="/memberships"
                key={membership.name}
                className={`group min-h-[390px] rounded-[2rem] border p-7 transition duration-500 hover:-translate-y-2 ${
                  index === 3
                    ? "border-[#e1b58a]/40 bg-[#e6c39f] text-navy"
                    : "border-white/12 bg-white/[.045] text-ivory"
                }`}
              >
                <p className={`text-[10px] font-bold uppercase tracking-[.2em] ${index === 3 ? "text-[#7d4f32]" : "text-[#d9b086]"}`}>Level {index + 1}</p>
                <h3 className="mt-8 font-serif text-4xl">{membership.name}</h3>
                <p className={`mt-4 text-sm font-semibold ${index === 3 ? "text-navy/72" : "text-ivory/78"}`}>{membership.tagline}</p>
                <div className="mt-20">
                  <p className={`text-sm leading-7 ${index === 3 ? "text-navy/66" : "text-ivory/58"}`}>{membership.accessNote}</p>
                  <p className={`mt-7 border-t pt-5 text-xs font-bold uppercase tracking-[.16em] ${index === 3 ? "border-navy/15 text-[#7d4f32]" : "border-white/10 text-[#dfb98f]"}`}>
                    Explore membership →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f3eb] px-4 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.24em] text-terracotta">Advanced options</p>
              <h2 className="mt-4 font-serif text-5xl leading-[1.04] text-navy md:text-6xl">Considered individually.</h2>
              <p className="mt-6 text-base leading-8 text-warm-gray">
                Availability and suitability vary. Professional medical assessment is required before personalised treatment recommendations.
              </p>
              <div className="mt-8"><CTAButton href="/treatments">Explore treatment education</CTAButton></div>
            </div>
            <div className="divide-y divide-[#d3c3b3] border-y border-[#d3c3b3]">
              {treatments.map(([title, copy]) => (
                <div key={title} className="grid gap-3 py-7 md:grid-cols-[.8fr_1.2fr] md:items-start">
                  <h3 className="font-serif text-3xl text-navy">{title}</h3>
                  <p className="text-sm leading-7 text-warm-gray">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#173b42] px-4 py-24 text-ivory md:py-32">
        <div className="absolute -right-16 top-1/2 h-[35rem] w-[35rem] -translate-y-1/2 rounded-full border border-[#ddb48c]/10" />
        <div className="absolute right-20 top-1/2 h-[25rem] w-[25rem] -translate-y-1/2 rounded-full border border-[#ddb48c]/10" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="text-[11px] font-bold uppercase tracking-[.24em] text-[#dfb78f]">Ling</p>
            <h2 className="mt-5 font-serif text-5xl leading-[1.04] md:text-6xl">A simpler way to begin.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/68">
              Ask questions, explore MMS and prepare for a more informed conversation with our team. Ling does not diagnose or replace professional medical care.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[.14em] text-[#e5c19e]">
              <span>Ask</span><span className="text-white/20">→</span><span>Understand</span><span className="text-white/20">→</span><span>Prepare</span><span className="text-white/20">→</span><span>Human care</span>
            </div>
            <div className="mt-9"><CTAButton href="/ling">Start with Ling</CTAButton></div>
          </div>
          <div className="order-1 mx-auto w-full max-w-xl lg:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/12 bg-white/5 shadow-[0_35px_100px_rgba(0,0,0,.3)]">
              <Image src="/ling-mms-guide.png" alt="Ling, MMS intelligent health guide" fill className="object-cover object-[50%_18%]" sizes="(min-width: 1024px) 44vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173b42]/95 via-transparent to-transparent" />
              <div className="absolute inset-x-6 bottom-6 rounded-[1.4rem] border border-white/12 bg-[#102f36]/80 p-5 backdrop-blur-xl">
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#e0b68c]">Health concierge intelligence</p>
                <p className="mt-2 font-serif text-2xl">Technology organises. People care.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eee4d7] px-4 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="relative min-h-[540px] overflow-hidden rounded-[2.25rem]">
            <Image src="/mms-service-collage.webp" alt="Malaysia and Thailand coordinated care" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 rounded-full border border-white/20 bg-navy/65 px-4 py-2 text-xs font-bold uppercase tracking-[.14em] text-ivory backdrop-blur-md">
              Malaysia ↔ Thailand
            </div>
          </div>
          <div className="lg:pl-8">
            <p className="text-[11px] font-bold uppercase tracking-[.24em] text-terracotta">Regional care</p>
            <h2 className="mt-5 font-serif text-5xl leading-[1.03] text-navy md:text-6xl">One health journey. More possibilities across the region.</h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              MMS can help coordinate care navigation, consultation preparation and selected health journeys across Malaysia and Thailand, while each provider remains responsible for the care they deliver.
            </p>
            <div className="mt-9"><CTAButton href="/malaysia-thailand-care">Explore regional care</CTAButton></div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f3eb] px-4 py-24 md:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[.24em] text-terracotta">Begin with a conversation</p>
          <h2 className="mx-auto mt-5 max-w-5xl font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Your health deserves more than a once-a-year check-up.</h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-warm-gray">
            Begin with a conversation and explore a more personalised approach to your long-term health.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <CTAButton href="/book-appointment">Book a consultation</CTAButton>
            <CTAButton href="/ling" variant="outline">Start with Ling</CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}
