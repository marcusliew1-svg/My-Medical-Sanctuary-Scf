import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { EducationCard } from "@/components/EducationCard";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { educationPosts } from "@/data/educationPosts";

export const metadata: Metadata = {
  title: "Education | Dr Ling",
  description: "Educational articles and videos from Dr Ling for preventive care and personalised longevity learning.",
};

export default function EducationPage() {
  return (
    <main>
      <Hero
        eyebrow="Education"
        title="Dr Ling helps members learn before they decide."
        subtitle="Education supports better discovery discussions and more informed professional review."
        image="/mms-about-hero.png"
      />
      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Education Library"
            title="Articles, videos and guides."
            description="Placeholder content for the first MMS education hub."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {educationPosts.map((post) => (
              <EducationCard key={post.title} post={post} />
            ))}
          </div>
          <div className="mt-8">
            <DisclaimerBox title="Dr Ling disclaimer">
              <p>
                Dr Ling provides educational information only. She does not diagnose, prescribe or replace professional review.
              </p>
            </DisclaimerBox>
          </div>
        </div>
      </section>
    </main>
  );
}
