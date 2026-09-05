import Script from "next/script";
import "./presentation.css";
import "./autoplay.css";
import "./substance.css";
import "./cinematics.css";
import "./deepdive.css";

export default function MMSPresentationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<Script src="/mms-story-substance.js" strategy="afterInteractive" /><Script src="/mms-story-deepdive.js" strategy="afterInteractive" /><Script src="/mms-story-cinematics.js" strategy="afterInteractive" /><Script src="/mms-story-autoplay.js" strategy="afterInteractive" /></>;
}