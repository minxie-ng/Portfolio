// /app/projects/smufoodapp/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
      { id: "next", label: "Next" },
      { id: "reflection", label: "Reflection" },
    ],
    []
  );

  const [activeId, setActiveId] = useState<string>("top");
  const [progress, setProgress] = useState<number>(0);

  // ---------- Smooth (ease-in-out) scroll for mini-nav ----------
  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 72; // sticky bar height (approx)
    const targetY =
      el.getBoundingClientRect().top + window.scrollY - headerOffset;

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
          .sort(
            (a, b) =>
              (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          )[0];

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
    let latestPct = 0;

    const calcPct = () => {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight || 0;
      const winHeight = window.innerHeight || 0;

      const maxScroll = Math.max(docHeight - winHeight, 1);
      const pct = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      latestPct = pct;

      const nearBottom = scrollTop + winHeight >= docHeight - 8;
      if (nearBottom) setActiveId("reflection");

      return pct;
    };

    const animate = () => {
      setProgress((prev) => {
        const next = prev + (latestPct - prev) * 0.18;
        return Math.abs(next - latestPct) < 0.001 ? latestPct : next;
      });
      rafId = requestAnimationFrame(animate);
    };

    const onScrollOrResize = () => {
      calcPct();
    };

    calcPct();
    rafId = requestAnimationFrame(animate);

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // ---- Edit these if you want ----
  const DEMO_VIDEO_SRC = "/projects/smufoodapp/demo.mp4"; // <- your video file
  // const DEMO_POSTER = "/projects/smufoodapp/poster.jpg"; // optional

  return (
    <main className="bg-white text-black">
      {/* Sticky Mini-Nav + Progress */}
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="h-1 w-full bg-transparent">
          <div
            className="h-1 bg-black"
            style={{ width: `${progress * 100}%` }}
            aria-hidden
          />
        </div>

        <div className="mx-auto flex max-w-4xl items-center gap-2 px-6 sm:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border bg-gray-50 px-3 py-1 text-gray-700">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              SMU Food Pre-Order
            </span>
            <span className="hidden text-gray-400 sm:inline">•</span>
            <span className="hidden text-gray-600 sm:inline">
              Campus Product / Web App
            </span>
          </div>

          <div className="mx-3 hidden h-5 w-px bg-gray-200 sm:block" />

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
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
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
      <section id="top" className="px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2 rounded-full border bg-gray-50 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Feature Concept + Prototype
            </span>
            <span className="text-gray-400">•</span>
            <span>Time-boxed student build</span>
            <span className="text-gray-400">•</span>
            <span>Queue → Pickup</span>
          </div>

          <div className="mt-8 space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              SMU App — Food pre-order that actually fits a 30-minute break
            </h1>

            <p className="max-w-2xl text-lg text-gray-600">
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
                className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-900"
              >
                See the concept <span aria-hidden>→</span>
              </a>

              <a
                href="#flow"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("flow");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
              >
                Jump to user flow <span aria-hidden>→</span>
              </a>

              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
              >
                Back to home <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          {/* TL;DR */}
          <div className="mt-12 rounded-2xl border bg-gray-50 p-6">
            <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500">
              TL;DR
            </h2>

            <div className="mt-4 grid gap-6 sm:grid-cols-3">
              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>⏱️</span>
                  <p className="text-sm font-medium">Problem</p>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Students have ~30 minutes between classes, but peak-hour queues
                  are long and unpredictable.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>🧾</span>
                  <p className="text-sm font-medium">Solution</p>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Pre-order + pickup windows so demand is smoothed and pickup is
                  reliable.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>🚶‍♂️</span>
                  <p className="text-sm font-medium">Outcome</p>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Less waiting, fewer skipped meals, and more predictable stall
                  prep during rush.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="bg-gray-50 px-6 sm:px-8 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">What’s broken today</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium">On the student side</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    —
                  </span>
                  Break is short, but queues are long.
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    —
                  </span>
                  Queue length is unpredictable (and stall-to-stall varies).
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    —
                  </span>
                  Result: rushed meals, skipped food, or late to class.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium">On the vendor side</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    —
                  </span>
                  People give up and walk away during peak.
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    —
                  </span>
                  Prep becomes reactive instead of planned.
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    —
                  </span>
                  The queue looks “full”, even if capacity could be better used.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* USERS */}
      <section id="users" className="px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Who this is for</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border bg-gray-50 p-6">
              <h3 className="font-medium">Primary users</h3>
              <p className="mt-2 text-sm text-gray-600 leading-6">
                SMU undergrads / postgrads with back-to-back classes who just
                want a predictable pickup.
              </p>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-6">
              <h3 className="font-medium">Secondary users</h3>
              <p className="mt-2 text-sm text-gray-600 leading-6">
                Campus food vendors (and indirectly, campus ops) — the feature
                only works if it reduces chaos instead of adding it.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border bg-white p-6">
            <h3 className="font-medium">Edge cases to respect</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="mt-0.5 text-gray-400" aria-hidden>
                  —
                </span>
                Students without smartphones (not the MVP target).
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-gray-400" aria-hidden>
                  —
                </span>
                Vendors who don’t want extra steps (keep their flow minimal).
              </li>
            </ul>
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* CONCEPT + VIDEO */}
      <section id="concept" className="bg-gray-50 px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">The concept</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
          </div>

          <p className="mt-4 max-w-2xl text-gray-600">
            Pre-order works when pickup is reliable. So the core mechanic here
            is a <span className="font-medium text-gray-900">pickup time window</span>
            — it smooths demand for vendors and gives students confidence that
            they won’t get stuck waiting.
          </p>

          {/* Video demo card */}
          <div className="mt-10 overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span aria-hidden>🎥</span>
                <span>Prototype demo (ordering → checkout → confirmation)</span>
              </div>
              <span className="text-sm text-gray-500">Video</span>
            </div>

            <div className="aspect-video w-full bg-white">
              <video
                className="h-full w-full"
                controls
                playsInline
                preload="metadata"
                // poster={DEMO_POSTER} // optional
              >
                <source src={DEMO_VIDEO_SRC} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* FLOW */}
      <section id="flow" className="px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Happy-path flow</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "1) Pick a stall",
                desc: "See what’s open, and the next available pickup slots.",
              },
              {
                title: "2) Pre-order fast",
                desc: "Quick menu + small customisations (e.g., no chili).",
              },
              {
                title: "3) Collect & go",
                desc: "Show pickup code/number, grab food, skip the queue.",
              },
            ].map((x) => (
              <div key={x.title} className="rounded-2xl border bg-gray-50 p-6">
                <div className="text-sm font-medium">{x.title}</div>
                <p className="mt-2 text-sm text-gray-600">{x.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border bg-white p-6">
            <h3 className="font-medium">The key promise</h3>
            <p className="mt-2 text-sm text-gray-600 leading-7">
              The experience should feel like:{" "}
              <span className="font-medium text-gray-900">
                “I can trust this pickup time.”
              </span>{" "}
              If that’s broken, the whole feature collapses.
            </p>
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* MVP */}
      <section id="mvp" className="bg-gray-50 px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">MVP: what we ship first</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium">Must-have</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    ✓
                  </span>
                  Vendor list with open/closed + slot availability
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    ✓
                  </span>
                  Menu + basic customisations
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    ✓
                  </span>
                  Pickup time window selection (slot-based)
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    ✓
                  </span>
                  Confirmation screen: pickup code/number + window + stall
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    ✓
                  </span>
                  SMU login (so it feels official + student-only)
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium">Nice-to-have</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    —
                  </span>
                  Status updates: accepted → preparing → ready
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    —
                  </span>
                  Smart suggestions based on time left
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    —
                  </span>
                  Re-order from history
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    —
                  </span>
                  Promos / student perks
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* SCREENS */}
      <section id="screens" className="px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Key screens</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Vendor list",
                desc: "Open/closed, next available slot, fully booked states.",
              },
              {
                title: "Menu",
                desc: "Fast add-to-cart, quick customisations, clear pricing.",
              },
              {
                title: "Pickup time selector",
                desc: "Slot-based UI that limits demand + shows recommended slot.",
              },
              {
                title: "Order confirmation",
                desc: "Big pickup code + window + location (made for speed).",
              },
              {
                title: "Active orders",
                desc: "Status + countdown + “Help” when things go wrong.",
              },
              {
                title: "Edge states",
                desc: "Booked out, delayed orders, missed pickup window policy.",
              },
            ].map((x) => (
              <div key={x.title} className="rounded-2xl border bg-gray-50 p-6">
                <div className="text-sm font-medium">{x.title}</div>
                <p className="mt-2 text-sm text-gray-600">{x.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* RISKS */}
      <section id="risks" className="bg-gray-50 px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Risks & how to keep it sane</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
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
              <div key={x.risk} className="rounded-2xl border bg-white p-6">
                <div className="grid gap-2 sm:grid-cols-3 sm:gap-6">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Risk
                    </div>
                    <div className="mt-1 text-sm font-medium">{x.risk}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Why it matters
                    </div>
                    <div className="mt-1 text-sm text-gray-600">{x.why}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      MVP mitigation
                    </div>
                    <div className="mt-1 text-sm text-gray-600">{x.fix}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* METRICS */}
      <section id="metrics" className="px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">What “success” looks like</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border bg-gray-50 p-6">
              <h3 className="font-medium">Student metrics</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    ✓
                  </span>
                  Average time saved per student
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    ✓
                  </span>
                  Repeat usage rate (do they come back?)
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    ✓
                  </span>
                  Drop-off rate before confirmation
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-6">
              <h3 className="font-medium">Vendor / ops metrics</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    ✓
                  </span>
                  Reduction in physical queue length
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    ✓
                  </span>
                  Number of pre-orders per day
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-gray-400" aria-hidden>
                    ✓
                  </span>
                  Vendor satisfaction (simple qualitative check-in)
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* NEXT */}
      <section id="next" className="bg-gray-50 px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Open questions</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              "Payment upfront vs deferred?",
              "How strict should pickup windows be?",
              "Can it integrate with class schedules?",
              "Should vendors see demand forecasts?",
            ].map((q) => (
              <div key={q} className="rounded-2xl border bg-white p-6">
                <p className="text-sm text-gray-700">{q}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* REFLECTION */}
      <section id="reflection" className="px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Reflection</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
          </div>

          <div className="mt-8 rounded-2xl border bg-gray-50 p-6">
            <p className="text-sm text-gray-700 leading-7">
              This one taught me that “saving time” isn’t just a feature — it’s a
              promise. The real work is making the promise believable: clear slots,
              simple edge policies, and a pickup experience that doesn’t accidentally
              create a new queue.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
              >
                Back to home <span aria-hidden>→</span>
              </a>

              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("top");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
              >
                Back to top <span aria-hidden>↑</span>
              </a>
            </div>
          </div>

          <p className="mt-10 text-xs text-gray-400">
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