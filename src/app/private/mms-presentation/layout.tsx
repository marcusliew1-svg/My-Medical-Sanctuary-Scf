import Script from "next/script";
import "./presentation.css";
import "./autoplay.css";
import "./substance.css";
import "./cinematics.css";
import "./deepdive.css";
import "./multishot.css";
import "./film-polish.css";
import "./focus.css";
import "./caption-sync.css";

export default function MMSPresentationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<Script src="/mms-story-substance.js" strategy="afterInteractive" /><Script src="/mms-story-deepdive.js" strategy="afterInteractive" /><Script src="/mms-story-multishot.js" strategy="afterInteractive" /><Script src="/mms-story-cinematics.js" strategy="afterInteractive" /><Script src="/mms-story-film-polish.js" strategy="afterInteractive" /><Script src="/mms-story-focus.js" strategy="afterInteractive" /><Script src="/mms-story-narration.js" strategy="afterInteractive" /><Script src="/mms-story-autoplay.js" strategy="afterInteractive" /><Script src="/mms-story-caption-sync.js" strategy="afterInteractive" /></>;
}