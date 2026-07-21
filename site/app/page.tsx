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

type PhotoMoment = {
  src: string;
  alt: string;
  caption: string;
  objectPosition: string;
  liveSrc?: string;
};

type Experience = {
  role: string;
  organisation: string;
  period: string;
  location: string;
  summary: string;
};

const experiences: Experience[] = [
  {
    role: "AI Product Operations Intern",
    organisation: "TigerSec",
    period: "May 2026 — Present",
    location: "Hangzhou",
    summary:
      "Supporting AI agents, product workflows, content operations, and user guidance.",
  },
  {
    role: "Student Assistant",
    organisation: "SMU Academy",
    period: "Jan 2026 — Present",
    location: "Singapore",
    summary:
      "Supporting the delivery of professional learning programmes and learner operations.",
  },
  {
    role: "Trekking President",
    organisation: "SMUXploration Crew",
    period: "Jan 2026 — Present",
    location: "Singapore",
    summary:
      "Revived the club's first overseas expedition in six years, serving as OIC while leading logistics, safety planning, and the student team.",
  },
  {
    role: "Event Executive",
    organisation: "SMU Product Club",
    period: "Jan 2026 — Present",
    location: "Singapore",
    summary:
      "Creating product events that connect students with practitioners and industry teams.",
  },
];

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

const photoMoments: PhotoMoment[] = [
  {
    src: "/me/journey-travel.jpg",
    alt: "Min Xie on a slow train from Pattaya to Bangkok",
    caption:
      "Slow train from Pattaya to Bangkok — one of those quiet travel days where nothing happened, but a lot clicked.",
    objectPosition: "center center",
    liveSrc: "/me/journey-travel-live.mp4",
  },
  {
    src: "/me/journey-product.jpg",
    alt: "Min Xie presenting an early product pitch",
    caption: "One of my first product pitches — nervous, curious, and learning fast.",
    objectPosition: "center 24%",
  },
  {
    src: "/me/journey-rinjani.jpg",
    alt: "Coming down from Mount Rinjani",
    caption:
      "Coming down from Rinjani — the part nobody posts, but probably the part I remember most.",
    objectPosition: "center 68%",
    liveSrc: "/me/journey-rinjani-live.mp4",
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

function useIsTouchMobile() {
  const [isTouchMobile, setIsTouchMobile] = useState(false);

  useEffect(() => {
    const queries = [window.matchMedia("(max-width: 767px)"), window.matchMedia("(pointer: coarse)")];
    const update = () => setIsTouchMobile(queries.some((query) => query.matches));

    update();
    queries.forEach((query) => query.addEventListener?.("change", update));

    return () => {
      queries.forEach((query) => query.removeEventListener?.("change", update));
    };
  }, []);

  return isTouchMobile;
}

export default function Home() {
  const photoRef = useRef<HTMLDivElement | null>(null);
  const aboutJournalRef = useRef<HTMLDivElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [mountainProgressRaw, setMountainProgressRaw] = useState(0);
  const [aboutJournalProgress, setAboutJournalProgress] = useState(0);
  const [isExperienceVisible, setIsExperienceVisible] = useState(false);
  const [activeExperienceIndex, setActiveExperienceIndex] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [photoCycleProgress, setPhotoCycleProgress] = useState(1);
  const [isPhotoPreviewing, setIsPhotoPreviewing] = useState(false);
  const [isMobileMediaVisible, setIsMobileMediaVisible] = useState(false);
  const [activeFieldNote, setActiveFieldNote] = useState<string | null>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const activePhoto = photoMoments[activePhotoIndex];
  const stackedPhotos = [1, 2].map((offset) => photoMoments[(activePhotoIndex + offset) % photoMoments.length]);
  const projectDeck = projects.map((project, index) => ({
    ...project,
    number: `0${index + 1}`,
    line:
      index === 0
        ? "Exact-amount voucher payments for clearer checkout decisions."
        : index === 1
          ? "A dating flow concept shaped around clarity and trust."
          : "Campus food ordering flows built around everyday constraints.",
    type:
      index === 0
        ? "Payment UX"
        : index === 1
          ? "Product concept"
          : "Campus systems",
  }));

  const stopPhotoPreview = () => {
    setIsPhotoPreviewing(false);
    const video = activeVideoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const startPhotoPreview = () => {
    if (prefersReducedMotion) return;
    setIsPhotoPreviewing(true);

    if (activePhoto.liveSrc) {
      void activeVideoRef.current?.play().catch(() => {
        setIsPhotoPreviewing(false);
      });
    }
  };

  const showNextPhoto = () => {
    stopPhotoPreview();
    setPhotoCycleProgress(0);
    setActivePhotoIndex((index) => (index + 1) % photoMoments.length);
  };

  const handlePhotoAction = () => {
    if (isTouchMobile && activePhoto.liveSrc && !isPhotoPreviewing) {
      startPhotoPreview();
      return;
    }

    showNextPhoto();
  };

  // --- language rotate (small, tasteful) ---
  const prefersReducedMotion = usePrefersReducedMotion();
  const isTouchMobile = useIsTouchMobile();
  const languageLines = useMemo(
    () => [
      {
        lang: "EN",
        text: "Exploring people and places, then turning ideas into clearer decisions.",
      },
      { lang: "中文", text: "探索不同的人与地方，再把想法整理成更清晰的决定。" },
      { lang: "廣東話", text: "探索唔同嘅人同地方，再將諗法整理成更清晰嘅決定。" },
      {
        lang: "DE",
        text: "Menschen und Orte erkunden, dann Ideen in klarere Entscheidungen verwandeln.",
      },
      {
        lang: "ES",
        text: "Explorar personas y lugares, y convertir ideas en decisiones más claras.",
      },
      {
        lang: "MY",
        text: "Meneroka orang dan tempat, kemudian menukar idea kepada keputusan yang lebih jelas.",
      },
    ],
    []
  );
  const [langIndex, setLangIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const t = window.setInterval(() => {
      setLangIndex((i) => (i + 1) % languageLines.length);
    }, 2200);
    return () => window.clearInterval(t);
  }, [prefersReducedMotion, languageLines.length]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsExperienceVisible(true);
      return;
    }

    const section = experienceRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsExperienceVisible(true);
        observer.disconnect();
      },
      { threshold: 0.18 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhotoCycleProgress(1);
      return;
    }

    const t = window.setTimeout(() => setPhotoCycleProgress(1), 40);
    return () => window.clearTimeout(t);
  }, [activePhotoIndex, prefersReducedMotion]);

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
      setAboutJournalProgress(1);
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

      const journalEl = aboutJournalRef.current;
      let journalP = 0;
      if (journalEl) {
        const rect = journalEl.getBoundingClientRect();
        const start = window.innerHeight * 0.82;
        const end = window.innerHeight * 0.34;
        journalP = clamp((start - rect.top) / Math.max(start - end, 1));
      }

      setProgress(p);
      setMountainProgressRaw(mountainP);
      setAboutJournalProgress(journalP);
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

  useEffect(() => {
    if (!isTouchMobile || prefersReducedMotion) {
      setIsMobileMediaVisible(false);
      return;
    }

    const el = aboutJournalRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsMobileMediaVisible(true);
      },
      { root: null, threshold: 0.18, rootMargin: "0px 0px -12% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isTouchMobile, prefersReducedMotion]);

  // smoothstep easing
  const roll = prefersReducedMotion ? 1 : progress;
  const eased = roll * roll * (3 - 2 * roll);

  // Mobile keeps the media block at real height, then fades it in once the section enters view.
  // Desktop keeps the original hero-scroll page-roll reveal unchanged.
  const mobileMediaReveal = isMobileMediaVisible ? 1 : 0;
  const mediaReveal = prefersReducedMotion ? 1 : isTouchMobile ? mobileMediaReveal : eased;

  // “page” transform (soften + less rigid)
  const rotateX = -86 * (1 - mediaReveal); // deg
  const rotateZ = -1.2 * (1 - mediaReveal); // tiny twist
  const translateY = 22 * (1 - mediaReveal); // px
  const scaleY = 0.92 + 0.08 * mediaReveal; // starts slightly compressed
  const blur = 0.9 * (1 - mediaReveal);
  const shadowA = 0.34 * (1 - mediaReveal);

  const photoRollStyle: React.CSSProperties = {
    opacity: mediaReveal,
    transform: `perspective(1100px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) translateY(${translateY}px) scaleY(${scaleY})`,
    transformOrigin: "top center",
    filter: `blur(${blur}px)`,
    boxShadow: `0 30px 110px rgba(0,0,0,${shadowA})`,
    transition: prefersReducedMotion
      ? "none"
      : isTouchMobile
        ? "opacity 520ms ease-out, transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1), filter 520ms ease-out"
        : "transform 220ms cubic-bezier(0.2, 0.9, 0.2, 1), opacity 180ms ease-out, filter 220ms ease-out, box-shadow 220ms ease-out",
    willChange: prefersReducedMotion ? "auto" : "transform, opacity, filter",
    backfaceVisibility: "hidden",
  };

  // Keep this var name if referenced elsewhere
  const photoOpacity = mediaReveal;

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

  const photoRevealHeight = photoBlockH ? photoBlockH * mediaReveal : 0;
  const photoRevealContainerStyle: React.CSSProperties = isTouchMobile
    ? {
        height: "auto",
        overflow: "hidden",
      }
    : {
        height: photoRevealHeight,
        overflow: "hidden",
        transition: prefersReducedMotion ? "none" : "height 560ms cubic-bezier(0.2, 0.92, 0.2, 1)",
        willChange: "height",
      };

  const scrollCueProgress = prefersReducedMotion ? 0 : clamp(progress / 0.42);
  const scrollCueFade = scrollCueProgress * scrollCueProgress * (3 - 2 * scrollCueProgress);
  const scrollCueStyle: React.CSSProperties = {
    opacity: 1 - scrollCueFade,
    transform: `translate3d(-50%, ${scrollCueFade * 8}px, 0)`,
    transition: prefersReducedMotion
      ? "none"
      : "opacity 220ms ease-out, transform 220ms ease-out",
  };

  const heroWordRevealRaw = prefersReducedMotion ? 0 : clamp((progress - 0.12) / 0.3);
  const heroWordReveal = heroWordRevealRaw * heroWordRevealRaw * (3 - 2 * heroWordRevealRaw);
  const heroWordFromStyle: React.CSSProperties = {
    opacity: 1 - heroWordReveal,
    transform: prefersReducedMotion ? "none" : `translate3d(0, ${heroWordReveal * -9}px, 0)`,
    filter: prefersReducedMotion ? "none" : `blur(${heroWordReveal * 1}px)`,
    transition: prefersReducedMotion
      ? "none"
      : "opacity 180ms ease-out, transform 220ms ease-out, filter 220ms ease-out",
  };
  const heroWordToStyle: React.CSSProperties = {
    opacity: heroWordReveal,
    transform: prefersReducedMotion ? "none" : `translate3d(0, ${(1 - heroWordReveal) * 9}px, 0)`,
    filter: prefersReducedMotion ? "none" : `blur(${(1 - heroWordReveal) * 1}px)`,
    textShadow: "0 0 16px rgba(159, 231, 191, 0.32), 0 0 34px rgba(159, 231, 191, 0.12)",
    transition: prefersReducedMotion
      ? "none"
      : "opacity 180ms ease-out, transform 220ms ease-out, filter 220ms ease-out",
  };
  const heroIdentityStyle: React.CSSProperties = {
    opacity: 0.55 - heroWordReveal * 0.08,
    transform: prefersReducedMotion ? "none" : `translate3d(0, ${heroWordReveal * 4}px, 0)`,
    transition: prefersReducedMotion ? "none" : "opacity 220ms ease-out, transform 220ms ease-out",
  };

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

  const journalReveal = prefersReducedMotion
    ? 1
    : isTouchMobile
      ? mobileMediaReveal
      : aboutJournalProgress * aboutJournalProgress * (3 - 2 * aboutJournalProgress);
  const aboutTextRevealRaw = prefersReducedMotion
    ? 1
    : isTouchMobile
      ? mobileMediaReveal
      : clamp((aboutJournalProgress - 0.12) / 0.88);
  const aboutTextReveal = aboutTextRevealRaw * aboutTextRevealRaw * (3 - 2 * aboutTextRevealRaw);
  const photoCardStyle: React.CSSProperties = {
    opacity: 0.7 + journalReveal * 0.3,
    transform: `translate3d(${(1 - journalReveal) * -10}px, ${(1 - journalReveal) * 26}px, 0) scale(${0.94 + journalReveal * 0.06}) rotate(${(1 - journalReveal) * -1.2}deg)`,
    transition: prefersReducedMotion || isTouchMobile
      ? "none"
      : "transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1), opacity 420ms ease-out",
    willChange: prefersReducedMotion || isTouchMobile ? "auto" : "transform, opacity",
  };
  const photoStackBackStyle: React.CSSProperties = {
    opacity: 0.12 + journalReveal * 0.08,
    transform: `translate3d(${4 + journalReveal * 4}px, ${2 - journalReveal * 6}px, 0) rotate(${0.8 + journalReveal * 0.8}deg) scale(${0.965 + journalReveal * 0.012})`,
    transition: prefersReducedMotion ? "none" : "transform 560ms ease-out, opacity 460ms ease-out",
  };
  const photoStackMidStyle: React.CSSProperties = {
    opacity: 0.13 + journalReveal * 0.09,
    transform: `translate3d(${-3 - journalReveal * 5}px, ${4 + journalReveal * 5}px, 0) rotate(${-0.7 - journalReveal * 0.9}deg) scale(${0.97 + journalReveal * 0.012})`,
    transition: prefersReducedMotion ? "none" : "transform 560ms ease-out, opacity 460ms ease-out",
  };
  const isLivePreviewActive = isPhotoPreviewing && Boolean(activePhoto.liveSrc);
  const isStillPreviewActive = isPhotoPreviewing && !activePhoto.liveSrc;
  const activePhotoImageStyle: React.CSSProperties = {
    opacity: (0.72 + photoCycleProgress * 0.28) * (isLivePreviewActive ? 0.16 : 1),
    transform: `translate3d(${isStillPreviewActive ? "8px" : "0px"}, ${isStillPreviewActive ? "-6px" : "0px"}, 0) scale(${1.015 - photoCycleProgress * 0.015 + (isStillPreviewActive ? 0.06 : 0)})`,
    transition: prefersReducedMotion ? "none" : "opacity 260ms ease-out, transform 320ms ease-out",
  };
  const activeVideoStyle: React.CSSProperties = {
    opacity: isLivePreviewActive ? 1 : 0,
    objectPosition: activePhoto.objectPosition,
    transition: prefersReducedMotion ? "none" : "opacity 260ms ease-out",
  };
  const aboutNoteStyle: React.CSSProperties = {
    opacity: 0.2 + aboutTextReveal * 0.8,
    transform: `translate3d(${(1 - aboutTextReveal) * 18}px, ${(1 - aboutTextReveal) * 18}px, 0)`,
    transition: prefersReducedMotion
      ? "none"
      : "transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1), opacity 420ms ease-out",
    willChange: prefersReducedMotion ? "auto" : "transform, opacity",
  };

  // --- Ultra-subtle desktop pointer atmosphere ---
  const glowRef = useRef<HTMLDivElement | null>(null);
  const pointerTraceRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const el = glowRef.current;
    const canvas = pointerTraceRef.current;
    if (!el || !canvas) return;

    const canUsePointerTrace =
      window.matchMedia("(hover: hover)").matches && window.matchMedia("(pointer: fine)").matches;
    if (!canUsePointerTrace) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type TracePoint = { x: number; y: number; life: number };

    let raf = 0;
    let fadeTimer = 0;
    let isMoving = false;
    let points: TracePoint[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      points = points
        .map((point) => ({ ...point, life: point.life - 0.045 }))
        .filter((point) => point.life > 0);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = 1; i < points.length - 1; i += 1) {
        const from = points[i - 1];
        const current = points[i];
        const to = points[i + 1];
        const progressThroughTrail = i / Math.max(points.length - 1, 1);
        const alpha = Math.min(from.life, current.life, to.life) * (0.07 + progressThroughTrail * 0.11);
        const endX = (current.x + to.x) / 2;
        const endY = (current.y + to.y) / 2;

        ctx.beginPath();
        ctx.moveTo((from.x + current.x) / 2, (from.y + current.y) / 2);
        ctx.quadraticCurveTo(current.x, current.y, endX, endY);
        ctx.lineWidth = 0.55 + progressThroughTrail * 1.85;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = `rgba(226, 255, 241, ${alpha})`;
        ctx.shadowBlur = 22;
        ctx.shadowColor = "rgba(184, 255, 218, 0.16)";
        ctx.stroke();
      }

      const latest = points[points.length - 1];
      if (latest) {
        const glow = ctx.createRadialGradient(latest.x, latest.y, 0, latest.x, latest.y, 28);
        glow.addColorStop(0, `rgba(242, 255, 249, ${latest.life * 0.12})`);
        glow.addColorStop(0.42, `rgba(178, 255, 218, ${latest.life * 0.06})`);
        glow.addColorStop(1, "rgba(178, 255, 218, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(latest.x, latest.y, 28, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      if (isMoving || points.length > 0) {
        raf = window.requestAnimationFrame(draw);
      } else {
        raf = 0;
      }
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;

      el.style.setProperty("--x", `${e.clientX}px`);
      el.style.setProperty("--y", `${e.clientY}px`);
      el.style.setProperty("--o", "1");

      const last = points[points.length - 1];
      if (!last || Math.hypot(e.clientX - last.x, e.clientY - last.y) > 2) {
        points.push({ x: e.clientX, y: e.clientY, life: 1 });
      }
      points = points.slice(-22);
      isMoving = true;

      window.clearTimeout(fadeTimer);
      fadeTimer = window.setTimeout(() => {
        isMoving = false;
        el.style.setProperty("--o", "0");
      }, 110);

      if (!raf) raf = window.requestAnimationFrame(draw);
    };

    const leave = () => {
      isMoving = false;
      points = [];
      el.style.setProperty("--o", "0");
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const onDocumentMouseOut = (e: MouseEvent) => {
      if (!(e.relatedTarget as Node | null)) leave();
    };

    resize();
    el.style.setProperty("--o", "0");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("blur", leave);
    document.addEventListener("mouseout", onDocumentMouseOut);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", leave);
      document.removeEventListener("mouseout", onDocumentMouseOut);
      window.clearTimeout(fadeTimer);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  return (
    <main className="min-h-screen bg-[#061820] text-white">
      {/* ultra-subtle desktop pointer atmosphere */}
      <canvas
        ref={pointerTraceRef}
        className="pointer-events-none fixed inset-0 z-[70] hidden sm:block"
        aria-hidden
      />
      <div
        ref={glowRef}
        className="pointer-events-none fixed inset-0 z-[69] hidden sm:block"
        style={{
          opacity: "var(--o, 0)",
          transition: "opacity 280ms ease-out",
          background:
            "radial-gradient(520px circle at var(--x, 50%) var(--y, 30%), rgba(205,255,229,0.032), transparent 68%)",
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
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-80 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.045),transparent_68%)]" aria-hidden />

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/75 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
              <span aria-hidden>🇸🇬</span>
              <span>Hello, I’m Min Xie!</span>
            </p>

            <div className="mt-8 sm:mt-10">
              <h1 className="mx-auto max-w-[22rem] text-[2.28rem] font-semibold leading-[1.12] tracking-tight text-white sm:max-w-4xl sm:text-6xl sm:leading-[1.08] lg:text-[4.6rem] lg:leading-[1.02]">
                Curious enough to{" "}
                <span className="relative inline-block w-[3.25em] align-baseline sm:w-[3.18em]">
                  <span className="inline-block" style={heroWordFromStyle}>
                    explore.
                  </span>
                  <span
                    className="absolute left-0 top-0 inline-block text-[#9fe7bf]"
                    style={heroWordToStyle}
                    aria-hidden
                  >
                    try.
                  </span>
                </span>
                <br />
                Practical enough to{" "}
                <span className="relative inline-block w-[3.68em] align-baseline sm:w-[3.58em]">
                  <span className="inline-block" style={heroWordFromStyle}>
                    build.
                  </span>
                  <span
                    className="absolute left-0 top-0 inline-block text-[#9fe7bf]"
                    style={heroWordToStyle}
                    aria-hidden
                  >
                    progress.
                  </span>
                </span>
              </h1>

              <p
                className="mx-auto mt-9 max-w-2xl text-xs uppercase leading-6 tracking-[0.18em] text-white sm:mt-10 sm:text-sm sm:tracking-[0.22em]"
                style={heroIdentityStyle}
              >
                SMU Information Systems · Product · Tech · Languages · Mountains · Backpacking
              </p>
            </div>

            <div className="mt-14 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-white/12 to-transparent sm:mt-20" />
          </div>

          <div
            className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/35 sm:bottom-8"
            style={scrollCueStyle}
            aria-hidden
          >
            <span>Scroll to explore</span>
            <span className="h-8 w-px bg-gradient-to-b from-white/35 to-transparent" aria-hidden />
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

          <p className="mt-3 text-center text-xs text-white/45">
            People, places, and the languages between them.
          </p>

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

          <div
            ref={aboutJournalRef}
            className="relative mt-6 grid gap-7 rounded-[2rem] border border-white/10 bg-white/[0.025] p-3 shadow-[0_22px_90px_rgba(0,0,0,0.22)] sm:mt-14 lg:grid-cols-12 lg:items-start lg:p-4"
          >
            {/* Visual card */}
            <div className="relative flex px-2 py-3 sm:px-3 sm:py-4 lg:col-span-7 lg:self-start" style={photoCardStyle}>
              <div
                className="pointer-events-none absolute inset-3 overflow-hidden rounded-[1.55rem] border border-white/10 bg-white/[0.03]"
                style={photoStackBackStyle}
                title={stackedPhotos[1].caption}
                aria-hidden
              >
                <Image
                  src={stackedPhotos[1].src}
                  alt=""
                  fill
                  className="object-cover opacity-58 saturate-[0.65] blur-[0.45px]"
                  style={{ objectPosition: stackedPhotos[1].objectPosition }}
                />
                <div className="absolute inset-0 bg-[#061820]/58" />
              </div>
              <div
                className="pointer-events-none absolute inset-2.5 overflow-hidden rounded-[1.55rem] border border-white/10 bg-white/[0.035]"
                style={photoStackMidStyle}
                title={stackedPhotos[0].caption}
                aria-hidden
              >
                <Image
                  src={stackedPhotos[0].src}
                  alt=""
                  fill
                  className="object-cover opacity-62 saturate-[0.7] blur-[0.35px]"
                  style={{ objectPosition: stackedPhotos[0].objectPosition }}
                />
                <div className="absolute inset-0 bg-[#061820]/54" />
              </div>
              <button
                type="button"
                onClick={handlePhotoAction}
                onMouseEnter={isTouchMobile ? undefined : startPhotoPreview}
                onMouseLeave={isTouchMobile ? undefined : stopPhotoPreview}
                onFocus={isTouchMobile ? undefined : startPhotoPreview}
                onBlur={isTouchMobile ? undefined : stopPhotoPreview}
                className="group relative flex min-h-[25rem] w-full flex-col rounded-[1.45rem] border border-white/10 bg-white/[0.045] p-3 text-left shadow-[0_22px_70px_rgba(0,0,0,0.28)] transition hover:border-white/18 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:min-h-[24.5rem] lg:min-h-0 lg:p-4"
                aria-label="Show next photo moment"
              >
              {/* Animated image reveal */}
              <div
                style={photoRevealContainerStyle}
                aria-hidden={photoOpacity === 0}
              >
                {/* Actual image area measured at full size */}
                <div ref={photoBlockInnerRef} className="h-[20.5rem] sm:h-[20rem] lg:h-[20.75rem]">
                  <div
                    ref={photoRef}
                    className="relative h-full w-full overflow-hidden rounded-3xl"
                    style={photoRollStyle}
                  >
                    {/* “rolled edge” overlay for extra 3D depth */}
                    <div
                      className="roll-edge pointer-events-none absolute inset-x-0 top-0"
                      style={{
                        height: `${Math.max(0, 46 * (1 - mediaReveal))}px`,
                        opacity: Math.max(0, 1 - mediaReveal),
                        transform: `perspective(900px) rotateX(${92 - 92 * mediaReveal}deg) translateY(${
                          -10 * (1 - mediaReveal)
                        }px)`,
                        transformOrigin: "top center",
                      }}
                      aria-hidden
                    />

                    {/* subtle “passport paper” texture overlay */}
                    <div className="paper-texture pointer-events-none absolute inset-0" />

                    <Image
                      key={activePhoto.src}
                      src={activePhoto.src}
                      alt={activePhoto.alt}
                      fill
                      priority
                      className="object-cover"
                      style={{ ...activePhotoImageStyle, objectPosition: activePhoto.objectPosition }}
                    />

                    {activePhoto.liveSrc ? (
                      <video
                        key={activePhoto.liveSrc}
                        ref={activeVideoRef}
                        src={activePhoto.liveSrc}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                        style={activeVideoStyle}
                        aria-hidden
                      />
                    ) : null}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
                  </div>
                </div>
              </div>

              {/* Caption footer */}
              <div className="mt-2.5 flex shrink-0 flex-col gap-1.5 rounded-b-[1.1rem] bg-[#061820]/20 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <p className="min-w-0 max-w-[32rem] text-[0.72rem] italic leading-[1.48] text-white/52 sm:flex-1 sm:text-xs">
                  {activePhoto.caption}
                </p>
                <span
                  className={[
                    "inline-flex shrink-0 items-center self-start rounded-full border border-white/12 bg-white/[0.055] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/58 shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition group-hover:border-white/20 group-hover:bg-white/[0.08] group-hover:text-white/75",
                    prefersReducedMotion ? "" : "photo-cue-attention",
                  ].join(" ")}
                >
                  3 moments · tap to explore
                </span>
              </div>
            </button>
            </div>

            {/* Text note */}
            <div
              className="flex h-[24.75rem] self-center rounded-[1.55rem] border border-white/[0.08] bg-white/[0.032] p-3.5 shadow-[0_18px_52px_rgba(0,0,0,0.14)] sm:h-[24.5rem] sm:p-4 lg:col-span-5 lg:mt-4 lg:h-[25rem] lg:self-start lg:p-4 xl:p-5"
              style={aboutNoteStyle}
            >
              <div className="flex h-full w-full max-w-[29rem] flex-col">
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-2.5">
                  <p className="text-[0.62rem] font-semibold uppercase leading-none tracking-[0.26em] text-white/38">
                    FIELD NOTE 01
                  </p>
                  <span className="h-1.5 w-1.5 rounded-full bg-white/30" aria-hidden />
                </div>

                <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2">
                  {[
                    {
                      index: "01",
                      title: "Explore",
                      accent: "↗",
                      text: "Following curiosity through places, languages, and unfamiliar paths.",
                      detail:
                        "I follow curiosity through unfamiliar places, languages, and paths because they help me see problems from more than one angle.",
                    },
                    {
                      index: "02",
                      title: "Connect",
                      accent: "⟡",
                      text: "Understanding people, context, and the small details behind decisions.",
                      detail:
                        "I pay attention to how people behave in real contexts — what they say, what they skip, and what actually shapes their decisions.",
                    },
                    {
                      index: "03",
                      title: "Build",
                      accent: "→",
                      text: "Turning observations into clearer product decisions and practical solutions.",
                      detail:
                        "I like turning those observations into clearer product decisions, practical flows, and solutions that feel usable in real life.",
                    },
                  ].map((item) => {
                    const currentFieldNote = activeFieldNote ?? "Explore";
                    const isActive = currentFieldNote === item.title;

                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => setActiveFieldNote(item.title)}
                        onMouseEnter={() => setActiveFieldNote(item.title)}
                        onFocus={() => setActiveFieldNote(item.title)}
                        className={[
                          "group block w-full rounded-2xl border px-4 text-left outline-none sm:px-5",
                          prefersReducedMotion
                            ? "transition-none"
                            : "transition-[flex,background-color,border-color,opacity,padding,box-shadow] duration-300 ease-out",
                          isActive
                            ? "flex-[1_1_auto] border-white/[0.14] bg-white/[0.052] py-3.5 shadow-[0_14px_42px_rgba(0,0,0,0.13)]"
                            : "flex-[0_0_3.45rem] border-white/[0.075] bg-white/[0.028] py-2.5 opacity-68 sm:flex-[0_0_3.35rem]",
                          "hover:border-white/[0.12] hover:bg-white/[0.045] focus-visible:ring-2 focus-visible:ring-white/24",
                        ].join(" ")}
                        aria-expanded={isActive}
                      >
                        <div className="flex h-full items-start gap-3.5 overflow-hidden">
                          <span className="mt-1 text-[0.62rem] font-semibold leading-none tracking-[0.18em] text-white/30">
                            {item.index}
                          </span>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-[1.05rem] font-semibold leading-none tracking-[-0.025em] text-white/90 sm:text-[1.12rem]">
                                {item.title}
                              </h3>
                              <span
                                className={[
                                  "text-[0.72rem] leading-none text-white/34",
                                  prefersReducedMotion ? "transition-none" : "transition-opacity duration-300 ease-out",
                                  isActive ? "opacity-100" : "opacity-45",
                                ].join(" ")}
                                aria-hidden
                              >
                                {item.accent}
                              </span>
                            </div>
                            <div
                              className={[
                                "grid overflow-hidden",
                                prefersReducedMotion
                                  ? "transition-none"
                                  : "transition-[grid-template-rows,opacity,margin-top] duration-300 ease-out",
                                isActive ? "mt-2 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
                              ].join(" ")}
                            >
                              <p className="min-h-0 max-w-[22rem] overflow-hidden text-[0.82rem] leading-[1.52] text-white/58 sm:text-[0.88rem]">
                                {item.text}
                              </p>
                            </div>
                            <div
                              className={[
                                "grid overflow-hidden",
                                prefersReducedMotion
                                  ? "transition-none"
                                  : "transition-[grid-template-rows,opacity,margin-top] duration-300 ease-out",
                                isActive ? "mt-2.5 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
                              ].join(" ")}
                            >
                              <p className="min-h-0 max-w-[22.5rem] overflow-hidden border-t border-white/[0.08] pt-2.5 text-[0.78rem] leading-[1.54] text-white/66 sm:text-[0.84rem]">
                                {item.detail}
                              </p>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Divider BELOW About */}
          <div className="mt-18 h-px w-full bg-white/10" />
        </div>
        </section>
      </div>

      {/* EXPERIENCE */}
      <section
        ref={experienceRef}
        aria-labelledby="experience-heading"
        className="overflow-hidden px-6 py-14 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="border-b border-white/10 pb-8">
            <h2
              id="experience-heading"
              className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl"
            >
              Experience
            </h2>
          </div>

          <ol className="mt-8 sm:mt-10">
            {experiences.map((experience, index) => {
              const isActive = activeExperienceIndex === index;
              const detailsId = `experience-details-${index}`;

              return (
                <li
                  key={`${experience.organisation}-${experience.role}`}
                  className="pb-6 last:pb-0 sm:pb-7"
                  style={{
                    opacity: isExperienceVisible ? 1 : 0,
                    transform: `translate3d(0, ${isExperienceVisible ? 0 : 18}px, 0)`,
                    transition: prefersReducedMotion
                      ? "none"
                      : `opacity 520ms ease-out ${index * 90}ms, transform 560ms cubic-bezier(0.2, 0.9, 0.2, 1) ${index * 90}ms`,
                  }}
                >
                  <button
                    type="button"
                    data-experience-index={index}
                    aria-expanded={isActive}
                    aria-controls={detailsId}
                    className="group grid w-full grid-cols-[1.25rem_minmax(0,1fr)] gap-x-4 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[#9fe7bf]/40 focus-visible:ring-offset-4 focus-visible:ring-offset-[#061820] sm:grid-cols-[10rem_1.5rem_minmax(0,1fr)] sm:gap-x-6"
                    onClick={() => {
                      if (!isTouchMobile) return;
                      setActiveExperienceIndex((current) => (current === index ? null : index));
                    }}
                    onMouseEnter={() => {
                      if (!isTouchMobile) setActiveExperienceIndex(index);
                    }}
                    onMouseLeave={() => {
                      if (!isTouchMobile) {
                        const focusedIndex =
                          document.activeElement instanceof HTMLElement
                            ? document.activeElement.dataset.experienceIndex
                            : undefined;

                        setActiveExperienceIndex(
                          focusedIndex === undefined ? null : Number(focusedIndex),
                        );
                      }
                    }}
                    onFocus={() => {
                      if (!isTouchMobile) setActiveExperienceIndex(index);
                    }}
                    onBlur={() => {
                      setActiveExperienceIndex((current) => (current === index ? null : current));
                    }}
                  >
                    <div className="col-start-2 row-start-1 mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/38 sm:col-start-1 sm:mb-0 sm:pt-0.5 sm:text-right">
                      {experience.period}
                    </div>

                    <div
                      className="relative col-start-1 row-span-2 row-start-1 flex justify-center sm:col-start-2"
                      aria-hidden
                    >
                      {index < experiences.length - 1 ? (
                        <span
                          className="absolute left-1/2 top-3 h-[calc(100%+1.5rem)] w-px origin-top -translate-x-1/2 bg-gradient-to-b from-[#9fe7bf]/45 via-white/14 to-white/5 sm:h-[calc(100%+1.75rem)]"
                          style={{
                            transform: `translateX(-50%) scaleY(${isExperienceVisible ? 1 : 0})`,
                            transition: prefersReducedMotion
                              ? "none"
                              : `transform 620ms ease-out ${120 + index * 90}ms`,
                          }}
                        />
                      ) : null}
                      <span
                        className={`relative z-10 mt-1 h-3 w-3 rounded-full border border-[#9fe7bf]/65 bg-[#061820] shadow-[0_0_0_5px_rgba(159,231,191,0.06),0_0_22px_rgba(159,231,191,0.18)] group-hover:scale-110 group-focus-visible:scale-110 ${
                          prefersReducedMotion ? "" : "transition-transform duration-200"
                        }`}
                      />
                    </div>

                    <div className="col-start-2 row-start-2 min-w-0 sm:col-start-3 sm:row-start-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fe7bf]/66">
                        {experience.organisation}
                      </p>
                      <h3 className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-white/92 sm:text-xl">
                        {experience.role}
                      </h3>
                      <div
                        id={detailsId}
                        aria-hidden={!isActive}
                        className={`grid overflow-hidden ${
                          isActive ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
                        }`}
                        style={{
                          transition: prefersReducedMotion
                            ? "none"
                            : "grid-template-rows 260ms ease, opacity 220ms ease, margin-top 260ms ease",
                        }}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/38">
                            {experience.location}
                          </p>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/58 sm:text-[0.95rem] sm:leading-7">
                            {experience.summary}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-14 h-px w-full bg-white/10 sm:mt-20" />
        </div>
      </section>

      {/* PROJECTS */}
      <section className="overflow-x-hidden px-6 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/38">
                Selected work
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Product case gallery
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/58">
              A horizontal rail of product cases — swipe or scroll to explore.
            </p>
          </div>

          <div className="project-gallery-rail relative mt-3 -mx-6 overflow-x-auto overflow-y-visible overscroll-x-contain scroll-smooth px-6 pb-7 pt-7 sm:-mx-8 sm:px-8">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-20 bg-gradient-to-r from-[#061820] to-transparent lg:block" aria-hidden />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-20 bg-gradient-to-l from-[#061820] to-transparent lg:block" aria-hidden />
            <div className="project-gallery-track flex w-max snap-x snap-mandatory gap-4 sm:gap-5">
              {projectDeck.map((project) => (
                  <Link
                    key={project.href}
                    href={project.href}
                    className="group relative flex min-h-[20rem] w-[18.5rem] shrink-0 snap-start scroll-ml-6 flex-col overflow-hidden rounded-[1.65rem] border border-white/[0.09] bg-[#0b2028]/88 p-5 text-left shadow-[0_24px_70px_rgba(0,0,0,0.28)] outline-none backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:rotate-[-0.8deg] hover:border-white/18 hover:bg-[#0d2630]/94 hover:shadow-[0_30px_90px_rgba(0,0,0,0.36)] focus-visible:-translate-y-1 focus-visible:border-white/22 focus-visible:ring-2 focus-visible:ring-white/28 sm:w-[22rem] sm:p-6 lg:w-[24rem]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(159,231,191,0.1),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_44%)]" aria-hidden />
                    <svg
                      className="pointer-events-none absolute bottom-0 right-0 h-40 w-full text-white opacity-[0.08] transition duration-300 group-hover:opacity-[0.13]"
                      viewBox="0 0 520 180"
                      fill="none"
                      aria-hidden
                    >
                      <path d="M18 132 C92 104 132 112 188 76 C246 38 284 74 326 60 C374 44 410 30 500 40" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M92 140 L160 92 L220 136 L284 72 L352 142 L418 92" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <div className="relative flex items-start justify-between gap-4">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/40">
                        Case {project.number}
                      </p>
                      <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-white/52">
                        {project.type}
                      </span>
                    </div>

                    <h3 className="relative mt-9 max-w-[18rem] text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[1.9rem] sm:leading-[1.05]">
                      {project.title}
                    </h3>

                    <p className="relative mt-4 max-w-[20rem] text-sm leading-6 text-white/62">
                      {project.line}
                    </p>

                    <div className="relative mt-auto flex items-end justify-between gap-4 pt-8">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/34">
                        {project.subtitle}
                      </span>
                      <span className="shrink-0 translate-y-0 rounded-full border border-white/14 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/68 opacity-100 transition duration-300 sm:translate-y-1 sm:border-transparent sm:bg-transparent sm:text-white/0 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:border-white/14 sm:group-hover:bg-white/[0.06] sm:group-hover:text-white/78 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:border-white/14 sm:group-focus-visible:bg-white/[0.06] sm:group-focus-visible:text-white/78 sm:group-focus-visible:opacity-100">
                        View case study
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-6 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="h-px w-full bg-white/10 mb-10" />

          <h2 className="text-2xl sm:text-3xl font-semibold text-white">Let’s connect!</h2>

          <p className="mt-3 max-w-2xl text-white/70 leading-7">
            If you’d like to chat about product, projects, travel stories, or just say hi, feel free
            to reach out :&quot;)
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
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Min Xie</p>
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

        .photo-cue-attention {
          animation: photo-cue-attention 4.8s ease-in-out 1.2s infinite;
          transform-origin: center;
          will-change: transform;
        }

        @keyframes photo-cue-attention {
          0%,
          78%,
          100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          82% {
            transform: translateY(-2px) rotate(-0.6deg) scale(1.015);
          }
          86% {
            transform: translateY(1px) rotate(0.45deg) scale(0.995);
          }
          90% {
            transform: translateY(-1px) rotate(-0.25deg) scale(1.006);
          }
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

        .project-gallery-rail {
          scrollbar-width: none;
        }

        .project-gallery-rail::-webkit-scrollbar {
          display: none;
        }

        .project-gallery-track {
          transform: translate3d(0, 0, 0);
        }

        @media (prefers-reduced-motion: reduce) {
          .project-gallery-track,
          .project-gallery-track * {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </main>
  );
}
