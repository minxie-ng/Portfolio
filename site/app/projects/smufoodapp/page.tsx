// /app/projects/smufoodapp/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function SMUFoodAppProject() {
  const sections = useMemo(
    () => [
      { id: "top", label: "Top" },
      { id: "problem", label: "Problem" },
      { id: "users", label: "Users" },
      { id: "concept", label: "Concept" },
      { id: "flow", label: "Flow" },
      { id: "mvp", label: "MVP" },
      { id: "screens", label: "Screens" },
      { id: "risks", label: "Risks" },
      { id: "metrics", label: "Metrics" },
      { id: "questions-for-thought", label: "Questions for thought" },
      { id: "reflection", label: "Reflection" },
    ],
    []
  );

  const [activeId, setActiveId] = useState<string>("top");
  const [progress, setProgress] = useState<number>(0);

  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // ---------- Smooth (ease-in-out) scroll for mini-nav ----------
  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 72; // sticky bar height (approx)
    const targetY = el.getBoundingClientRect().top + window.scrollY - headerOffset;

    const startY = window.scrollY;
    const delta = targetY - startY;

    const distance = Math.abs(delta);
    const duration = Math.min(700, Math.max(240, 240 + distance * 0.2));

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

  // ---------- Active section tracking ----------
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

  // ---------- Smooth scroll progress + last tab activation ----------
  useEffect(() => {
    let rafId = 0;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight || 0;
      const winHeight = window.innerHeight || 0;

      const maxScroll = Math.max(docHeight - winHeight, 1);
      const pct = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

      // ✅ Smooth bar without re-render: write transform directly
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${pct})`;
      }

      // State for a11y/debug (lightweight)
      setProgress((prev) => (Math.abs(prev - pct) < 0.002 ? prev : pct));

      const nearBottom = scrollTop + winHeight >= docHeight - 8;
      if (nearBottom) setActiveId("reflection");

      rafId = 0;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // ---- Edit these if you want ----
  const DEMO_VIDEO_SRC = "/projects/smufoodapp/demo.mp4"; // <- your video file
  // const DEMO_POSTER = "/projects/smufoodapp/poster.jpg"; // optional

  return (
    <main className="min-h-screen bg-[#061820] text-white">
      {/* Subtle top glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-white/[0.08] to-transparent" />

      {/* Sticky Mini-Nav + Progress */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#061820]/80 backdrop-blur">
        <div className="h-1 w-full bg-transparent">
          <div
            ref={progressBarRef}
            className="h-1 origin-left bg-white/80 will-change-transform"
            style={{ transform: `scaleX(${progress})` }}
            aria-hidden
          />
        </div>

        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 sm:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/75">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              SMU Food Pre-Order
            </span>
            <span className="hidden text-white/30 sm:inline">•</span>
            <span className="hidden text-white/60 sm:inline">
              Campus Product / Web App
            </span>
          </div>

          <div className="mx-3 hidden h-5 w-px bg-white/10 sm:block" />

          <nav className="flex flex-1 items-center gap-1 overflow-x-auto no-scrollbar">
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
                      : "text-white/65 hover:bg-white/10 hover:text-white",
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
      <section id="top" className="px-6 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              Feature Concept + Prototype
            </span>
            <span className="text-white/25">•</span>
            <span>Time-boxed student build</span>
            <span className="text-white/25">•</span>
            <span>Queue → Pickup</span>
          </div>

          <div className="mt-8 space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              SMU App — Food pre-order that actually fits a 30-minute break
            </h1>

            <p className="max-w-2xl text-lg text-white/70">
              The idea is simple: let students lock in a pickup slot, grab their
              food fast, and stop gambling their lunch on unpredictable queues.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#concept"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("concept");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#061820] transition hover:bg-white/90 active:scale-[0.99]"
              >
                See the concept <span aria-hidden>→</span>
              </a>

              <a
                href="#flow"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("flow");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 active:scale-[0.99]"
              >
                Jump to user flow <span aria-hidden>→</span>
              </a>

              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white/55 transition hover:bg-white/10 hover:text-white active:scale-[0.99]"
              >
                Back to home <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          {/* TL;DR */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xs font-medium uppercase tracking-wide text-white/60">
              TL;DR
            </h2>

            <div className="mt-4 grid gap-6 sm:grid-cols-3">
              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>⏱️</span>
                  <p className="text-sm font-medium text-white">Problem</p>
                </div>
                <p className="mt-2 text-sm text-white/70">
                  Students have ~30 minutes between classes, but peak-hour queues
                  are long and unpredictable.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>🧾</span>
                  <p className="text-sm font-medium text-white">Solution</p>
                </div>
                <p className="mt-2 text-sm text-white/70">
                  Pre-order + pickup windows so demand is smoothed and pickup is
                  reliable.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>🚶‍♂️</span>
                  <p className="text-sm font-medium text-white">Outcome</p>
                </div>
                <p className="mt-2 text-sm text-white/70">
                  Less waiting, fewer skipped meals, and more predictable stall
                  prep during rush.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="px-6 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">What’s broken today</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium text-white">On the student side</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/40" aria-hidden>
                    —
                  </span>
                  Break is short, but queues are long.
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/40" aria-hidden>
                    —
                  </span>
                  Queue length is unpredictable (and stall-to-stall varies).
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/40" aria-hidden>
                    —
                  </span>
                  Result: rushed meals, skipped food, or late to class.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium text-white">On the vendor side</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/40" aria-hidden>
                    —
                  </span>
                  People give up and walk away during peak.
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/40" aria-hidden>
                    —
                  </span>
                  Prep becomes reactive instead of planned.
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/40" aria-hidden>
                    —
                  </span>
                  The queue looks “full”, even if capacity could be better used.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* USERS */}
      <section id="users" className="px-6 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Who this is for</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium text-white">Primary users</h3>
              <p className="mt-2 text-sm text-white/70 leading-6">
                SMU undergrads / postgrads with back-to-back classes who just
                want a predictable pickup.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium text-white">Secondary users</h3>
              <p className="mt-2 text-sm text-white/70 leading-6">
                Campus food vendors (and indirectly, campus ops) — the feature
                only works if it reduces chaos instead of adding it.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-medium text-white">Edge cases to respect</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li className="flex gap-2">
                <span className="mt-0.5 text-white/40" aria-hidden>
                  —
                </span>
                Students without smartphones (not the MVP target).
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-white/40" aria-hidden>
                  —
                </span>
                Vendors who don’t want extra steps (keep their flow minimal).
              </li>
            </ul>
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* CONCEPT + VIDEO */}
      <section id="concept" className="px-6 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">The concept</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <p className="mt-4 max-w-2xl text-white/70">
            Pre-order works when pickup is reliable. So the core mechanic here
            is a{" "}
            <span className="font-medium text-white">
              pickup time window
            </span>{" "}
            — it smooths demand for vendors and gives students confidence that
            they won’t get stuck waiting.
          </p>

          {/* Video demo card */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span aria-hidden>🎥</span>
                <span>Prototype demo (ordering → checkout → confirmation)</span>
              </div>
              <span className="text-sm text-white/50">Video</span>
            </div>

            <div className="aspect-video w-full bg-black/10">
              <video className="h-full w-full" controls playsInline preload="metadata">
                <source src={DEMO_VIDEO_SRC} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* FLOW */}
      <section id="flow" className="px-6 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Happy-path flow</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { title: "1) Pick a stall", desc: "See what’s open, and the next available pickup slots." },
              { title: "2) Pre-order fast", desc: "Quick menu + small customisations (e.g., no chili)." },
              { title: "3) Collect & go", desc: "Show pickup code/number, grab food, skip the queue." },
            ].map((x) => (
              <div key={x.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm font-medium text-white">{x.title}</div>
                <p className="mt-2 text-sm text-white/70">{x.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-medium text-white">The key promise</h3>
            <p className="mt-2 text-sm text-white/70 leading-7">
              The experience should feel like:{" "}
              <span className="font-medium text-white">
                “I can trust this pickup time.”
              </span>{" "}
              If that’s broken, the whole feature collapses.
            </p>
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* MVP */}
      <section id="mvp" className="px-6 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">MVP: what we ship first</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium text-white">Must-have</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {[
                  "Vendor list with open/closed + slot availability",
                  "Menu + basic customisations",
                  "Pickup time window selection (slot-based)",
                  "Confirmation screen: pickup code/number + window + stall",
                  "SMU login (so it feels official + student-only)",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-0.5 text-white/50" aria-hidden>
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium text-white">Nice-to-have</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {[
                  "Status updates: accepted → preparing → ready",
                  "Smart suggestions based on time left",
                  "Re-order from history",
                  "Promos / student perks",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-0.5 text-white/50" aria-hidden>
                      —
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* SCREENS */}
      <section id="screens" className="px-6 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Key screens</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { title: "Vendor list", desc: "Open/closed, next available slot, fully booked states." },
              { title: "Menu", desc: "Fast add-to-cart, quick customisations, clear pricing." },
              { title: "Pickup time selector", desc: "Slot-based UI that limits demand + shows recommended slot." },
              { title: "Order confirmation", desc: "Big pickup code + window + location (made for speed)." },
              { title: "Active orders", desc: "Status + countdown + “Help” when things go wrong." },
              { title: "Edge states", desc: "Booked out, delayed orders, missed pickup window policy." },
            ].map((x) => (
              <div key={x.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm font-medium text-white">{x.title}</div>
                <p className="mt-2 text-sm text-white/70">{x.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* RISKS */}
      <section id="risks" className="px-6 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Risks & how to keep it sane</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <div className="mt-10 grid gap-6">
            {[
              {
                risk: "Vendors get overwhelmed at peak",
                why: "Late orders = angry students + broken trust.",
                fix: "Cap orders per slot, cap items per order, let vendors pause pre-orders.",
              },
              {
                risk: "Students miss pickup windows",
                why: "Food waste + vendor frustration.",
                fix: "Clear reminders + short grace period + simple late policy.",
              },
              {
                risk: "Low adoption",
                why: "Feature becomes dead weight.",
                fix: "Start with a small pilot (2–3 stalls), optimise for speed, promote during peak breaks.",
              },
              {
                risk: "Pickup confusion creates a new queue",
                why: "If pickup isn’t obvious, the problem returns.",
                fix: "Dedicated pickup point/signage + big pickup code screen + (optional) ready shelf idea.",
              },
            ].map((x) => (
              <div key={x.risk} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="grid gap-2 sm:grid-cols-3 sm:gap-6">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-white/55">
                      Risk
                    </div>
                    <div className="mt-1 text-sm font-medium text-white">{x.risk}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-white/55">
                      Why it matters
                    </div>
                    <div className="mt-1 text-sm text-white/70">{x.why}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-white/55">
                      MVP mitigation
                    </div>
                    <div className="mt-1 text-sm text-white/70">{x.fix}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* METRICS */}
      <section id="metrics" className="px-6 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">What “success” looks like</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium text-white">Student metrics</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {[
                  "Average time saved per student",
                  "Repeat usage rate (do they come back?)",
                  "Drop-off rate before confirmation",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-0.5 text-white/50" aria-hidden>
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium text-white">Vendor / ops metrics</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {[
                  "Reduction in physical queue length",
                  "Number of pre-orders per day",
                  "Vendor satisfaction (simple qualitative check-in)",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-0.5 text-white/50" aria-hidden>
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* QUESTIONS FOR THOUGHTS */}
      <section id="questions-for-thought" className="px-6 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">FAQ / open questions</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <p className="mt-4 max-w-2xl text-white/70">
            Stuff I kept debating while building the concept — these are my
            current thoughts, not “final answers”.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                q: "Payment upfront vs deferred?",
                a: "For an MVP, I’d lean towards paying upfront (or at least confirming the order properly). If it’s deferred, people might spam orders “just in case”, then ghost — and the stall gets stuck with extra prep. Upfront makes the slot feel real. If SMU wants it frictionless, a compromise is: allow deferred only for a small pilot + strict limits per user.",
              },
              {
                q: "How strict should pickup windows be?",
                a: "Not super strict at the start. I’d do a small grace period (like 5–10 mins) because class timing is messy and humans are late. But I’d still keep the window concept clear, because that’s what makes the whole thing predictable. If someone misses it badly, then we need a simple rule like “late pickup = join normal queue” or “auto-cancel after X mins”.",
              },
              {
                q: "Can it integrate with class schedules?",
                a: "Yes — but I’d treat it as a “phase 2” nice-to-have. The MVP should already work even if the app knows nothing about your timetable. Later on, schedule integration can make it smarter, like: “You have 18 mins — these stalls fit” or automatically suggesting pickup slots based on your next class location.",
              },
              {
                q: "Should vendors see demand forecasts?",
                a: "Eventually yes, but I’d keep the vendor side super simple first. What vendors need for MVP is: current orders + upcoming slots + the ability to pause pre-orders if things get too crazy. Forecasts are useful, but only if the basic workflow is already smooth — otherwise it becomes another thing they ignore during rush.",
              },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-semibold text-white">{item.q}</h3>
                </div>
                <p className="mt-3 text-sm text-white/70 leading-7">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* REFLECTION */}
      <section id="reflection" className="px-6 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Reflection</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/70 leading-7">
              This one taught me that “saving time” isn’t just a feature — it’s a
              promise. The real work is making the promise believable: clear slots,
              simple edge policies, and a pickup experience that doesn’t accidentally
              create a new queue.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 active:scale-[0.99]"
              >
                Back to home <span aria-hidden>→</span>
              </a>

              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("top");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white/55 transition hover:bg-white/10 hover:text-white active:scale-[0.99]"
              >
                Back to top <span aria-hidden>↑</span>
              </a>
            </div>
          </div>

          <p className="mt-10 text-xs text-white/40">
            Built with Next.js + Tailwind • Deployed on Vercel
          </p>
        </div>
      </section>

      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none; /* IE/Edge */
          scrollbar-width: none; /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
      `}</style>
    </main>
  );
}