export function PatientFirstFilm() {
  return (
    <section className="overflow-hidden bg-[#f3eee5] px-4 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <div>
          <p className="editorial-kicker mb-5 text-deep-green">Patient first</p>
          <h2 className="text-balance font-serif text-5xl leading-[1.02] text-navy md:text-7xl">
            Your health should not need a crisis before it gets your attention.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-warm-gray">
            A short MMS story about checking, understanding and monitoring your health before urgent care becomes the first conversation.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {["Understand earlier", "Monitor over time", "Doctor-led decisions"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-gold/30 bg-white/65 px-3 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-deep-green"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[470px]">
          <div className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_50%_45%,rgba(199,167,106,0.18),transparent_58%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-gold/25 bg-[#07151d] p-2 shadow-[0_40px_120px_rgba(11,26,46,0.2)]">
            <video
              className="aspect-[9/16] w-full rounded-[1.55rem] bg-black object-cover"
              controls
              playsInline
              preload="metadata"
              aria-label="MMS Patient First film"
            >
              <source
                src="https://d2ol7oe51mr4n9.cloudfront.net/user_3JZZ2nSpicPcV1mivU13KD6LxdM/522125e2-d6fd-4c91-80b0-2b6613a5394d.mp4"
                type="video/mp4"
              />
              Your browser does not support HTML video.
            </video>
          </div>
          <p className="mt-4 text-center text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-deep-green/55">
            1 minute • Sound on
          </p>
        </div>
      </div>
    </section>
  );
}
