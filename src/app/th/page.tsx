import Link from "next/link";
import { LingPanel } from "@/components/LingPanel";

export default function ThaiHome() {
  return (
    <main className="min-h-screen bg-ivory px-4 pb-20 pt-36">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-gold">My Medical Sanctuary · ภาษาไทย</p>
        <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-tight text-navy md:text-7xl">การดูแลเชิงป้องกัน เพื่อสุขภาพและอายุยืนที่เหมาะกับคุณ</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-warm-gray">เส้นทางสุขภาพที่ประสานการดูแลระหว่างมาเลเซียและไทย โดยการตัดสินใจทางการแพทย์ทุกอย่างอยู่ภายใต้การดูแลของแพทย์ที่มีคุณสมบัติเหมาะสม</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/ling" className="rounded-full bg-deep-green px-6 py-3 font-semibold text-white">เริ่มต้นกับ Ling</Link>
          <Link href="/online-doctor" className="rounded-full border border-gold px-6 py-3 font-semibold text-navy">พบแพทย์ออนไลน์</Link>
        </div>
        <div className="mt-16"><LingPanel /></div>
      </div>
    </main>
  );
}
