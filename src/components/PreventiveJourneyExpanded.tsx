import Image from "next/image";
import Link from "next/link";

const systems = [
  { title: "Brain & cognition", text: "Memory, focus, mood and neurological wellbeing." },
  { title: "Heart & circulation", text: "Blood pressure, lipids and cardiovascular risk context." },
  { title: "Metabolic health", text: "Glucose regulation, insulin sensitivity, liver health and body composition." },
  { title: "Hormonal health", text: "Thyroid and other clinically relevant hormonal signals." },
  { title: "Inflammation & immunity", text: "Inflammatory and immune markers when clinically appropriate." },
  { title: "Muscle & movement", text: "Muscle, fat, bone and functional health across ageing." },
];

const continuity = [
  "Regular checks and monitoring",
  "Expert guidance and support",
  "Personalised recommendations",
  "Progress tracking over time",
];

export function WholeBodyConnectedView() {
  return (
    <section className="overflow-hidden bg-[#f3eee5] px-4 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="editorial-kicker mb-5 text-deep-green">A whole-body, connected view</p>
            <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
              Your health is a system, not a collection of isolated numbers.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-warm-gray">
              MMS looks for relationships between the signals that matter. Sleep can affect metabolism.
              Metabolic health can influence cardiovascular risk. Hormonal change can affect muscle, energy
              and body composition. The value is in understanding the pattern, not chasing a single number.
            </p>
            <Link
              href="/whole-body-health"
              className="mt-8 inline-flex text-sm font-semibold text-deep-green underline decoration-gold/50 underline-offset-8"
            >
              Explore the whole-body health view
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {systems.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-gold/20 bg-white/70 p-5 shadow-[0_18px_60px_rgba(11,26,46,0.06)]"
              >
                <p className="font-serif text-2xl text-navy">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-warm-gray">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mms-cinematic-frame relative mt-12 aspect-[16/9] overflow-hidden rounded-[2rem] border border-gold/20 shadow-[0_34px_100px_rgba(11,26,46,0.12)]">
          <Image
            src="/mms-diagnostics-screening.png"
            alt="Preventive health screening and diagnostic review representing a connected whole-body view."
            fill
            className="mms-cinematic-image object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/16 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}

export function HealthierTomorrowStory() {
  return (
    <section className="overflow-hidden bg-[#07151d] px-4 py-20 text-ivory md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="mms-cinematic-frame relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_42px_120px_rgba(0,0,0,0.28)] md:min-h-[560px]">
          <Image
            src="/mms-doctor-couple-consult.png"
            alt="A couple discussing preventive health with a doctor as part of long-term health planning."
            fill
            className="mms-cinematic-image object-cover object-center"
            sizes="(min-width: 1024px) 54vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
          <p className="absolute bottom-6 left-6 right-6 max-w-xl font-serif text-3xl leading-tight md:text-4xl">
            More healthy moments for the people who matter most.
          </p>
        </div>

        <div>
          <p className="editorial-kicker mb-5 text-gold-light">A healthier tomorrow</p>
          <h2 className="text-balance font-serif text-5xl leading-[1.02] md:text-7xl">
            Longevity is not simply about adding years.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/66">
            It is about protecting health, independence and quality of life for as long as possible.
            Preventive care gives you a more structured way to understand risk, review meaningful change
            and make informed decisions with qualified medical professionals.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["More time", "Stay present for what matters."],
              ["Greater clarity", "Understand what deserves attention."],
              ["Better continuity", "Keep health decisions connected over time."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[1.25rem] border border-white/10 bg-white/[0.045] p-4">
                <p className="font-serif text-xl text-gold-light">{title}</p>
                <p className="mt-2 text-xs leading-5 text-ivory/55">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PreventionInvestmentStory() {
  return (
    <section className="bg-ivory px-4 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="editorial-kicker mb-5 text-deep-green">Prevention versus late treatment</p>
          <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
            Prevention is an investment in information, options and time.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-warm-gray">
            Preventive care cannot eliminate health risk. Appropriate screening and monitoring may,
            however, identify certain risk factors or conditions earlier, when there may be more time to
            review options and act proportionately.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-emerald-900/10 bg-[#e9f4ec] p-7 md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-deep-green">Earlier</p>
            <h3 className="mt-3 font-serif text-4xl text-navy">More opportunity to understand.</h3>
            <ul className="mt-6 grid gap-4 text-sm leading-6 text-warm-gray">
              <li>Build a baseline before symptoms dominate the conversation.</li>
              <li>Compare trends instead of relying on one isolated result.</li>
              <li>Discuss lifestyle, monitoring or clinical action when appropriate.</li>
              <li>Keep follow-up connected through one continuing health journey.</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-red-900/10 bg-[#f5ece8] p-7 md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9f4c42]">Later</p>
            <h3 className="mt-3 font-serif text-4xl text-navy">Care can become more urgent.</h3>
            <ul className="mt-6 grid gap-4 text-sm leading-6 text-warm-gray">
              <li>Symptoms may already be affecting daily life.</li>
              <li>Investigation may need to happen more quickly.</li>
              <li>Treatment can sometimes become more complex or disruptive.</li>
              <li>There may be less time to consider preventive options.</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center gap-5 text-center">
          <p className="text-xs leading-6 text-warm-gray/75">
            Screening and monitoring should be selected according to age, history, symptoms, risk profile
            and professional medical advice. They do not guarantee prevention or early detection of every condition.
          </p>
          <Link
            href="/preventive-health"
            className="inline-flex text-sm font-semibold text-deep-green underline decoration-gold/50 underline-offset-8"
          >
            Read the MMS preventive health approach
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ContinuityOfCareStory() {
  return (
    <section className="overflow-hidden bg-[#f3eee5] px-4 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="editorial-kicker mb-5 text-deep-green">Continuity of care</p>
          <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
            Your health programme should not end after one appointment.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-warm-gray">
            Health changes with age, lifestyle, medication, stress, weight, sleep and many other factors.
            MMS memberships are designed around continuity: regular monitoring, ongoing guidance,
            periodic reassessment and personalised recommendations as your needs evolve.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {continuity.map((item) => (
              <div key={item} className="rounded-[1.15rem] border border-gold/20 bg-white/70 px-4 py-4 text-sm font-medium text-deep-green">
                {item}
              </div>
            ))}
          </div>
          <Link
            href="/memberships"
            className="mt-8 inline-flex text-sm font-semibold text-deep-green underline decoration-gold/50 underline-offset-8"
          >
            Compare MMS memberships
          </Link>
        </div>

        <div className="mms-cinematic-frame relative min-h-[440px] overflow-hidden rounded-[2rem] border border-gold/20 shadow-[0_34px_100px_rgba(11,26,46,0.12)] md:min-h-[620px]">
          <Image
            src="/ling-continuity.png"
            alt="Ling supporting continuity of care across the MMS health journey."
            fill
            className="mms-cinematic-image object-cover object-center"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
