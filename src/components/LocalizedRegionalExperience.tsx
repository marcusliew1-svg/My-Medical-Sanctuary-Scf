import type { Metadata } from "next";
import Link from "next/link";
import {
  alternatePaths,
  localizedPath,
  regionalSections,
  type RegionalLocale,
  type RegionalSection,
} from "@/lib/i18nRouting";
import { composeMetadataTitle, getCanonicalUrl, siteConfig } from "@/lib/siteConfig";

type SectionCopy = { title: string; intro: string; points: string[]; englishHref: string; englishLabel: string };
type LocaleCopy = {
  languageName: string; eyebrow: string; homeTitle: string; homeIntro: string; startLing: string; browseCare: string; coreTitle: string;
  safety: string; backHome: string; phaseNotice: string; nav: Record<RegionalSection, string>; sections: Record<RegionalSection, SectionCopy>;
};

const copy: Record<RegionalLocale, LocaleCopy> = {
  ms: {
    languageName: "Bahasa Malaysia",
    eyebrow: "My Medical Sanctuary · Bahasa Malaysia",
    homeTitle: "Penjagaan pencegahan. Perjalanan kesihatan yang lebih tersusun.",
    homeIntro: "MMS menghubungkan penemuan kesihatan, koordinasi penjagaan, doktor bertauliah dan akses Malaysia–Thailand dalam satu perjalanan yang lebih mudah difahami.",
    startLing: "Mulakan dengan Ling", browseCare: "Terokai perjalanan penjagaan", coreTitle: "Laluan utama MMS",
    safety: "Maklumat ini adalah untuk navigasi dan pendidikan. Diagnosis, preskripsi dan keputusan rawatan dibuat oleh doktor atau profesional kesihatan bertauliah yang sesuai.",
    backHome: "Kembali ke halaman Bahasa Malaysia",
    phaseNotice: "Versi Bahasa Malaysia bagi laluan utama ini kini tersedia. Kandungan klinikal terperinci dan pengalaman interaktif Ling masih melalui semakan bahasa perubatan; pautan penuh bahasa Inggeris disediakan buat sementara waktu.",
    nav: { ling: "Ling", memberships: "Keahlian", treatments: "Rawatan & kesejahteraan", "health-concerns": "Kebimbangan kesihatan", clinics: "Klinik", "medical-tourism": "Penjagaan rentas sempadan", "online-doctor": "Doktor dalam talian", contact: "Hubungi MMS" },
    sections: {
      ling: { title: "Mulakan dengan Ling", intro: "Ling membantu anda menyusun apa yang anda rasa, memahami perkara yang mungkin wajar diperiksa dan mengetahui bila doktor perlu mengambil alih.", points: ["Gunakan bahasa harian — anda tidak perlu tahu istilah perubatan.", "Corak kecemasan diberi keutamaan sebelum laluan kesejahteraan biasa.", "Ling membantu menyediakan konteks; doktor bertauliah membuat keputusan perubatan."], englishHref: "/ling", englishLabel: "Buka Ling versi semasa" },
      memberships: { title: "Keahlian MMS", intro: "Ascend, Evolve, Eterna dan Pinnacle direka untuk tahap akses, kesinambungan dan koordinasi yang berbeza — bukan sebagai pakej rawatan automatik.", points: ["Fokus pada hubungan penjagaan jangka panjang.", "Tahap akses dan koordinasi berbeza mengikut keahlian.", "Semua rawatan tertakluk kepada kesesuaian profesional, ketersediaan dan undang-undang."], englishHref: "/memberships", englishLabel: "Lihat butiran penuh keahlian" },
      treatments: { title: "Panduan rawatan & kesejahteraan", intro: "MMS menerangkan rawatan dalam bahasa yang mudah, bersama konteks bukti, batasan dan perkara yang perlu dibincangkan dengan profesional bertauliah.", points: ["Penerangan dahulu — bukan pemilihan rawatan automatik.", "Bukti dan status penggunaan boleh berbeza mengikut terapi.", "Rawatan lanjutan memerlukan penilaian kesesuaian dan semakan profesional."], englishHref: "/treatments", englishLabel: "Buka panduan rawatan penuh" },
      "health-concerns": { title: "Kebimbangan kesihatan & penyelidikan", intro: "Mulakan dengan masalah yang anda alami — contohnya keletihan, berat badan, tidur, hormon atau risiko kardiovaskular — kemudian susun soalan yang sesuai untuk penilaian.", points: ["Bermula daripada simptom atau kebimbangan, bukan terapi.", "Kandungan bertujuan membantu perbincangan, bukan membuat diagnosis.", "Tanda amaran kecemasan perlu dinilai segera melalui perkhidmatan perubatan tempatan."], englishHref: "/health-concerns", englishLabel: "Lihat perpustakaan kebimbangan kesihatan" },
      clinics: { title: "Klinik & akses MMS", intro: "MMS sedang membina perjalanan penjagaan yang diselaraskan merentasi Malaysia dan Thailand dengan titik masuk klinik, dalam talian dan rentas sempadan.", points: ["Semak lokasi dan status operasi sebelum membuat perjalanan.", "Perkhidmatan berbeza mengikut lokasi dan ketersediaan.", "Koordinasi tidak menggantikan keputusan klinikal oleh profesional bertauliah."], englishHref: "/clinics", englishLabel: "Lihat klinik MMS" },
      "medical-tourism": { title: "Penjagaan Malaysia–Thailand", intro: "Untuk perjalanan perubatan atau kesejahteraan, MMS membantu menyusun keperluan, semakan manusia, padanan lokasi dan perancangan perjalanan sebelum rawatan diputuskan.", points: ["Mulakan dengan keperluan kesihatan, bukan destinasi semata-mata.", "Semakan manusia dilakukan sebelum padanan penjagaan.", "Kesesuaian rawatan dan keperluan perjalanan perlu disahkan secara berasingan."], englishHref: "/medical-tourism", englishLabel: "Lihat perjalanan penjagaan rentas sempadan" },
      "online-doctor": { title: "Doktor dalam talian", intro: "Perundingan dalam talian memberi satu lagi pintu masuk kepada MMS. Ling boleh membantu menyusun konteks, manakala doktor bertauliah memimpin perbincangan perubatan.", points: ["Sesuai untuk perbincangan dan susulan yang boleh dilakukan secara maya.", "Sesetengah keadaan masih memerlukan pemeriksaan fizikal atau ujian.", "Keperluan kecemasan tidak sesuai untuk laluan konsultasi rutin."], englishHref: "/online-doctor", englishLabel: "Buka doktor dalam talian" },
      contact: { title: "Hubungi My Medical Sanctuary", intro: "Gunakan saluran MMS untuk pertanyaan mengenai klinik, keahlian, perjalanan penjagaan atau langkah seterusnya selepas berbincang dengan Ling.", points: ["Nyatakan negara dan jenis bantuan yang diperlukan.", "Jangan hantar maklumat kesihatan sensitif melalui saluran umum jika tidak diperlukan.", "Untuk kecemasan, hubungi perkhidmatan kecemasan tempatan dan jangan tunggu balasan MMS."], englishHref: "/contact", englishLabel: "Buka halaman hubungan" }
    }
  },
  zh: {
    languageName: "简体中文", eyebrow: "My Medical Sanctuary · 简体中文", homeTitle: "预防保健，更有条理的健康旅程。", homeIntro: "MMS 将健康探索、照护协调、合格医生以及马来西亚–泰国的区域医疗服务连接在同一条更清晰的患者旅程中。", startLing: "从 Ling 开始", browseCare: "探索主要照护路径", coreTitle: "MMS 主要路径",
    safety: "本页面用于导航与健康教育，不构成诊断、处方或个体化治疗决定。医疗决定应由适当的合格医生或医疗专业人员作出。", backHome: "返回简体中文首页",
    phaseNotice: "主要患者路径的中文版本现已建立。更深入的临床内容以及 Ling 的完整互动语言仍需医学语言审核，因此目前保留英文完整版入口。",
    nav: { ling: "Ling 健康向导", memberships: "会员计划", treatments: "治疗与健康指南", "health-concerns": "健康问题", clinics: "诊所", "medical-tourism": "跨境医疗", "online-doctor": "线上医生", contact: "联系 MMS" },
    sections: {
      ling: { title: "从 Ling 开始", intro: "Ling 帮助你整理症状与健康目标，解释哪些方向可能值得进一步检查，并明确什么时候应由医生接手。", points: ["可以直接用日常语言描述，不需要先懂医学术语。", "若出现潜在紧急信号，系统会优先提示紧急就医，而不是继续一般健康路径。", "Ling 负责整理信息与引导；医疗决定由合格医生作出。"], englishHref: "/ling", englishLabel: "打开当前 Ling 版本" },
      memberships: { title: "MMS 会员计划", intro: "Ascend、Evolve、Eterna 与 Pinnacle 对应不同程度的持续照护、服务深度与协调支持，并不等同于自动包含某项治疗。", points: ["重点是长期健康关系与连续性。", "不同等级提供不同程度的接触与协调。", "任何治疗均取决于专业适合性、实际可用性及相关法规。"], englishHref: "/memberships", englishLabel: "查看完整会员说明" },
      treatments: { title: "治疗与健康指南", intro: "MMS 用较易理解的方式介绍治疗，同时说明证据背景、限制、风险以及应与合格专业人员讨论的问题。", points: ["先理解，再讨论；不会自动替你选择治疗。", "不同治疗的证据强度与监管状态可能不同。", "先进或专科治疗需要适合性评估和专业审核。"], englishHref: "/treatments", englishLabel: "打开完整治疗指南" },
      "health-concerns": { title: "健康问题与研究", intro: "可以从你真正困扰的问题开始，例如长期疲劳、体重、睡眠、激素、肠胃或心血管风险，再整理成适合评估的问题。", points: ["从症状或健康顾虑出发，而不是从治疗产品出发。", "内容用于帮助理解和就医讨论，不用于自行诊断。", "出现紧急警示症状时，应优先联系当地急救医疗服务。"], englishHref: "/health-concerns", englishLabel: "查看健康问题资料库" },
      clinics: { title: "MMS 诊所与服务入口", intro: "MMS 正在建立连接马来西亚和泰国的协调式照护路径，包括诊所、线上咨询以及跨境医疗入口。", points: ["出发前请确认地点和当前运营状态。", "不同地点的服务项目与可用情况可能不同。", "协调服务不会取代合格专业人员的临床判断。"], englishHref: "/clinics", englishLabel: "查看 MMS 诊所" },
      "medical-tourism": { title: "马来西亚–泰国跨境照护", intro: "针对医疗或健康旅行，MMS 先帮助整理需求，再进行人工审核、服务地点匹配和旅行规划，之后才进入具体医疗决定。", points: ["先明确健康需要，而不是先选择目的地。", "照护匹配前应有人工作进一步审核。", "治疗适合性与旅行安排需要分别确认。"], englishHref: "/medical-tourism", englishLabel: "查看跨境照护流程" },
      "online-doctor": { title: "线上医生", intro: "线上咨询是进入 MMS 的另一种方式。Ling 可先整理背景信息，再由合格医生主导医学讨论。", points: ["适合可以远程完成的初步讨论与部分随访。", "某些情况仍需要面诊、体检或检测。", "紧急症状不应等待常规线上咨询。"], englishHref: "/online-doctor", englishLabel: "打开线上医生页面" },
      contact: { title: "联系 My Medical Sanctuary", intro: "如需了解诊所、会员、跨境照护或与 Ling 沟通后的下一步，可通过 MMS 的正式联系渠道咨询。", points: ["说明所在国家以及需要协助的事项。", "非必要时不要通过一般联系渠道发送敏感健康资料。", "如属紧急情况，请立即联系当地急救服务，不要等待 MMS 回复。"], englishHref: "/contact", englishLabel: "打开联系页面" }
    }
  },
  th: {
    languageName: "ภาษาไทย", eyebrow: "My Medical Sanctuary · ภาษาไทย", homeTitle: "การดูแลเชิงป้องกัน กับเส้นทางสุขภาพที่เป็นระบบมากขึ้น", homeIntro: "MMS เชื่อมการสำรวจสุขภาพ การประสานการดูแล แพทย์ที่มีคุณสมบัติเหมาะสม และการเข้าถึงบริการระหว่างมาเลเซีย–ไทยไว้ในเส้นทางเดียวที่เข้าใจง่ายขึ้น", startLing: "เริ่มต้นกับ Ling", browseCare: "สำรวจเส้นทางการดูแล", coreTitle: "เส้นทางหลักของ MMS",
    safety: "ข้อมูลนี้มีไว้เพื่อการนำทางและให้ความรู้ ไม่ใช่การวินิจฉัย การสั่งยา หรือการตัดสินใจรักษาเฉพาะบุคคล การตัดสินใจทางการแพทย์ควรทำโดยแพทย์หรือผู้ประกอบวิชาชีพสุขภาพที่มีคุณสมบัติเหมาะสม", backHome: "กลับหน้าหลักภาษาไทย",
    phaseNotice: "ขณะนี้มีฉบับภาษาไทยสำหรับเส้นทางผู้ป่วยหลักแล้ว ส่วนเนื้อหาคลินิกเชิงลึกและประสบการณ์โต้ตอบเต็มรูปแบบของ Ling ยังอยู่ระหว่างการตรวจทานภาษาทางการแพทย์ จึงยังมีลิงก์ไปยังฉบับภาษาอังกฤษแบบเต็มในช่วงนี้",
    nav: { ling: "Ling", memberships: "สมาชิก MMS", treatments: "การรักษาและสุขภาพ", "health-concerns": "ข้อกังวลด้านสุขภาพ", clinics: "คลินิก", "medical-tourism": "การดูแลข้ามประเทศ", "online-doctor": "แพทย์ออนไลน์", contact: "ติดต่อ MMS" },
    sections: {
      ling: { title: "เริ่มต้นกับ Ling", intro: "Ling ช่วยจัดระเบียบสิ่งที่คุณกำลังกังวล อธิบายสิ่งที่อาจควรตรวจเพิ่มเติม และช่วยให้เห็นชัดว่าเมื่อใดควรให้แพทย์เป็นผู้ดูแลต่อ", points: ["อธิบายด้วยภาษาทั่วไปได้ ไม่จำเป็นต้องรู้ศัพท์แพทย์", "สัญญาณที่อาจเป็นภาวะฉุกเฉินจะได้รับความสำคัญก่อนเส้นทางสุขภาพทั่วไป", "Ling ช่วยจัดข้อมูลและนำทาง ส่วนการตัดสินใจทางการแพทย์เป็นหน้าที่ของแพทย์ที่มีคุณสมบัติเหมาะสม"], englishHref: "/ling", englishLabel: "เปิด Ling เวอร์ชันปัจจุบัน" },
      memberships: { title: "สมาชิก MMS", intro: "Ascend, Evolve, Eterna และ Pinnacle ออกแบบมาสำหรับระดับการเข้าถึง ความต่อเนื่อง และการประสานการดูแลที่แตกต่างกัน ไม่ใช่แพ็กเกจที่รับประกันการรักษาใดโดยอัตโนมัติ", points: ["เน้นความสัมพันธ์ด้านสุขภาพในระยะยาว", "แต่ละระดับมีความลึกของการเข้าถึงและการประสานงานแตกต่างกัน", "การรักษาทุกอย่างขึ้นอยู่กับความเหมาะสมทางวิชาชีพ ความพร้อมให้บริการ และข้อกำหนดทางกฎหมาย"], englishHref: "/memberships", englishLabel: "ดูรายละเอียดสมาชิกฉบับเต็ม" },
      treatments: { title: "คู่มือการรักษาและสุขภาพ", intro: "MMS อธิบายการรักษาด้วยภาษาที่เข้าใจง่าย พร้อมบริบทด้านหลักฐาน ข้อจำกัด ความเสี่ยง และประเด็นที่ควรหารือกับผู้เชี่ยวชาญที่เหมาะสม", points: ["เริ่มจากความเข้าใจ ไม่ใช่การเลือกการรักษาให้อัตโนมัติ", "ระดับหลักฐานและสถานะการใช้งานอาจแตกต่างกันในแต่ละวิธี", "การรักษาขั้นสูงหรือเฉพาะทางต้องมีการประเมินความเหมาะสมและการทบทวนโดยผู้เชี่ยวชาญ"], englishHref: "/treatments", englishLabel: "เปิดคู่มือการรักษาฉบับเต็ม" },
      "health-concerns": { title: "ข้อกังวลด้านสุขภาพและการค้นคว้า", intro: "เริ่มจากสิ่งที่รบกวนคุณจริง ๆ เช่น อ่อนเพลีย น้ำหนัก การนอน ฮอร์โมน ระบบทางเดินอาหาร หรือความเสี่ยงหัวใจ แล้วค่อยจัดเป็นคำถามที่เหมาะสำหรับการประเมิน", points: ["เริ่มจากอาการหรือข้อกังวล ไม่ใช่เริ่มจากผลิตภัณฑ์หรือการรักษา", "เนื้อหาใช้เพื่อช่วยทำความเข้าใจและเตรียมการสนทนากับแพทย์ ไม่ใช่เพื่อวินิจฉัยตนเอง", "หากมีสัญญาณฉุกเฉินควรติดต่อบริการฉุกเฉินในพื้นที่ก่อน"], englishHref: "/health-concerns", englishLabel: "ดูคลังข้อกังวลด้านสุขภาพ" },
      clinics: { title: "คลินิกและการเข้าถึง MMS", intro: "MMS กำลังสร้างเส้นทางการดูแลที่เชื่อมมาเลเซียและไทย ผ่านคลินิก การปรึกษาออนไลน์ และการดูแลข้ามประเทศ", points: ["ตรวจสอบสถานที่และสถานะการให้บริการก่อนเดินทาง", "บริการและความพร้อมอาจแตกต่างกันในแต่ละสถานที่", "การประสานงานไม่ทดแทนการตัดสินใจทางคลินิกของผู้เชี่ยวชาญที่มีคุณสมบัติเหมาะสม"], englishHref: "/clinics", englishLabel: "ดูคลินิก MMS" },
      "medical-tourism": { title: "การดูแลระหว่างมาเลเซีย–ไทย", intro: "สำหรับการเดินทางด้านการแพทย์หรือสุขภาพ MMS ช่วยจัดความต้องการ ทบทวนโดยมนุษย์ จับคู่สถานที่ดูแล และวางแผนการเดินทาง ก่อนเข้าสู่การตัดสินใจรักษา", points: ["เริ่มจากความต้องการด้านสุขภาพ ไม่ใช่เริ่มจากปลายทาง", "ควรมีการทบทวนโดยมนุษย์ก่อนจับคู่บริการ", "ความเหมาะสมของการรักษาและข้อกำหนดการเดินทางต้องยืนยันแยกกัน"], englishHref: "/medical-tourism", englishLabel: "ดูเส้นทางการดูแลข้ามประเทศ" },
      "online-doctor": { title: "แพทย์ออนไลน์", intro: "การปรึกษาออนไลน์เป็นอีกช่องทางเข้าสู่ MMS โดย Ling ช่วยจัดข้อมูลเบื้องต้น และแพทย์ที่มีคุณสมบัติเหมาะสมเป็นผู้นำการสนทนาทางการแพทย์", points: ["เหมาะกับการพูดคุยเบื้องต้นและการติดตามบางประเภทที่ทำจากระยะไกลได้", "บางกรณียังคงต้องตรวจร่างกายหรือทำการตรวจเพิ่มเติม", "ภาวะฉุกเฉินไม่ควรรอการนัดหมายออนไลน์ตามปกติ"], englishHref: "/online-doctor", englishLabel: "เปิดหน้าแพทย์ออนไลน์" },
      contact: { title: "ติดต่อ My Medical Sanctuary", intro: "ใช้ช่องทางของ MMS สำหรับคำถามเกี่ยวกับคลินิก สมาชิก การดูแลข้ามประเทศ หรือขั้นตอนถัดไปหลังจากเริ่มต้นกับ Ling", points: ["แจ้งประเทศที่คุณอยู่และประเภทความช่วยเหลือที่ต้องการ", "หลีกเลี่ยงการส่งข้อมูลสุขภาพที่ละเอียดอ่อนผ่านช่องทางทั่วไปหากไม่จำเป็น", "หากเป็นเหตุฉุกเฉิน ให้ติดต่อบริการฉุกเฉินในพื้นที่ทันทีและอย่ารอการตอบกลับจาก MMS"], englishHref: "/contact", englishLabel: "เปิดหน้าติดต่อ" }
    }
  }
};

const htmlLang: Record<RegionalLocale, string> = { ms: "ms", zh: "zh-CN", th: "th" };
const openGraphLocale: Record<RegionalLocale, string> = { ms: "ms_MY", zh: "zh_CN", th: "th_TH" };

export function regionalMetadata(locale: RegionalLocale, section?: RegionalSection): Metadata {
  const content = copy[locale];
  const page = section ? content.sections[section] : null;
  const pathname = localizedPath(locale, section);
  const languages = Object.fromEntries(
    Object.entries(alternatePaths(section)).map(([language, path]) => [language, getCanonicalUrl(path)]),
  );
  const title = page?.title || content.homeTitle;
  const description = page?.intro || content.homeIntro;

  return {
    title: composeMetadataTitle(title),
    description,
    alternates: { canonical: getCanonicalUrl(pathname), languages },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(pathname),
      type: "website",
      locale: openGraphLocale[locale],
      siteName: siteConfig.name,
    },
  };
}

function LocaleNav({ locale }: { locale: RegionalLocale }) {
  const content = copy[locale];
  return <div className="mt-10 flex flex-wrap gap-2">{regionalSections.map((section) => <Link key={section} href={`/${locale}/${section}`} hrefLang={htmlLang[locale]} className="rounded-full border border-deep-green/15 bg-white px-4 py-2 text-xs font-semibold text-deep-green shadow-sm transition hover:border-deep-green/35">{content.nav[section]}</Link>)}</div>;
}

export function LocalizedRegionalHome({ locale }: { locale: RegionalLocale }) {
  const content = copy[locale];
  return <main lang={htmlLang[locale]} data-locale-status="partial" className="min-h-screen bg-ivory px-4 pb-24 pt-36"><div className="mx-auto max-w-6xl">
    <p className="text-xs font-bold uppercase tracking-[.18em] text-gold">{content.eyebrow}</p>
    <h1 className="mt-5 max-w-5xl font-serif text-5xl leading-tight text-navy md:text-7xl">{content.homeTitle}</h1>
    <p className="mt-6 max-w-3xl text-lg leading-8 text-warm-gray">{content.homeIntro}</p>
    <div className="mt-8 flex flex-wrap gap-3"><Link href={`/${locale}/ling`} className="rounded-full bg-deep-green px-6 py-3 font-semibold text-white">{content.startLing}</Link><Link href={`/${locale}/health-concerns`} className="rounded-full border border-gold px-6 py-3 font-semibold text-navy">{content.browseCare}</Link></div>
    <section className="mt-16 rounded-[2rem] bg-white p-6 shadow-soft md:p-9"><p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">{content.coreTitle}</p><LocaleNav locale={locale} /><p className="mt-8 rounded-2xl bg-[#f4f6f4] p-4 text-sm leading-6 text-warm-gray">{content.phaseNotice}</p></section>
    <p className="mt-8 max-w-4xl text-xs leading-6 text-warm-gray">{content.safety}</p>
  </div></main>;
}

export function LocalizedRegionalPage({ locale, section }: { locale: RegionalLocale; section: RegionalSection }) {
  const content = copy[locale]; const page = content.sections[section];
  return <main lang={htmlLang[locale]} data-locale-status="partial" className="min-h-screen bg-ivory px-4 pb-24 pt-36"><div className="mx-auto max-w-6xl">
    <p className="text-xs font-bold uppercase tracking-[.18em] text-gold">My Medical Sanctuary · {content.languageName}</p>
    <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-tight text-navy md:text-7xl">{page.title}</h1>
    <p className="mt-6 max-w-3xl text-lg leading-8 text-warm-gray">{page.intro}</p>
    <div className="mt-10 grid gap-4 md:grid-cols-3">{page.points.map((point, index) => <div key={point} className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-soft"><span className="grid size-8 place-items-center rounded-full bg-[#e7efea] text-xs font-bold text-deep-green">{index + 1}</span><p className="mt-4 text-sm leading-7 text-navy">{point}</p></div>)}</div>
    <div className="mt-8 rounded-2xl border border-gold/20 bg-[#fbf7ef] p-5 text-sm leading-7 text-warm-gray">{content.phaseNotice}</div>
    <div className="mt-8 flex flex-wrap gap-3"><Link href={page.englishHref} className="rounded-full bg-deep-green px-6 py-3 font-semibold text-white">{page.englishLabel}</Link><Link href={`/${locale}`} className="rounded-full border border-gold px-6 py-3 font-semibold text-navy">{content.backHome}</Link></div>
    <LocaleNav locale={locale} /><p className="mt-8 max-w-4xl text-xs leading-6 text-warm-gray">{content.safety}</p>
  </div></main>;
}
