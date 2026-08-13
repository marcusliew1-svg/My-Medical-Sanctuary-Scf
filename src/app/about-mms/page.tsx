import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { platformModules } from "@/data/platformModules";
import { EcosystemVisual } from "@/components/EcosystemVisual";
import { ServiceExplorer } from "@/components/ServiceExplorer";

export const metadata: Metadata = {
  title: "About MMS",
  description:
    "Learn how My Medical Sanctuary moves wellness from random purchases to a structured membership journey.",
};

export default function AboutMMSPage() {
  return (
    <main>
      <Hero
        eyebrow="About MMS"
        title="From random purchases to a structured wellness journey."
        subtitle="My Medical Sanctuary is built around discovery, HRM coordination, professional review and personalised longevity."
        image="/mms-about-hero.webp"
      />
      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-premium md:grid-cols-2"><div className="relative min-h-[420px]"><Image src="/mms-service-collage.webp" alt="Warm, coordinated MMS preventive healthcare experience" fill className="object-cover" sizes="50vw" /></div><div className="flex flex-col justify-center p-8 md:p-12"><p className="text-xs font-bold uppercase tracking-[.18em] text-gold">Why MMS</p><h2 className="mt-4 font-serif text-4xl leading-tight text-navy">One relationship for your changing health needs.</h2><div className="mt-7 grid grid-cols-2 gap-3">{["Understand","Plan","Coordinate","Continue"].map((item,index)=><div key={item} className="rounded-xl bg-ivory p-4"><span className="text-xs font-bold text-gold">0{index+1}</span><p className="mt-2 font-serif text-xl text-navy">{item}</p></div>)}</div></div></div>
          <div className="mt-8">
            <DisclaimerBox title="Clinical and lab roadmap">
              <p>
                MMS aims to develop deeper clinical and lab capability in 2027, subject to regulatory, licensing, funding, technical and professional requirements.
              </p>
            </DisclaimerBox>
          </div>
        </div>
      </section>
      <section className="bg-warm-white px-4 py-20"><div className="mx-auto max-w-6xl"><SectionHeader eyebrow="Services" title="Support that feels personal." description="Explore the needs MMS can help organise."/><ServiceExplorer /></div></section>
      <section className="bg-warm-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="The platform" title="Care, intelligence and future science." description="Three connected engines extend the patient relationship." />
          <EcosystemVisual />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {platformModules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="rounded-lg border border-gold-light bg-ivory p-6 transition hover:-translate-y-1 hover:border-gold"
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">
                  {module.eyebrow}
                </p>
                <h2 className="mt-3 font-serif text-2xl text-navy">{module.title}</h2>
                <p className="mt-4 leading-7 text-warm-gray">{module.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
