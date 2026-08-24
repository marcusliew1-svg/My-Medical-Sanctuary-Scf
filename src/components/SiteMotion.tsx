"use client";

import { useEffect } from "react";

export function SiteMotion() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section"));
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main article, main [class*='rounded-[2rem]'], main [class*='rounded-[2.5rem]']",
      ),
    );

    sections.forEach((section, index) => {
      section.dataset.mmsSection = String(index + 1);
      section.classList.add("mms-reveal-section");
    });

    cards.forEach((card, index) => {
      card.classList.add("mms-reveal-card");
      card.style.setProperty("--mms-delay", `${Math.min(index % 6, 5) * 70}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("mms-in-view");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    sections.forEach((section) => observer.observe(section));
    cards.forEach((card) => observer.observe(card));

    let frame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        document.documentElement.style.setProperty("--mms-scroll", String(window.scrollY / max));
      });
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      <div className="mms-ambient-orb mms-ambient-orb-a" />
      <div className="mms-ambient-orb mms-ambient-orb-b" />
      <div className="mms-scroll-line" />
    </div>
  );
}
