import Image from "next/image";

export function BrandMark() {
  return (
    <span className="grid h-11 w-14 place-items-center rounded-md border border-white/35 bg-white/95 p-1 shadow-[0_10px_28px_rgba(0,0,0,0.12)]">
      <Image
        src="/mms-logo-mark.png"
        alt=""
        width={430}
        height={310}
        className="h-full w-full object-contain"
        priority
      />
    </span>
  );
}
