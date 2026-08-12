import type { EducationPost } from "@/data/educationPosts";

type EducationCardProps = {
  post: EducationPost;
};

export function EducationCard({ post }: EducationCardProps) {
  return (
    <article className="rounded-lg border border-gold-light/40 bg-white/[0.92] p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-premium">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="rounded-full border border-gold-light bg-ivory px-3 py-1 text-xs font-semibold text-navy">
          {post.format}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-warm-gray">
          {post.category}
        </span>
      </div>
      <h3 className="font-serif text-2xl text-navy">{post.title}</h3>
      <p className="mt-4 leading-7 text-warm-gray">{post.summary}</p>
    </article>
  );
}
