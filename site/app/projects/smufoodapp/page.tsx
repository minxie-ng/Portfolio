// /app/projects/smu/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export default function SMUProject() {
  const sections = useMemo(
    () => [
      { id: "top", label: "Top" },
      { id: "context", label: "Context" },
      { id: "scope", label: "Scope" },
      { id: "flow", label: "User Flow" },
      { id: "build", label: "Build" },
      { id: "reflection", label: "Reflection" },
    ],
    []
  );

  const [activeId, setActiveId] = useState<string>("top");
  const [progress, setProgress] = useState<number>(0);

  // Smooth scroll for mini-nav
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

  // Active section tracking
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

  // Smooth scroll progress + last tab activation
  useEffect(() => {
    let rafId = 0;
    let latestPct = 0;

    const calcPct = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
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

  return (
    <main className="bg-white text-black">
      {/* Sticky Mini-Nav + Progress */}
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="h-1 w-full bg-transparent">
          <div className="h-1 bg-black" style={{ width: `${progress * 100}%` }} aria-hidden />
        </div>

        <div className="mx-auto flex max-w-4xl items-center gap-2 px-6 sm:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border bg-gray-50 px-3 py-1 text-gray-700">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              SMU App Project
            </span>
            <span className="hidden text-gray-400 sm:inline">•</span>
            <span className="hidden text-gray-600 sm:inline">Campus Product / Systems</span>
          </div>

          <div className="mx-3 hidden h-5 w-px bg-gray-200 sm:block" />

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
              Project Build
            </span>
            <span className="text-gray-400">•</span>
            <span>SMU</span>
            <span className="text-gray-400">•</span>
            <span>Web / Product Thinking</span>
          </div>

          <div className="mt-8 space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              SMU App — From messy requirements to a shippable plan
            </h1>

            <p className="max-w-2xl text-lg text-gray-600">
              A campus-focused product build where we worked through scope, user flows,
              and prioritisation — translating constraints into something users can actually use.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
              >
                Back to home <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border bg-gray-50 p-6">
            <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500">
              TL;DR
            </h2>

            <div className="mt-4 grid gap-6 sm:grid-cols-3">
              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>🧩</span>
                  <p className="text-sm font-medium">Focus</p>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Clear scope, clean flows, and realistic trade-offs.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>🗺️</span>
                  <p className="text-sm font-medium">Method</p>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Break problem → define users → map flow → prioritise.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>🚀</span>
                  <p className="text-sm font-medium">Outcome</p>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  A structured plan that’s easier to build + evaluate.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* CONTEXT */}
      <section id="context" className="bg-gray-50 px-6 sm:px-8 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Context</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium">What we were trying to solve</h3>
              <p className="mt-3 text-sm text-gray-600 leading-6">
                A practical campus problem where requirements are messy, stakeholders differ,
                and “nice-to-have” can easily blow up scope.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium">Constraints</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>—</span> Limited time (semester timeline)</li>
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>—</span> Buildable by a student team</li>
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>—</span> Must support a clean demo flow</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* SCOPE */}
      <section id="scope" className="px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Scope & prioritisation</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border bg-gray-50 p-6">
              <h3 className="font-medium">Must-have</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>✓</span> One clean end-to-end flow</li>
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>✓</span> Clear UI states</li>
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>✓</span> Sensible defaults</li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-6">
              <h3 className="font-medium">Nice-to-have</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>—</span> Extra features after core flow</li>
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>—</span> Personalisation / automation</li>
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>—</span> Secondary user journeys</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* FLOW */}
      <section id="flow" className="bg-gray-50 px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">User flow</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
          </div>

          <p className="mt-4 max-w-2xl text-gray-600">
            The flow was designed to be demoable, obvious, and resilient to edge cases.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { title: "Entry", desc: "User lands and immediately knows what to do." },
              { title: "Action", desc: "A single primary path with low friction." },
              { title: "Outcome", desc: "Clear confirmation + next step." },
            ].map((x) => (
              <div key={x.title} className="rounded-2xl border bg-white p-6">
                <div className="text-sm font-medium">{x.title}</div>
                <p className="mt-2 text-sm text-gray-600">{x.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* BUILD */}
      <section id="build" className="px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Build notes</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border bg-gray-50 p-6">
              <h3 className="font-medium">What I did</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>—</span> Turned requirements into sections</li>
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>—</span> Built a clean page + navigation</li>
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>—</span> Focused on clarity over flash</li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-6">
              <h3 className="font-medium">If I had more time</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>—</span> More user testing + iteration</li>
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>—</span> Better content hierarchy</li>
                <li className="flex gap-2"><span className="text-gray-400" aria-hidden>—</span> Add metrics + evaluation plan</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-gray-200" />
        </div>
      </section>

      {/* REFLECTION */}
      <section id="reflection" className="bg-gray-50 px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Reflection</h2>
            <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
          </div>

          <div className="mt-8 rounded-2xl border bg-white p-6">
            <p className="text-sm text-gray-600 leading-7">
              This project reminded me that “product work” is usually less about inventing features,
              and more about choosing a small set of good defaults — then making sure the flow stays
              understandable under real constraints.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
              >
                Back to home <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <p className="mt-10 text-xs text-gray-400">
            Built with Next.js + Tailwind • Deployed on Vercel
          </p>
        </div>
      </section>
    </main>
  );
}