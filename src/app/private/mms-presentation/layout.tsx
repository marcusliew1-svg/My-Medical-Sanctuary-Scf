import Script from "next/script";
import "./presentation.css";
import "./autoplay.css";

export default function MMSPresentationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<Script src="/mms-story-autoplay.js" strategy="afterInteractive" /></>;
}