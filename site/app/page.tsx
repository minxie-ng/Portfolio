// /site/app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [mountainProgressRaw, setMountainProgressRaw] = useState(0);

  // --- language rotate (small, tasteful) ---
  const prefersReducedMotion = usePrefersReducedMotion();
  const languageLines = [
    { lang: "EN", text: "Shaping messy ideas into clear product decisions." },
    { lang: "中文", text: "把混乱想法变成清晰可执行的决定。" },
    { lang: "廣東話", text: "将啲乱晒嘅想法整理成清晰可行嘅决定。" },
    { lang: "DE", text: "Ich bringe Chaos in klare Produktentscheidungen." },
    { lang: "ES", text: "Convierto ideas vagas en decisiones claras." },
    {
      lang: "MY",
      text: "Menjadikan idea yang berserabut kepada keputusan produk yang jelas dan praktikal.",
    },
  ];
  const [langIndex, setLangIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const t = window.setInterval(() => {
      setLangIndex((i) => (i + 1) % languageLines.length);
    }, 2200);
    return () => window.clearInterval(t);
  }, [prefersReducedMotion]);

  // Passport stamps data (make notes feel like they came from the same passport)
  const passportStamps = useMemo(
    () => [
      { code: "EN", level: "C2", note: "Cleared for takeoff", emoji: "🛂" },
      { code: "中文", level: "C2", note: "Fast lane entry", emoji: "🧧" },
      { code: "廣東話", level: "B2", note: "Smooth transit", emoji: "🀄" },
      { code: "DE", level: "B1", note: "Stamp in progress", emoji: "🧳" },
      { code: "ES", level: "A1", note: "First stamp, onz", emoji: "🌶️" },
      { code: "MY", level: "B1", note: "Boleh, terus jalan", emoji: "🍃" },
    ],
    []
  );

  // --- Scroll-driven progress (more 3D “passport page roll” reveal) ---
  useEffect(() => {
    if (prefersReducedMotion) {
      setProgress(1);
      setMountainProgressRaw(0);
      return;
    }

    let raf = 0;

    const update = () => {
      const scrollY = window.scrollY;

      // slightly slower than old fade for a “page roll” vibe
      const revealDistance = 220;
      const p = scrollY <= 0 ? 0 : clamp((scrollY + 18) / revealDistance);

      const aboutPeak = window.innerHeight * 0.86;
      const mountainP = scrollY <= 0 ? 0 : clamp(scrollY / Math.max(aboutPeak, 1));

      setProgress(p);
      setMountainProgressRaw(mountainP);
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
  }, [prefersReducedMotion]);

  // smoothstep easing
  const roll = prefersReducedMotion ? 1 : progress;
  const eased = roll * roll * (3 - 2 * roll);

  // “page” transform (soften + less rigid)
  const rotateX = -86 * (1 - eased); // deg
  const rotateZ = -1.2 * (1 - eased); // tiny twist
  const translateY = 22 * (1 - eased); // px
  const scaleY = 0.92 + 0.08 * eased; // starts slightly compressed
  const blur = 0.9 * (1 - eased);
  const shadowA = 0.34 * (1 - eased);

  const photoRollStyle: React.CSSProperties = {
    opacity: eased,
    transform: `perspective(1100px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) translateY(${translateY}px) scaleY(${scaleY})`,
    transformOrigin: "top center",
    filter: `blur(${blur}px)`,
    boxShadow: `0 30px 110px rgba(0,0,0,${shadowA})`,
    transition:
      "transform 220ms cubic-bezier(0.2, 0.9, 0.2, 1), opacity 180ms ease-out, filter 220ms ease-out, box-shadow 220ms ease-out",
    willChange: "transform, opacity, filter",
    backfaceVisibility: "hidden",
  };

  // Keep this var name if referenced elsewhere
  const photoOpacity = eased;

  // --- ✨ Layout “wow” (no awkward gap on mobile) ---
  const photoBlockInnerRef = useRef<HTMLDivElement | null>(null);
  const [photoBlockH, setPhotoBlockH] = useState(0);

  useEffect(() => {
    const el = photoBlockInnerRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.getBoundingClientRect().height;
      if (h && Math.abs(h - photoBlockH) > 1) setPhotoBlockH(h);
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const photoRevealHeight = photoBlockH ? photoBlockH * eased : 0;

  const mountainMotion = 1 - Math.pow(1 - mountainProgressRaw, 2.2);
  const mountainVisibility = mountainProgressRaw * mountainProgressRaw * (3 - 2 * mountainProgressRaw);
  const mountainSvgStyle: React.CSSProperties = {
    opacity: 0.08 + mountainVisibility * 0.3,
    transform: `translate3d(calc(-50% + ${mountainMotion * 20}px), ${mountainMotion * -24}px, 0) scale(${1.02 + mountainMotion * 0.025})`,
    transition: prefersReducedMotion
      ? "none"
      : "transform 180ms ease-out, opacity 220ms ease-out",
    willChange: prefersReducedMotion ? "auto" : "transform, opacity",
    mixBlendMode: "screen",
  };
  const mountainLineStyle: React.CSSProperties = {
    strokeDasharray: prefersReducedMotion ? "1 0" : "0.5 1",
    strokeDashoffset: prefersReducedMotion ? 0 : 0.62 - mountainMotion * 0.84,
    transition: prefersReducedMotion ? "none" : "stroke-dashoffset 180ms ease-out",
  };
  const mountainRidgeStyle: React.CSSProperties = {
    opacity: 0.035 + mountainVisibility * 0.13,
    transform: `translate3d(${mountainMotion * -12}px, ${mountainMotion * -12}px, 0)`,
    transition: prefersReducedMotion
      ? "none"
      : "transform 220ms ease-out, opacity 220ms ease-out",
    willChange: prefersReducedMotion ? "auto" : "transform, opacity",
  };
  const mountainTraceStyle: React.CSSProperties = {
    opacity: 0.025 + mountainVisibility * 0.11,
    transform: `translate3d(${mountainMotion * -18}px, ${mountainMotion * -18}px, 0)`,
    transition: prefersReducedMotion
      ? "none"
      : "transform 220ms ease-out, opacity 220ms ease-out",
    willChange: prefersReducedMotion ? "auto" : "transform, opacity",
  };

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
        el.style.setProperty("--x", `${e.clientX}px`);
        el.style.setProperty("--y", `${e.clientY}px`);
        el.style.setProperty("--o", `1`);
      });
    };

    const leave = () => {
      el.style.setProperty("--o", `0`);
    };

    window.addEventListener("mousemove", move, { passive: true });

    document.addEventListener("mouseout", (e) => {
      if (!(e.relatedTarget as Node | null)) leave();
    });

    window.addEventListener("blur", leave);

    el.style.setProperty("--o", `0`);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("blur", leave);
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
          opacity: "var(--o, 0)",
          transition: "opacity 280ms ease-out",
          background:
            "radial-gradient(520px circle at var(--x, 50%) var(--y, 30%), rgba(255,255,255,0.08), transparent 62%)",
        }}
        aria-hidden
      />

      {/* HERO + ABOUT transition atmosphere */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1120px] sm:h-[1320px]" aria-hidden>
          <div className="absolute inset-x-0 top-[78vh] h-96 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_64%)]" />
          <svg
            className="absolute left-1/2 top-[72vh] h-[22rem] w-[64rem] max-w-none sm:top-[72vh] sm:h-[30rem] sm:w-[92rem] lg:top-[70vh] lg:h-[34rem] lg:w-[112rem]"
            viewBox="0 0 1440 420"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={mountainSvgStyle}
          >
            <defs>
              <filter id="hero-mountain-glow" x="-15%" y="-80%" width="130%" height="260%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="0 0 0 0 0.86 0 0 0 0 0.98 0 0 0 0 1 0 0 0 0.38 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="hero-mountain-line" x1="80" y1="220" x2="1360" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" stopOpacity="0" />
                <stop offset="0.14" stopColor="white" stopOpacity="0.34" />
                <stop offset="0.45" stopColor="white" stopOpacity="0.86" />
                <stop offset="0.72" stopColor="white" stopOpacity="0.54" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              pathLength="1"
              d="M58 274 C136 244 196 206 268 214 C326 221 364 260 430 238 C504 214 550 136 620 138 C694 140 742 236 810 226 C878 216 908 164 966 160 C1038 154 1086 232 1156 218 C1224 204 1268 162 1386 132"
              stroke="url(#hero-mountain-line)"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#hero-mountain-glow)"
              style={mountainLineStyle}
            />
            <path
              d="M242 252 L344 170 L434 250 L506 214 L602 284 L720 132 L858 278 L962 198 L1070 254 L1184 178"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={mountainRidgeStyle}
            />
            <path
              d="M96 318 C284 276 452 304 624 292 C782 281 890 242 1038 238 C1172 234 1260 198 1370 162"
              stroke="white"
              strokeWidth="1.1"
              strokeLinecap="round"
              style={mountainTraceStyle}
            />
          </svg>
        </div>

        {/* HERO */}
        <section className="relative flex min-h-[88svh] px-6 sm:px-8 pt-14 pb-14 sm:min-h-screen sm:pt-16 sm:pb-20">
          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75">
              <span>🇸🇬</span>
              <span>Portfolio</span>
              <span className="text-white/30">•</span>
              <span>Min Xie Ng</span>
            </div>

            <div className="mt-8 sm:mt-10">
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
                Min Xie Ng
              </h1>

              <p className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Curious enough to explore.
                <br />
                Practical enough to build.
              </p>

              <p className="mt-6 max-w-2xl text-xs uppercase tracking-[0.24em] text-white/55 sm:text-sm sm:tracking-[0.28em]">
                Information Systems · Product · Tech · Languages · Mountains · Backpacking
              </p>
            </div>

            <div className="mt-16 h-px w-full bg-white/10 sm:mt-24" />
          </div>
        </section>

        {/* ABOUT ME */}
        <section className="relative z-10 px-6 sm:px-8 pt-12 pb-8 sm:pt-20 sm:pb-0">
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

          {/* ✅ Passport stamp row (now looks more like stamps) */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {passportStamps.map((s, idx) => (
              <span
                key={s.code}
                className={[
                  "stamp inline-flex items-center gap-2 rounded-full",
                  "border border-white/10 bg-white/5",
                  "px-3 py-1 text-[11px] sm:text-xs",
                  "text-white/75",
                  "transition duration-200 ease-out",
                  "hover:bg-white/[0.08] hover:-translate-y-[1px]",
                  "active:translate-y-0",
                  "select-none",
                ].join(" ")}
                style={{
                  transform: `rotate(${idx % 2 === 0 ? -1.8 : 1.6}deg)`,
                }}
                title={`${s.code} • ${s.level} • ${s.note}`}
              >
                <span className="stamp-ink stamp-emoji" aria-hidden>
                  {s.emoji}
                </span>
                <span className="stamp-ink stamp-code">{s.code}</span>
                <span className="stamp-ink stamp-dot">•</span>
                <span className="stamp-ink stamp-level">{s.level}</span>
                <span className="stamp-ink stamp-dot">•</span>
                <span className="stamp-ink stamp-note">{s.note}</span>
              </span>
            ))}
          </div>

          <div className="mt-6 sm:mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12 items-start">
            {/* Photo (collapses to avoid empty gap, then expands + rolls in) */}
            <div className="lg:col-span-6">
              {/* Animated height wrapper */}
              <div
                className="overflow-hidden"
                style={{
                  height: photoRevealHeight,
                  transition: prefersReducedMotion
                    ? "none"
                    : "height 560ms cubic-bezier(0.2, 0.92, 0.2, 1)",
                  willChange: "height",
                }}
                aria-hidden={photoOpacity === 0}
              >
                {/* Actual content measured at full size */}
                <div ref={photoBlockInnerRef}>
                  <div
                    ref={photoRef}
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl"
                    style={photoRollStyle}
                  >
                    {/* “rolled edge” overlay for extra 3D depth */}
                    <div
                      className="roll-edge pointer-events-none absolute inset-x-0 top-0"
                      style={{
                        height: `${Math.max(0, 46 * (1 - eased))}px`,
                        opacity: Math.max(0, 1 - eased),
                        transform: `perspective(900px) rotateX(${92 - 92 * eased}deg) translateY(${
                          -10 * (1 - eased)
                        }px)`,
                        transformOrigin: "top center",
                      }}
                      aria-hidden
                    />

                    {/* subtle “passport paper” texture overlay */}
                    <div className="paper-texture pointer-events-none absolute inset-0" />

                    <Image
                      src="/me/profile.jpg"
                      alt="Min Xie Ng"
                      fill
                      priority
                      className="object-cover"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
                  </div>

                  {/* Caption */}
                  <p className="mt-3 max-w-md text-xs text-white/50 italic leading-relaxed">
                    Took the slow train from Pattaya to Bangkok during a solo backpacking trip —
                    June 2025. One of those days where nothing happened, but a lot clicked.
                  </p>
                </div>
              </div>
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
                  When I’m not studying or building, I’m usually hiking, planning my next trip, or
                  juggling conversations in multiple languages, mostly out of curiosity and
                  sometimes just for fun.
                </p>
              </div>
            </div>
          </div>

          {/* ✅ Divider BELOW About */}
          <div className="mt-18 h-px w-full bg-white/10" />
        </div>
        </section>
      </div>

      {/* PROJECTS */}
      <section className="px-6 sm:px-8 py-8 sm:py-0">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">Projects</h2>

          <p className="mt-3 text-white/70 max-w-2xl leading-7">
            Visual, scrollable case studies — focused on product decisions, user flows, and practical
            constraints.
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
                      <p className="text-xs uppercase tracking-wide text-white/55">{p.subtitle}</p>
                    </div>

                    <h3 className="mt-2 text-lg font-semibold text-white">{p.title}</h3>
                  </div>
                </div>

                <p className="relative mt-4 text-sm text-white/70 leading-6">{p.description}</p>

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

          <h2 className="text-2xl sm:text-3xl font-semibold text-white">Let’s connect !</h2>

          <p className="mt-3 max-w-2xl text-white/70 leading-7">
            If you’d like to chat about product, projects, travel stories, or just say hi, feel free
            to reach out ! :"D
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
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Min Xie Ng</p>
        </div>
      </section>

      <style jsx global>{`
        /* --- Passport-stamp vibe --- */
        .stamp {
          position: relative;
          letter-spacing: 0.08em;
          text-transform: uppercase;

          /* “ink” feel */
          filter: saturate(1.05) contrast(1.02);
        }

        /* rough, stamp-y edge + inner ring */
        .stamp:before,
        .stamp:after {
          content: "";
          position: absolute;
          inset: -3px;
          border-radius: 9999px;
          pointer-events: none;
        }

        .stamp:before {
          border: 1px dashed rgba(255, 255, 255, 0.22);
          opacity: 0.8;
          transform: rotate(-0.6deg);
        }

        .stamp:after {
          inset: 2px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          opacity: 0.85;
        }

        /* “ink” text styles */
        .stamp-ink {
          opacity: 0.92;
          text-shadow: 0 0 0.6px rgba(255, 255, 255, 0.25);
        }

        .stamp-emoji {
          opacity: 0.65;
          transform: rotate(-6deg);
        }

        .stamp-code {
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .stamp-level {
          font-weight: 700;
          opacity: 0.85;
        }

        .stamp-note {
          opacity: 0.78;
          letter-spacing: 0.06em;
          text-transform: none;
        }

        .stamp-dot {
          opacity: 0.35;
        }

        /* --- Photo “passport page” texture + roll edge --- */
        .paper-texture {
          background-image:
            radial-gradient(1200px 800px at 20% 10%, rgba(255, 255, 255, 0.05), transparent 55%),
            radial-gradient(900px 700px at 80% 30%, rgba(255, 255, 255, 0.03), transparent 60%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 40%),
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.02),
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px,
              transparent 10px
            );
          mix-blend-mode: soft-light;
          opacity: 0.55;
        }

        .roll-edge {
          /* “curl” highlight + shadow (feels more 3D than flat rotate) */
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.22),
              rgba(255, 255, 255, 0.12) 26%,
              rgba(0, 0, 0, 0.18) 62%,
              rgba(0, 0, 0, 0.0)
            );
          box-shadow:
            0 18px 50px rgba(0, 0, 0, 0.22),
            inset 0 -10px 18px rgba(0, 0, 0, 0.22),
            inset 0 6px 14px rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </main>
  );
}