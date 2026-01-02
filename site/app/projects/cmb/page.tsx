// /site/app/projects/cmb/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type SolutionId = "rapid-fire" | "question-cards" | "two-truths" | "ai-wingman";

export default function CMBProject() {
  const sections = useMemo(
    () => [
      { id: "top", label: "Top" },
      { id: "pains", label: "Pains" },
      { id: "solution", label: "Solution" },
      { id: "prototype", label: "Prototype" },
      { id: "mvp", label: "MVP" },
    ],
    []
  );

  const [activeId, setActiveId] = useState<string>("top");
  const [progress, setProgress] = useState<number>(0);

  // Tap/click GIF takeover state
  const [openSolution, setOpenSolution] = useState<SolutionId | null>(null);

  // Smooth (ease-in-out) scroll for mini-nav
  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 72; // sticky bar height (approx)
    const targetY = el.getBoundingClientRect().top + window.scrollY - headerOffset;

    const startY = window.scrollY;
    const delta = targetY - startY;

    const distance = Math.abs(delta);
    const duration = Math.min(650, Math.max(240, 240 + distance * 0.18));

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

  // Scroll progress indicator (smooth) + last-tab activation
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
      if (nearBottom) setActiveId("mvp");

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

  // Close GIF overlay on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSolution(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const pains = [
    {
      title: "Users struggle to start conversations",
      bullets: [
        "Leads to ghosting after matching",
        "Awkwardness + first-message fatigue",
        "Drop-offs before a convo even begins",
      ],
    },
    {
      title: "Conversations die quickly (no depth / connection)",
      bullets: [
        "“The convo goes nowhere”",
        "No smooth way to get into deeper topics",
        "Small talk kills momentum",
        "No emotional hook → ghosting after a few messages",
      ],
    },
    {
      title: "Chats feel dry / boring (chemistry doesn’t build)",
      bullets: [
        "No spark → low motivation to continue",
        "Feels too serious or too flat",
        "Hard to show personality in text",
        "Repeating the same questions gets tiring",
      ],
    },
    {
      title: "No shared experiences early on",
      bullets: [
        "Early chats feel transactional",
        "Low emotional investment",
        "No sense of progression / bonding",
        "Easy to ghost because nothing has happened yet",
      ],
    },
  ];

  // GIF sources
  const gifBySolution: Record<SolutionId, { title: string; src: string }> = {
    "ai-wingman": {
      title: 'AI “Wingman” (optional)',
      src: "/projects/cmb/ai%20wingman.gif",
    },
    "rapid-fire": {
      title: "Rapid Fire",
      src: "/projects/cmb/rapid%20fire.gif",
    },
    "question-cards": {
      title: "Question Cards",
      src: "/projects/cmb/question%20cards.gif",
    },
    "two-truths": {
      title: "Two Truths One Lie",
      src: "/projects/cmb/2%20truths%201%20lie.gif",
    },
  };

  return (
    <main className="min-h-screen bg-[#061820] text-white">
      {/* Top glow (subtle) */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-gradient-to-b from-white/[0.08] to-transparent" />

      {/* Sticky Mini-Nav + Progress */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#061820]/70 backdrop-blur">
        {/* progress bar */}
        <div className="h-1 w-full bg-white/5">
          <div
            className="h-1 origin-left bg-white/80"
            style={{ transform: `scaleX(${progress})` }}
            aria-hidden
          />
        </div>

        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 sm:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/75">
              <span className="h-2 w-2 rounded-full bg-pink-400" />
              CMB Concept
            </span>
            <span className="hidden text-white/30 sm:inline">•</span>
            <span className="hidden text-white/60 sm:inline">
              2nd Place — Internal Product Challenge
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
      <section id="top" className="px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          {/* eyebrow */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-pink-400" />
              Team Product Concept
            </span>
            <span className="text-white/30">•</span>
            <span>Dating / Engagement</span>
            <span className="text-white/30">•</span>
            <span>Prototype + slide deck</span>
          </div>

          <div className="mt-8 space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              CMB — Mini-Games to Spark Better Conversations
            </h1>

            <p className="max-w-2xl text-lg text-white/70 leading-7">
              We noticed a simple pattern: people match, then stall. This team concept
              adds playful “shared moments” inside chat so it’s easier to start,
              easier to go deeper, and harder to ghost.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://flirt-spark-play.lovable.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#061820] transition hover:bg-white/90 active:scale-[0.99]"
              >
                Open prototype <span aria-hidden>↗</span>
              </a>

              <a
                href="https://docs.google.com/presentation/d/1a9aTAvQuiCVzzYFhngq9qoo6ErfWe5On/edit?slide=id.p3#slide=id.p3"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white active:scale-[0.99]"
              >
                View slides <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          {/* TL;DR */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xs font-medium uppercase tracking-wide text-white/55">
              TL;DR
            </h2>

            <div className="mt-4 grid gap-6 sm:grid-cols-3">
              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>💬</span>
                  <p className="text-sm font-medium text-white">Problem</p>
                </div>
                <p className="mt-2 text-sm text-white/70 leading-6">
                  Conversations don’t start, don’t go deep, and don’t feel memorable —
                  so ghosting becomes the default.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>🎮</span>
                  <p className="text-sm font-medium text-white">Solution</p>
                </div>
                <p className="mt-2 text-sm text-white/70 leading-6">
                  In-chat mini-games + an AI “wingman” to reduce first-message stress and
                  create early bonding.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span aria-hidden>🏆</span>
                  <p className="text-sm font-medium text-white">Result</p>
                </div>
                <p className="mt-2 text-sm text-white/70 leading-6">
                  Awarded <span className="font-medium text-white">2nd place</span> in the
                  CMB internal product challenge (team submission).
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* PAINS */}
      <section id="pains" className="px-6 sm:px-8 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">The pains we targeted</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <div className="mt-10 grid gap-6">
            {pains.map((p) => (
              <div key={p.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-medium text-white">{p.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-0.5 text-white/35" aria-hidden>
                        —
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution" className="px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Solution concept</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <p className="mt-4 max-w-2xl text-white/70 leading-7">
            The idea is simple: give matches something to do together early.
            These mini-games act like conversation scaffolding — less pressure,
            more personality, and a stronger “we’re building something” feeling.
          </p>

          {/* Tap/click to open GIF */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Rapid Fire */}
            <button
              type="button"
              onClick={() => setOpenSolution("rapid-fire")}
              className={[
                "group text-left rounded-2xl border border-white/10 bg-white/5 p-6",
                "transition duration-200 ease-out will-change-transform",
                "hover:bg-white/[0.08] hover:-translate-y-1 hover:shadow-[0_14px_60px_rgba(0,0,0,0.45)]",
                "active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                openSolution === "rapid-fire" ? "ring-2 ring-white/20" : "",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition group-hover:bg-white/10">
                  <span aria-hidden>🔥</span>
                </div>

                <div>
                  <div className="text-sm font-medium text-white">Rapid Fire</div>
                  <p className="mt-2 text-sm text-white/70 leading-6">
                    Rapid Fire gives users a low-effort, high-energy icebreaker. It’s fun,
                    fast, and builds instant intrigue.
                  </p>

                  <p className="mt-3 inline-flex items-center text-xs font-semibold text-white/65">
                    <span className="relative">
                      Tap to preview
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white/40 transition-all duration-300 group-hover:w-full" />
                    </span>
                    <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </div>
              </div>
            </button>

            {/* Question Cards */}
            <button
              type="button"
              onClick={() => setOpenSolution("question-cards")}
              className={[
                "group text-left rounded-2xl border border-white/10 bg-white/5 p-6",
                "transition duration-200 ease-out will-change-transform",
                "hover:bg-white/[0.08] hover:-translate-y-1 hover:shadow-[0_14px_60px_rgba(0,0,0,0.45)]",
                "active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                openSolution === "question-cards" ? "ring-2 ring-white/20" : "",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition group-hover:bg-white/10">
                  <span aria-hidden>❓</span>
                </div>

                <div>
                  <div className="text-sm font-medium text-white">Question Cards</div>
                  <p className="mt-2 text-sm text-white/70 leading-6">
                    Question Cards help users move past small talk into values, expectations,
                    and mindsets — the stuff that actually predicts compatibility.
                  </p>

                  <p className="mt-3 inline-flex items-center text-xs font-semibold text-white/65">
                    <span className="relative">
                      Tap to preview
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white/40 transition-all duration-300 group-hover:w-full" />
                    </span>
                    <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </div>
              </div>
            </button>

            {/* Two Truths One Lie */}
            <button
              type="button"
              onClick={() => setOpenSolution("two-truths")}
              className={[
                "group text-left rounded-2xl border border-white/10 bg-white/5 p-6",
                "transition duration-200 ease-out will-change-transform",
                "hover:bg-white/[0.08] hover:-translate-y-1 hover:shadow-[0_14px_60px_rgba(0,0,0,0.45)]",
                "active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                openSolution === "two-truths" ? "ring-2 ring-white/20" : "",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition group-hover:bg-white/10">
                  <span aria-hidden>🎭</span>
                </div>

                <div>
                  <div className="text-sm font-medium text-white">Two Truths One Lie</div>
                  <p className="mt-2 text-sm text-white/70 leading-6">
                    Two Truths One Lie adds curiosity and play — it breaks the monotony of
                    “so what do you do?” chat.
                  </p>

                  <p className="mt-3 inline-flex items-center text-xs font-semibold text-white/65">
                    <span className="relative">
                      Tap to preview
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white/40 transition-all duration-300 group-hover:w-full" />
                    </span>
                    <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </div>
              </div>
            </button>

            {/* AI Wingman */}
            <button
              type="button"
              onClick={() => setOpenSolution("ai-wingman")}
              className={[
                "group text-left rounded-2xl border border-white/10 bg-white/5 p-6",
                "transition duration-200 ease-out will-change-transform",
                "hover:bg-white/[0.08] hover:-translate-y-1 hover:shadow-[0_14px_60px_rgba(0,0,0,0.45)]",
                "active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                openSolution === "ai-wingman" ? "ring-2 ring-white/20" : "",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition group-hover:bg-white/10">
                  <span aria-hidden>🤝</span>
                </div>

                <div>
                  <div className="text-sm font-medium text-white">AI “Wingman” (optional)</div>
                  <p className="mt-2 text-sm text-white/70 leading-6">
                    Helps users get unstuck with suggestions, re-phrases, and tone options —
                    so the chat doesn’t die from one awkward pause.
                  </p>

                  <p className="mt-3 inline-flex items-center text-xs font-semibold text-white/65">
                    <span className="relative">
                      Tap to preview
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white/40 transition-all duration-300 group-hover:w-full" />
                    </span>
                    <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* Modal */}
      <div
        className={[
          "fixed inset-0 z-[60] flex items-center justify-center",
          "transition-opacity duration-200",
          openSolution ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!openSolution}
      >
        {/* backdrop */}
        <div className="absolute inset-0 bg-black/70" onClick={() => setOpenSolution(null)} />

        {/* modal box */}
        <div
          className={[
            "relative w-[92vw] sm:w-[70vw] md:w-[52vw] lg:w-[44vw] xl:w-[36vw]",
            "rounded-2xl border border-white/10 bg-[#071a24] shadow-[0_18px_80px_rgba(0,0,0,0.6)]",
            "transition-transform duration-200 ease-out",
            openSolution ? "scale-100 translate-y-0" : "scale-95 translate-y-2",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="text-sm font-medium text-white">
              {openSolution ? gifBySolution[openSolution].title : "Preview"}
            </div>
            <button
              type="button"
              onClick={() => setOpenSolution(null)}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75 hover:bg-white/10 active:scale-[0.98]"
            >
              Close
            </button>
          </div>

          <div className="p-4">
            <div className="mx-auto h-[70vh] w-full">
              {openSolution ? (
                <img
                  src={gifBySolution[openSolution].src}
                  alt={`${gifBySolution[openSolution].title} preview`}
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              ) : null}
            </div>

            <p className="mt-3 text-center text-xs text-white/55">
              Tap outside the box (or press Esc) to close.
            </p>
          </div>
        </div>
      </div>

      {/* PROTOTYPE */}
      <section id="prototype" className="px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Prototype</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <p className="mt-4 max-w-2xl text-white/70 leading-7">
            If the embed doesn’t load (some sites block iframes), use the “Open prototype”
            button at the top.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_14px_60px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span aria-hidden>🖥️</span>
                <span>Lovable prototype</span>
              </div>
              <span className="text-sm text-white/55">Embedded</span>
            </div>

            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://flirt-spark-play.lovable.app/"
                title="CMB mini-games prototype"
                loading="lazy"
                referrerPolicy="no-referrer"
                allow="clipboard-read; clipboard-write; fullscreen"
              />
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-white/10" />
        </div>
      </section>

      {/* MVP */}
      <section id="mvp" className="px-6 sm:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">MVP plan</h2>
            <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium text-white">Why it’s feasible</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/35" aria-hidden>
                    ✓
                  </span>
                  Mostly UI + curated content (prompts, choices, light shared state)
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/35" aria-hidden>
                    ✓
                  </span>
                  Low moderation load if decks are curated
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/35" aria-hidden>
                    ✓
                  </span>
                  Lower risk than complex real-time “games”
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium text-white">Validation approach</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/35" aria-hidden>
                    1
                  </span>
                  Ship 1–2 mini-games + a small starter deck
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/35" aria-hidden>
                    2
                  </span>
                  A/B test: Control (chat) vs Test (chat + games)
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/35" aria-hidden>
                    3
                  </span>
                  Measure: first-message rate, game completion, convo length
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-white/35" aria-hidden>
                    4
                  </span>
                  Expand with themed decks + better “wingman” suggestions
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="https://docs.google.com/presentation/d/1a9aTAvQuiCVzzYFhngq9qoo6ErfWe5On/edit?slide=id.p3#slide=id.p3"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white active:scale-[0.99]"
            >
              See full slide deck <span aria-hidden>↗</span>
            </a>

            {/*  Next project: SMU Food App */}
            <a
              href="/projects/smufoodapp"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#061820] transition hover:bg-white/90 active:scale-[0.99]"
            >
              Next project: SMU Food App <span aria-hidden>→</span>
            </a>
            
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white active:scale-[0.99]"
            >
              Back to home <span aria-hidden>→</span>
            </a>
          </div>

          <p className="mt-10 text-xs text-white/45">
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