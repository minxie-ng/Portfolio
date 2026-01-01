// /site/app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Project = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  tags: string[];
  icon: string;
  cta: string;
};

const projects: Project[] = [
  {
    title: "CDC Vouchers — Exact Amount Payment UX",
    subtitle: "Product / UX Case Study",
    description:
      "An opt-in exact-amount mode for digitally confident users who want to fully utilise CDC vouchers — while preserving default flows for elderly users and merchants.",
    href: "/projects/cdc",
    tags: ["Product Thinking", "UX Flow", "Edge Cases", "Constraints"],
    icon: "🧾",
    cta: "View case study",
  },
  {
    title: "CMB Dating App Concept",
    subtitle: "Product Concept / UX",
    description:
      "A concept exploration around matching, messaging, and trust signals — focused on improving clarity and reducing friction in key steps.",
    href: "/projects/cmb",
    tags: ["Product Spec", "UX", "Experiment Ideas"],
    icon: "💬",
    cta: "View project",
  },
  {
    title: "SMU App Project",
    subtitle: "Campus Product / Systems",
    description:
      "A campus-focused product build where I worked through scope, user flow, and prioritisation — translating messy constraints into a shippable plan.",
    href: "/projects/smu",
    tags: ["Scope", "User Flow", "Prioritisation"],
    icon: "🏫",
    cta: "View project",
  },
];

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

export default function Home() {
  const photoSectionRef = useRef<HTMLElement | null>(null);
  const [photoProgress, setPhotoProgress] = useState(0);

  // Scroll-driven photo reveal
  useEffect(() => {
    let raf = 0;

    const update = () => {
      const el = photoSectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // ✅ Progress based on how far we've scrolled THROUGH this section.
      // rect.top = 0  -> section top at viewport top  -> progress 0
      // rect.top = -totalScroll -> section fully passed -> progress 1
      const totalScroll = Math.max(el.offsetHeight - vh, 1);
      const scrolled = clamp((-rect.top) / totalScroll);
      setPhotoProgress(scrolled);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /**
   * ✅ Make it linger MUCH longer + fade much later
   *
   * If you want even longer linger:
   * - Increase section height (h-[600vh] -> h-[700vh] etc.)
   * If you want fade to start even later:
   * - Increase fadeOutStart (0.86 -> 0.90)
   * If you want fade even slower:
   * - Increase fadeOutEnd closer to 1.0 (0.995 -> 0.999)
   */
  const fadeInStart = 0.0;
  const fadeInEnd = 0.06;

  const fadeOutStart = 0.86;  // <-- fade starts later (linger)
  const fadeOutEnd = 0.995;   // <-- fade finishes very late (slow)

  const fadeIn = clamp((photoProgress - fadeInStart) / (fadeInEnd - fadeInStart));
  const fadeOut = clamp((fadeOutEnd - photoProgress) / (fadeOutEnd - fadeOutStart));
  const opacity = fadeIn * fadeOut;

  const scale = 1.03 - photoProgress * 0.02;

  return (
    <main className="bg-white text-black">
      {/* HERO */}
      <section className="px-6 sm:px-8 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-gray-600">
            <span>🇸🇬</span>
            <span>Portfolio</span>
            <span className="text-gray-300">•</span>
            <span>Min Xie Ng</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Min Xie Ng
          </h1>

          <p className="max-w-2xl text-gray-600 text-base sm:text-lg leading-7">
            Information Systems student with a strong interest in product and
            user experience — I like turning real-world constraints into clean,
            usable solutions.
          </p>
        </div>
      </section>

      {/* PHOTO SCROLL SECTION (WHITE, SEAMLESS) */}
      <section ref={photoSectionRef} className="relative h-[600vh] bg-white">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          {/* Photo */}
          <div
            className="absolute inset-0"
            style={{
              opacity,
              transform: `scale(${scale})`,
              // Keep a tiny transition so it doesn't look jittery,
              // but most of the smoothness comes from the scroll mapping.
              transition: "opacity 80ms linear, transform 80ms linear",
              willChange: "opacity, transform",
            }}
          >
            <Image
              src="/me/profile.jpg"
              alt="Min Xie Ng"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* White fade-out at bottom (seamless into background) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
        </div>
      </section>

      {/* PROJECTS */}
      <section className="bg-gray-50 px-6 sm:px-8 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Selected Projects
          </h2>

          <p className="mt-3 text-gray-600 max-w-2xl leading-7">
            Visual, scrollable case studies — focused on product decisions,
            user flows, and practical constraints.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {projects.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{p.icon}</span>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        {p.subtitle}
                      </p>
                    </div>

                    <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
                  </div>

                  <span className="rounded-full border px-3 py-1 text-xs text-gray-600">
                    {p.cta} →
                  </span>
                </div>

                <p className="mt-4 text-sm text-gray-600 leading-6">
                  {p.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="px-6 sm:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Min Xie Ng
          </p>
        </div>
      </section>
    </main>
  );
}