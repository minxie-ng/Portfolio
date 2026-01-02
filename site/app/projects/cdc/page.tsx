// /projects/cdc/page.tsx
"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";

export default function CDCProject() {
  const sections = useMemo(
    () => [
      { id: "top", label: "Top" },
      { id: "audience", label: "Audience" },
      { id: "prototype", label: "Prototype" },
      { id: "decisions", label: "Decisions" },
      { id: "reflection", label: "Reflection" },
    ],
    []
  );

  const [activeId, setActiveId] = useState<string>("top");
  const [progress, setProgress] = useState<number>(0);

  // Smooth progress bar without re-render choppiness
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // ---------- 1) Smooth (ease-in-out) scroll for mini-nav ----------
  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 76; // slightly taller for glass nav
    const targetY = el.getBoundingClientRect().top + window.scrollY - headerOffset;

    const startY = window.scrollY;
    const delta = targetY - startY;

    const distance = Math.abs(delta);
    const duration = Math.min(650, Math.max(260, 260 + distance * 0.18));

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let startTime: number | null = null;

    const step = (time: number) => {
      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(t);

      window.scrollTo(0, startY + delta * eased);

      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, []);

  // ---------- 2) Sticky mini-nav active section tracking ----------
  useEffect(() => {
    const idsToObserve = sections.map((s) => s.id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        root: null,
        threshold: [0.12, 0.2, 0.35, 0.55],
        rootMargin: "-18% 0px -55% 0px",
      }
    );

    idsToObserve.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  // ---------- 3) Scroll progress indicator + "Reflection active at bottom" fix ----------
  useEffect(() => {
    let rafId = 0;
    let lastCommitted = 0;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight || 0;
      const winHeight = window.innerHeight || 0;

      const maxScroll = Math.max(docHeight - winHeight, 1);
      const pct = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${pct})`;
      }

      if (Math.abs(pct - lastCommitted) > 0.01 || pct === 0 || pct === 1) {
        lastCommitted = pct;
        setProgress(pct);
      }

      const nearBottom = scrollTop + winHeight >= docHeight - 8;
      if (nearBottom) setActiveId("reflection");

      rafId = 0;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#061820] text-white">
      {/* subtle top glow like your home page */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-gradient-to-b from-white/[0.08] to-transparent" />

      {/* Sticky Mini-Nav + Progress */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#061820]/70 backdrop-blur">
        {/* progress bar */}
        <div className="h-1 w-full bg-transparent">
          <div
            ref={progressBarRef}
            className="h-1 origin-left will-change-transform bg-white/80"
            style={{ transform: `scaleX(${progress})` }}
            aria-hidden
          />
        </div>

        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 sm:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
              CDC Case Study
            </span>
          </div>

          <div className="mx-3 hidden h-5 w-px bg-white/10 sm:block" />

          <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
            {sections.map((s) => {
              const isActive = activeId === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(s.id);
                  }}
                  className={[
                    "whitespace-nowrap rounded-full px-3 py-1 text-sm transition",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                    isActive
                      ? "bg-white text-[#061820]"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {s.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* HERO */}
      <section id="top" className="px-6 sm:px-8 pt-16 pb-14 sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-6xl">
          {/* top eyebrow */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
              Product Case Study
            </span>
            <span className="text-white/25">•</span>
            <span>UX / Payments</span>
            <span className="text-white/25">•</span>
            <span>Prototype included</span>
          </div>

          <div className="mt-8 space-y-6">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
              CDC Vouchers — Exact Amount Payment UX
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-white/70 leading-7">
              A product case study on enabling optional flexibility for digitally
              confident users who want to fully utilise CDC vouchers, while
              preserving default experiences for elderly users and merchants.
            </p>

            {/* PRIMARY CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://docs.google.com/document/d/1_oH6ieT1ukCux1Q3q5WWJP1jf0w3Ius0P9GMfqRnxVg/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#061820] transition hover:bg-white/90"
              >
                Read full documentation <span aria-hidden>↗</span>
              </a>

              <a
                href="https://www.figma.com/proto/YnuunkMx8t8J073brR1atf/CDC-Project?node-id=0-1&t=pLBdbvhNsgIxR5ej-1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                Open prototype in Figma <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          {/* TL;DR STRIP */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xs font-medium uppercase tracking-wide text-white/60">
              TL;DR
            </h2>

            <div className="mt-4 grid gap-6 sm:grid-cols-3">
              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>🧩</span>
                  <p className="text-sm font-medium text-white">Problem</p>
                </div>
                <p className="mt-2 text-sm text-white/70 leading-6">
                  Digitally confident users couldn’t fully utilise CDC vouchers
                  due to rigid payment constraints.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>🛠️</span>
                  <p className="text-sm font-medium text-white">Solution</p>
                </div>
                <p className="mt-2 text-sm text-white/70 leading-6">
                  Introduced an optional exact-amount mode layered onto existing
                  flows.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>🧠</span>
                  <p className="text-sm font-medium text-white">Key Insight</p>
                </div>
                <p className="mt-2 text-sm text-white/70 leading-6">
                  Flexibility should be opt-in, not forced, to protect less
                  confident users.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* WHO IT'S FOR / NOT FOR */}
      <section id="audience" className="px-6 sm:px-8 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-white">Target Audience</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="flex items-center gap-2 font-medium text-white">
                <span aria-hidden>🎯</span> Who this is for
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/40" aria-hidden>
                    ✓
                  </span>
                  Digitally confident users
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/40" aria-hidden>
                    ✓
                  </span>
                  Users frustrated by being unable to pay exact amounts
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/40" aria-hidden>
                    ✓
                  </span>
                  Users who want greater control over voucher usage
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="flex items-center gap-2 font-medium text-white">
                <span aria-hidden>🚫</span> Who this is not for
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/40" aria-hidden>
                    ✘
                  </span>
                  Elderly users who prefer the existing voucher flow
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/40" aria-hidden>
                    ✘
                  </span>
                  Users uncomfortable with numeric input
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/40" aria-hidden>
                    ✘
                  </span>
                  Merchants — their workflow remains unchanged
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* PROTOTYPE */}
      <section id="prototype" className="px-6 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
              <span aria-hidden>🧩</span> Prototype &amp; Flow
            </h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <p className="mt-4 max-w-2xl text-white/70 leading-7">
            An optional exact-amount mode layered on top of the existing CDC
            voucher system, designed to avoid disrupting default behaviour.
          </p>

          {/* Embed card */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span aria-hidden>🖥️</span>
                <span>Interactive prototype</span>
              </div>

              <span className="text-sm text-white/45">Embedded</span>
            </div>

            <div className="aspect-video w-full bg-black/30">
              <iframe
                className="h-full w-full"
                src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/YnuunkMx8t8J073brR1atf/CDC-Project?node-id=0-1&t=pLBdbvhNsgIxR5ej-1"
                allowFullScreen
              />
            </div>
          </div>

          <p className="mt-4 text-sm text-white/55">
            Tip: If the embed feels laggy,{" "}
            <a
              href="https://www.figma.com/proto/YnuunkMx8t8J073brR1atf/CDC-Project?node-id=0-1&t=pLBdbvhNsgIxR5ej-1"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
            >
              open it in Figma
            </a>{" "}
            for smoother interaction.
          </p>

          <div className="mt-14 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* KEY INSIGHTS */}
      <section id="decisions" className="px-6 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
              <span aria-hidden>💡</span> Key Product Decisions
            </h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: "🧭",
                title: "Defaults over features",
                body:
                  "Exact-amount mode is optional, ensuring existing users are not forced into new behaviour.",
              },
              {
                icon: "🏪",
                title: "Merchant flow preserved",
                body:
                  "No additional steps are introduced for merchants during payment.",
              },
              {
                icon: "🧱",
                title: "Constraints as design inputs",
                body:
                  "Policy and inclusivity constraints shaped the solution rather than being worked around.",
              },
              {
                icon: "🧾",
                title: "Edge cases build trust",
                body:
                  "Fractional balances and voucher exhaustion were handled deliberately to avoid confusion.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <span aria-hidden>{card.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{card.title}</h3>
                    <p className="mt-2 text-sm text-white/70 leading-6">
                      {card.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* REFLECTION */}
      <section id="reflection" className="px-6 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
              <span aria-hidden>🧠</span> Reflection
            </h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <p className="mt-4 max-w-2xl text-white/70 leading-7">
            This project shifted my thinking from feature-driven design to
            behaviour-driven product decisions grounded in real-world constraints
            and user segmentation.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="https://docs.google.com/document/d/1_oH6ieT1ukCux1Q3q5WWJP1jf0w3Ius0P9GMfqRnxVg/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#061820] transition hover:bg-white/90"
            >
              Read the full CDC documentation <span aria-hidden>↗</span>
            </a>
            
            {/* Next project: CMB */}
            <a
              href="/projects/cmb"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Next project: CMB Concept <span aria-hidden>→</span>
            </a>
          
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Back to home <span aria-hidden>→</span>
            </a>
          </div>

          <p className="mt-10 text-xs text-white/40">
            Built with Next.js + Tailwind • Deployed on Vercel
          </p>
        </div>
      </section>
    </main>
  );
}