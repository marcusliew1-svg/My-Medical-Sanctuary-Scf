import Image from "next/image";
import Link from "next/link";

export function SanctuaryExperience() {
  return (
    <section className="relative overflow-hidden bg-[#eee8dc] px-4 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <div className="relative min-h-[640px]">
            <div className="absolute left-0 top-0 h-[78%] w-[78%] overflow-hidden rounded-[2.5rem] shadow-[0_40px_120px_rgba(11,26,46,0.16)]">
              <Image
                src="/mms-concierge-lounge.png"
                alt="Calm private MMS consultation and concierge environment."
                fill
                className="object-cover transition duration-[1400ms] hover:scale-[1.025]"
                sizes="(min-width: 1024px) 52vw, 100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(7,21,29,0.28))]" />
            </div>

            <div className="absolute bottom-0 right-0 h-[47%] w-[48%] overflow-hidden rounded-[2rem] border-[8px] border-[#eee8dc] shadow-[0_28px_80px_rgba(11,26,46,0.18)]">
              <Image
                src="/mms-doctor-couple-consult.png"
                alt="MMS doctor in a private preventive health consultation."
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 24vw, 48vw"
              />
            </div>

            <div className="absolute bottom-[7%] left-[4%] max-w-[230px] rounded-[1.4rem] border border-white/60 bg-[#f8f4ec]/90 p-5 shadow-[0_22px_70px_rgba(11,26,46,0.12)] backdrop-blur-xl">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-deep-green">Designed around people</p>
              <p className="mt-2 font-serif text-2xl leading-tight text-navy">Privacy without clinical coldness.</p>
            </div>
          </div>

          <div className="lg:pl-8">
            <p className="editorial-kicker mb-5 text-deep-green">The sanctuary</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
              Serious medicine. A calmer way to experience it.
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-warm-gray">
              MMS combines medical responsibility with a more considered patient experience—private, unhurried and designed for continuity rather than episodic transactions.
            </p>

            <div className="mt-10 border-y border-gold/30">
              <div className="grid gap-4 border-b border-gold/20 py-6 sm:grid-cols-[0.35fr_1fr]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-deep-green">Bangsar</p>
                <div>
                  <h3 className="font-serif text-2xl text-navy">Preventive health & longevity</h3>
                  <p className="mt-2 text-sm leading-6 text-warm-gray">Discovery, physician consultation, health intelligence and personalised planning.</p>
                </div>
              </div>
              <div className="grid gap-4 py-6 sm:grid-cols-[0.35fr_1fr]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-deep-green">SS2</p>
                <div>
                  <h3 className="font-serif text-2xl text-navy">Specialised clinical care</h3>
                  <p className="mt-2 text-sm leading-6 text-warm-gray">A more clinical setting built around reliability, dignity and continuity.</p>
                </div>
              </div>
            </div>

            <Link
              href="/clinics"
              className="mt-8 inline-flex text-sm font-semibold text-deep-green underline decoration-gold/60 underline-offset-8"
            >
              Explore MMS locations
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
