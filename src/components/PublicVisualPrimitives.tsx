import Image from "next/image";
import type { ReactNode } from "react";

type SectionTone = "ivory" | "stone" | "midnight" | "green";

const sectionTones: Record<SectionTone, string> = {
  ivory: "bg-ivory text-charcoal",
  stone: "bg-warm-white text-charcoal",
  midnight: "bg-[#06171d] text-ivory",
  green: "bg-deep-green text-ivory",
};

export function PublicContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function PublicSectionShell({
  children,
  tone = "ivory",
  className = "",
}: {
  children: ReactNode;
  tone?: SectionTone;
  className?: string;
}) {
  return (
    <section data-public-section className={`py-16 md:py-24 lg:py-28 ${sectionTones[tone]} ${className}`}>
      <PublicContainer>{children}</PublicContainer>
    </section>
  );
}

export function ResponsiveEditorialImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  objectPosition = "center",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  objectPosition?: string;
  sizes?: string;
  priority?: boolean;
  children?: ReactNode;
}) {
  return (
    <figure className={`public-media relative overflow-hidden rounded-md bg-[#e8e3da] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={`object-cover ${imageClassName}`}
        style={{ objectPosition }}
        sizes={sizes}
      />
      {children}
    </figure>
  );
}
