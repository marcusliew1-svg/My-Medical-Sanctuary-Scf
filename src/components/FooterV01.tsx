import Image from "next/image";
import Link from "next/link";
import { footerNavigation, legalNavigation, platformNavigation } from "@/lib/siteRoutes";

export function FooterV01() {
  return (
    <footer className="relative overflow-hidden bg-[#081f26] px-4 py-16 text-ivory md:py-20">
      <div className="absolute -right-24 -top-24 size-72 rounded-full border border-[#dfb78f]/10" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="max-w-64 rounded-xl bg-ivory p-4"><Image src="/mms-logo-lockup.png" alt="My Medical Sanctuary" width={1180} height={575} className="h-auto w-full" /></div>
            <p className="mt-6 max-w-xl font-serif text-3xl leading-tight text-ivory">Preventive Care.<br/><span className="text-[#e1bd99]">Personalised Longevity.</span></p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:justify-self-end">
            <div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#dfb78f]">Patient journey</p><div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-ivory/62">{footerNavigation.slice(0,8).map((item)=><Link key={item.href} href={item.href} className="transition hover:text-white">{item.label}</Link>)}</div></div>
            <div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#dfb78f]">More</p><div className="mt-4 grid gap-2 text-sm text-ivory/62">{platformNavigation.map((item)=><Link key={item.href} href={item.href} className="transition hover:text-white">{item.label}</Link>)}</div></div>
          </div>
        </div>
        <div className="flex flex-col gap-5 pt-7 text-xs text-ivory/42 md:flex-row md:items-center md:justify-between"><p className="max-w-2xl leading-6">General information only. Professional review is required before personalised medical recommendations. Individual outcomes vary.</p><div className="flex gap-5">{legalNavigation.map((item)=><Link key={item.href} href={item.href} className="transition hover:text-white">{item.label}</Link>)}</div></div>
      </div>
    </footer>
  );
}
