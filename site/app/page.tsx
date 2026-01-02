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
  },
  {
    title: "CMB Dating App Concept",
    subtitle: "Product Concept / UX",
    description:
      "A concept exploration around matching, messaging, and trust signals — focused on improving clarity and reducing friction in key steps.",
    href: "/projects/cmb",
    tags: ["Product Spec", "UX", "Experiment Ideas"],
    icon: "💬",
  },
  {
    title: "SMU App Project",
    subtitle: "Campus Product / Systems",
    description:
      "A campus-focused product build where I worked through scope, user flow, and prioritisation — translating messy constraints into a shippable plan.",
    href: "/projects/smufoodapp",
    tags: ["Scope", "User Flow", "Prioritisation"],
    icon: "🏫",
  },
];

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export default function Home() {
  const photoRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  // --- language rotate (small, tasteful) ---
  const prefersReducedMotion = usePrefersReducedMotion();
  const languageLines = [
    { lang: "EN", text: "Shaping messy ideas into clear product decisions." },
    { lang: "中文", text: "把混乱想法变成清晰可执行的决定。" },
    { lang: "廣東話", text: "将啲乱晒嘅想法整理成清晰可行嘅决定。" },
    { lang: "DE", text: "Ich bringe Chaos in klare Produktentscheidungen." },
    { lang: "ES", text: "Convierto ideas vagas en decisiones claras." },
    { lang: "MY", text: "Menjadikan idea yang berserabut kepada keputusan produk yang jelas dan praktikal." },
  ];
  const [langIndex, setLangIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const t = window.setInterval(() => {
      setLangIndex((i) => (i + 1) % languageLines.length);
    }, 2200);
    return () => window.clearInterval(t);
  }, [prefersReducedMotion]);

  // --- Scroll-driven progress (photo fade-in only) ---
  useEffect(() => {
    let raf = 0;

    const update = () => {
      const el = photoRef.current;
      if (!el) return;

      const scrollY = window.scrollY;

      // ✅ fade starts immediately when user scrolls
      const fadeDistance =120; // pixels to reach full opacity (fast + immediate)
      const p = scrollY <= 0 ? 0 : clamp((scrollY + 20) / fadeDistance); // +40 gives instant visible change

      setProgress(p);
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

  // Fade-in only (no fade-out)
  const photoOpacity = progress; // already 0..1

    // --- Ultra-subtle cursor glow (follows pointer) ---
    const glowRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (prefersReducedMotion) return;

      const el = glowRef.current;
      if (!el) return;

      let raf = 0;

      const move = (e: MouseEvent) => {
        if (raf) return;
        raf = window.requestAnimationFrame(() => {
          raf = 0;
          // position glow using CSS vars (fast + smooth)
          el.style.setProperty("--x", `${e.clientX}px`);
          el.style.setProperty("--y", `${e.clientY}px`);
          el.style.setProperty("--o", `1`);
        });
      };

      const leave = () => {
        el.style.setProperty("--o", `0`);
      };

      document.addEventListener("mouseout", (e) => {
        if (!(e.relatedTarget as Node | null)) leave(); // left the window
      });
      window.addEventListener("blur", leave);

      // start hidden until first move
      el.style.setProperty("--o", `0`);

      return () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseleave", leave);
        if (raf) window.cancelAnimationFrame(raf);
      };
    }, [prefersReducedMotion]);

  return (
    <main className="min-h-screen bg-[#061820] text-white">
      {/* ultra-subtle cursor glow */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          // starts hidden until mouse move (opacity controlled via --o)
          opacity: "var(--o, 0)",
          transition: "opacity 280ms ease-out",
          background:
            "radial-gradient(520px circle at var(--x, 50%) var(--y, 30%), rgba(255,255,255,0.08), transparent 62%)",
        }}
        aria-hidden
      />

      {/* HERO */}
      <section className="relative px-6 sm:px-8 pt-14 pb-12 sm:pt-16 sm:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75">
            <span>🇸🇬</span>
            <span>Portfolio</span>
            <span className="text-white/30">•</span>
            <span>Min Xie Ng</span>
          </div>

          <div className="mt-6">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
              Min Xie Ng
            </h1>

            <p className="mt-4 max-w-2xl text-white/70 text-base sm:text-lg leading-7">
              Information Systems student with a strong interest in product and
              user experience — I like turning real-world constraints into clean,
              usable solutions.
            </p>
          </div>

          <div className="mt-20 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* ABOUT ME */}
      <section className="relative px-6 sm:px-8 py-8 sm:py-0">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl sm:text-5xl font-semibold tracking-[0.22em] text-white/90">
            ABOUT ME
          </h2>

          {/* rotating languages line (subtle) */}
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1">
              <span className="text-[11px] font-semibold tracking-wide text-white/70">
                {languageLines[langIndex].lang}
              </span>
              <span className="text-[11px] text-white/60">•</span>
              <span
                key={langIndex}
                className={[
                  "text-[11px] text-white/75",
                  prefersReducedMotion ? "" : "transition-all duration-300 ease-out",
                ].join(" ")}
              >
                {languageLines[langIndex].text}
              </span>
            </div>
          </div>

          <div className="mt-6 sm:mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12 items-start">
            {/* Photo */}
            <div className="lg:col-span-6">
              <div
                ref={photoRef}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl"
                style={{
                  opacity: photoOpacity,
                  transition: "opacity 180ms ease-out",
                  willChange: "opacity",
                }}
              >
                <Image
                  src="/me/profile.jpg"
                  alt="Min Xie Ng"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30" />
              </div>
              {/* Caption */}
              <p className="mt-3 max-w-md text-xs text-white/50 italic leading-relaxed">
                Took the slow train from Pattaya to Bangkok during a solo backpacking trip — June 2025.
                One of those days where nothing happened, but a lot clicked.
              </p>
            </div>

            {/* Text */}
            <div className="lg:col-span-6 lg:pt-4">
              <h3 className="text-xl sm:text-2xl font-semibold text-white leading-snug">
                I like taking messy ideas and shaping them into something clear and usable.
              </h3>

              <div className="mt-6 space-y-6 text-white/85 leading-7">
                <p>
                  I’m interested in how technology, business, and people come together in real
                  products. I enjoy asking questions, connecting dots across different
                  perspectives, and turning vague thoughts into decisions that actually go somewhere.
                </p>

                <p className="text-white/75">
                  When I’m not studying or building, I’m usually hiking, planning my next trip,
                  or juggling conversations in multiple languages, mostly out of curiosity and
                  sometimes just for fun.
                </p>
              </div>
            </div>
          </div>

          {/* ✅ Divider BELOW About (same vibe as Hero divider) */}
          <div className="mt-18 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* PROJECTS */}
      <section className="px-6 sm:px-8 py-8 sm:py-0">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">
            Projects
          </h2>

          <p className="mt-3 text-white/70 max-w-2xl leading-7">
            Visual, scrollable case studies — focused on product decisions,
            user flows, and practical constraints.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {projects.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className={[
                  "group relative rounded-2xl border border-white/10 bg-white/5 p-6",
                  "transition will-change-transform",
                  "hover:-translate-y-1 hover:bg-white/[0.08] hover:shadow-[0_14px_60px_rgba(0,0,0,0.45)]",
                  "active:scale-[0.99]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{p.icon}</span>
                      <p className="text-xs uppercase tracking-wide text-white/55">
                        {p.subtitle}
                      </p>
                    </div>

                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {p.title}
                    </h3>
                  </div>
                </div>

                <p className="relative mt-4 text-sm text-white/70 leading-6">
                  {p.description}
                </p>

                <p className="relative mt-4 text-xs font-semibold text-white/55 transition-transform duration-300 ease-out group-hover:translate-x-0.5">
                  Tap to preview →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* CONTACT */}
      <section className="px-6 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="h-px w-full bg-white/10 mb-10" />

          <h2 className="text-2xl sm:text-3xl font-semibold text-white">
            Let’s connect !
          </h2>

          <p className="mt-3 max-w-2xl text-white/70 leading-7">
            If you’d like to chat about product, projects, travel stories, or just say hi,
            feel free to reach out :"D
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {/* Email */}
            <a
              href="mailto:minxie0000@gmail.com"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/[0.08] hover:border-white/30"
            >
              📬 Email
              <span className="text-white/50 transition-transform duration-300 group-hover:translate-x-0.5">
                minxie0000@gmail.com →
              </span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/min-xie-ng/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/[0.08] hover:border-white/30"
            >
              💼 LinkedIn
              <span className="text-white/50 transition-transform duration-300 group-hover:translate-x-0.5">
                /min-xie-ng →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="px-6 sm:px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Min Xie Ng
          </p>
        </div>
      </section>
    </main>
  );
}