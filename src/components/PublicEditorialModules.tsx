import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type EditorialItem = { title: string; text: string; eyebrow?: string; href?: string };

export function EditorialIndex({ items, dark = false }: { items: EditorialItem[]; dark?: boolean }) {
  return (
    <div className={`border-t ${dark ? "border-champagne/30" : "border-bronze/30"}`}>
      {items.map((item, index) => {
        const content = (
          <div className={`group grid gap-3 border-b py-6 sm:grid-cols-[3.25rem_0.8fr_1.2fr] sm:items-start ${dark ? "border-champagne/18" : "border-bronze/20"}`}>
            <span className={`text-xs font-semibold tracking-[0.16em] ${dark ? "text-champagne" : "text-bronze"}`}>{String(index + 1).padStart(2, "0")}</span>
            <div>
              {item.eyebrow ? <p className={`mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${dark ? "text-ivory/48" : "text-deep-green"}`}>{item.eyebrow}</p> : null}
              <h3 className={`font-serif text-2xl leading-tight md:text-3xl ${dark ? "text-ivory" : "text-navy"}`}>{item.title}</h3>
            </div>
            <p className={`max-w-xl text-sm leading-7 ${dark ? "text-ivory/66" : "text-warm-gray"}`}>{item.text}</p>
          </div>
        );
        return item.href ? <Link key={item.title} href={item.href} className="block focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-gold">{content}</Link> : <div key={item.title}>{content}</div>;
      })}
    </div>
  );
}

export function ImagePair({ primary, secondary, primaryAlt, secondaryAlt }: { primary: string; secondary: string; primaryAlt: string; secondaryAlt: string }) {
  return (
    <div className="grid min-h-[460px] grid-cols-[1.2fr_0.8fr] gap-3 md:min-h-[620px]">
      <figure className="public-media relative overflow-hidden rounded-md"><Image src={primary} alt={primaryAlt} fill className="object-cover" sizes="(min-width: 1024px) 36vw, 65vw" /></figure>
      <figure className="public-media relative mb-12 mt-16 overflow-hidden rounded-md"><Image src={secondary} alt={secondaryAlt} fill className="object-cover" sizes="(min-width: 1024px) 22vw, 35vw" /></figure>
    </div>
  );
}

export function PrincipleRow({ items, dark = false }: { items: EditorialItem[]; dark?: boolean }) {
  return (
    <div className={`grid border-y md:grid-cols-3 ${dark ? "border-champagne/25" : "border-bronze/25"}`}>
      {items.map((item, index) => (
        <article key={item.title} className={`py-7 md:px-7 ${index ? dark ? "border-t border-champagne/20 md:border-l md:border-t-0" : "border-t border-bronze/20 md:border-l md:border-t-0" : ""}`}>
          <p className={`text-xs font-semibold tracking-[0.16em] ${dark ? "text-champagne" : "text-bronze"}`}>{String(index + 1).padStart(2, "0")}</p>
          <h3 className={`mt-4 font-serif text-3xl ${dark ? "text-ivory" : "text-navy"}`}>{item.title}</h3>
          <p className={`mt-3 text-sm leading-7 ${dark ? "text-ivory/66" : "text-warm-gray"}`}>{item.text}</p>
        </article>
      ))}
    </div>
  );
}

export function ClinicalBoundary({ children }: { children: ReactNode }) {
  return <aside className="border-l-2 border-bronze bg-warm-white px-6 py-5 text-sm leading-7 text-charcoal md:px-8">{children}</aside>;
}
