# Experience Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive, accessible trail-log experience section containing four approved roles between the homepage About and Projects sections.

**Architecture:** Keep the implementation in the existing client homepage to match the repository's established single-page pattern. Define the content in a typed static array, use one `IntersectionObserver` to trigger the whole section, and render semantic list items whose responsive Tailwind grid moves metadata without duplicating content.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, browser `IntersectionObserver`

---

## File map

- Modify `site/app/page.tsx`: define experience data, manage the one-time reveal state, and render the trail-log section.
- Verify `site/app/page.tsx` through the repository's existing ESLint and Next.js production build commands.

No new component file is needed: this feature has one consumer, and the homepage already keeps its section data and markup together. Do not modify or discard the existing uncommitted pointer-atmosphere work in this file.

### Task 1: Add the typed experience content

**Files:**
- Modify: `site/app/page.tsx:17-80`

- [ ] **Step 1: Run a content assertion to establish the red state**

Run:

```bash
node -e "const source=require('fs').readFileSync('app/page.tsx','utf8'); if(!source.includes('AI Product Operations Intern') || !source.includes('first overseas expedition in six years')) process.exit(1)"
```

Working directory: `site`

Expected: exit code `1`, because the approved experience data is not present yet.

- [ ] **Step 2: Add the type and complete static data array**

Insert after the `PhotoMoment` type and before `projects`:

```tsx
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
```

- [ ] **Step 3: Re-run the content assertion**

Run the Step 1 command again from `site`.

Expected: exit code `0`.

- [ ] **Step 4: Confirm the diff contains only the new type and data for this task**

Run:

```bash
git diff -- site/app/page.tsx
```

Expected: the existing pointer-atmosphere diff remains intact and the only additional diff is the `Experience` type and `experiences` array.

### Task 2: Add a one-time, reduced-motion-safe reveal

**Files:**
- Modify: `site/app/page.tsx:94-123`
- Modify: `site/app/page.tsx` near the existing effects before the component return

- [ ] **Step 1: Add the ref and reveal state**

At the start of `Home`, alongside the existing refs and state, add:

```tsx
const experienceRef = useRef<HTMLElement | null>(null);
const [isExperienceVisible, setIsExperienceVisible] = useState(false);
```

- [ ] **Step 2: Add the observer effect after `prefersReducedMotion` is available**

Place this effect with the other page effects:

```tsx
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
```

This reveals once, disconnects promptly, and immediately shows the content when reduced motion is requested.

- [ ] **Step 3: Run lint to catch hook or type errors**

Run:

```bash
npm run lint
```

Working directory: `site`

Expected: exit code `0`, with no React hook or TypeScript errors.

### Task 3: Render the responsive trail log

**Files:**
- Modify: `site/app/page.tsx:1021` (insert immediately before the Projects section)

- [ ] **Step 1: Add the semantic section and approved copy**

Insert the following markup between the closing Hero/About wrapper and `{/* PROJECTS */}`:

```tsx
{/* EXPERIENCE */}
<section
  ref={experienceRef}
  aria-labelledby="experience-heading"
  className="overflow-hidden px-6 py-14 sm:px-8 sm:py-20"
>
  <div className="mx-auto max-w-6xl">
    <div className="grid gap-5 border-b border-white/10 pb-8 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)] sm:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9fe7bf]/70">
          Experience
        </p>
        <h2
          id="experience-heading"
          className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.035em] text-white sm:text-4xl"
        >
          Where I&apos;ve contributed, learned, and led.
        </h2>
      </div>
      <p className="max-w-md text-sm leading-6 text-white/55 sm:justify-self-end">
        Product work, programme support, and student leadership across Singapore and Hangzhou.
      </p>
    </div>

    <ol className="mt-10 sm:mt-12">
      {experiences.map((experience, index) => (
        <li
          key={`${experience.organisation}-${experience.role}`}
          className="relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-4 pb-10 last:pb-0 sm:grid-cols-[10rem_1.5rem_minmax(0,1fr)] sm:gap-x-6 sm:pb-12"
          style={{
            opacity: isExperienceVisible ? 1 : 0,
            transform: `translate3d(0, ${isExperienceVisible ? 0 : 18}px, 0)`,
            transition: prefersReducedMotion
              ? "none"
              : `opacity 520ms ease-out ${index * 90}ms, transform 560ms cubic-bezier(0.2, 0.9, 0.2, 1) ${index * 90}ms`,
          }}
        >
          <div className="col-start-2 row-start-1 mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/38 sm:col-start-1 sm:mb-0 sm:block sm:pt-0.5 sm:text-right">
            <span className="block">{experience.period}</span>
            <span className="text-white/20 sm:hidden" aria-hidden>
              ·
            </span>
            <span className="block sm:mt-2">{experience.location}</span>
          </div>

          <div
            className="relative col-start-1 row-span-2 row-start-1 flex justify-center sm:col-start-2"
            aria-hidden
          >
            {index < experiences.length - 1 ? (
              <span
                className="absolute left-1/2 top-3 h-[calc(100%+2.5rem)] w-px origin-top -translate-x-1/2 bg-gradient-to-b from-[#9fe7bf]/45 via-white/14 to-white/5 sm:h-[calc(100%+3rem)]"
                style={{
                  transform: `translateX(-50%) scaleY(${isExperienceVisible ? 1 : 0})`,
                  transition: prefersReducedMotion
                    ? "none"
                    : `transform 620ms ease-out ${120 + index * 90}ms`,
                }}
              />
            ) : null}
            <span className="relative z-10 mt-1 h-3 w-3 rounded-full border border-[#9fe7bf]/65 bg-[#061820] shadow-[0_0_0_5px_rgba(159,231,191,0.06),0_0_22px_rgba(159,231,191,0.18)]" />
          </div>

          <article className="col-start-2 row-start-2 min-w-0 sm:col-start-3 sm:row-start-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fe7bf]/66">
              {experience.organisation}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-white/92 sm:text-2xl">
              {experience.role}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58 sm:text-[0.95rem] sm:leading-7">
              {experience.summary}
            </p>
          </article>
        </li>
      ))}
    </ol>

    <div className="mt-14 h-px w-full bg-white/10 sm:mt-20" />
  </div>
</section>
```

- [ ] **Step 2: Run formatting-sensitive checks**

Run:

```bash
git diff --check
npm run lint
```

Working directory for `npm run lint`: `site`

Expected: both commands exit `0` with no whitespace, JSX, accessibility, or hook errors.

- [ ] **Step 3: Run the production build**

Run:

```bash
npm run build
```

Working directory: `site`

Expected: Next.js reports a successful production build and lists `/` as a generated route.

### Task 4: Verify the complete experience in a browser

**Files:**
- Modify only if verification finds a defect: `site/app/page.tsx`

- [ ] **Step 1: Start the local development server**

Run:

```bash
npm run dev
```

Working directory: `site`

Expected: Next.js reports the local URL and remains running.

- [ ] **Step 2: Verify desktop presentation**

Open the homepage at a desktop viewport around `1440×900` and scroll to Experience. Confirm:

- the section appears between About and Selected Work;
- all four roles render in the approved order;
- the date column, route, and content column align;
- the route draws once and the content remains visible;
- the project gallery and pointer atmosphere still behave as before;
- no horizontal scrolling is introduced.

- [ ] **Step 3: Verify mobile presentation**

At a viewport around `390×844`, confirm:

- metadata appears above each role;
- the route remains on the left and does not overlap text;
- long Trekking President copy wraps cleanly;
- no content depends on hover;
- the page has no horizontal overflow.

- [ ] **Step 4: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`, reload, and confirm the four entries and complete route appear immediately without staged transitions.

- [ ] **Step 5: Fix only observed defects and repeat the relevant lint/build/browser check**

Keep fixes scoped to Experience. Do not refactor About, Projects, Contact, or the user's pointer-atmosphere changes.

- [ ] **Step 6: Review the final diff and commit the implementation**

Run:

```bash
git diff --check
git diff -- site/app/page.tsx
git status --short
git add site/app/page.tsx
git commit -m "Add experience trail to portfolio homepage"
```

Expected: the diff includes the user's pre-existing pointer-atmosphere work plus the experience feature; the commit succeeds only after confirming that including the full current `page.tsx` diff is intended. If the pointer work must remain uncommitted separately, stop before staging and ask the user how they want the shared-file changes committed.

### Task 5: Refine the trail into a compact accessible accordion

**Files:**
- Modify: `site/app/page.tsx`

- [ ] **Step 1: Add a failing source assertion for the approved interaction contract**

Run from the repository root:

```bash
node -e "const fs=require('fs'); const source=fs.readFileSync('site/app/page.tsx','utf8'); const ok=!source.includes('Where I&apos;ve contributed, learned, and led.') && source.includes('activeExperienceIndex') && source.includes('aria-expanded={isActive}') && source.includes('experience-details-'); if(!ok) process.exit(1);"
```

Expected: exit `1` because the old headline remains and the accordion state and accessibility attributes do not exist yet.

- [ ] **Step 2: Add one-at-a-time expansion state**

Add this state beside the existing Experience visibility state:

```tsx
const [activeExperienceIndex, setActiveExperienceIndex] = useState<number | null>(null);
```

- [ ] **Step 3: Replace the section heading and expanded entries**

Replace the eyebrow plus headline with one semantic `h2` containing `Experience`. For each experience, render a full-row `button` with:

- `aria-expanded={isActive}` and `aria-controls={`experience-details-${index}`}`;
- the date, organisation, and role always visible;
- the location and summary inside the controlled details element;
- `onMouseEnter` and `onMouseLeave` expansion for fine-pointer desktop;
- `onFocus` and `onBlur` expansion for keyboard users;
- `onClick` toggling for touch/mobile users;
- the shared `activeExperienceIndex` so opening one row closes every other row.

Animate the details with `grid-template-rows`, opacity, and margin. Use `transition-none` when `prefersReducedMotion` is true. Keep the existing route marker, staged section entrance, and responsive metadata layout.

- [ ] **Step 4: Make the source assertion pass**

Re-run the Step 1 command.

Expected: exit `0`.

- [ ] **Step 5: Run static verification**

Run:

```bash
git diff --check
cd site && npm run lint && npm run build
```

Expected: all commands exit `0`.

### Task 6: Verify accordion behavior and update the pull request

- [ ] **Step 1: Verify desktop behavior at `1440x900`**

Confirm every row starts collapsed; hovering or focusing a row reveals only that row's location and summary; moving to another row switches the open entry; leaving or blurring collapses it; the heading contains only `Experience`; and there is no horizontal overflow.

- [ ] **Step 2: Verify mobile behavior at `390x844`**

Confirm tapping a row opens it, tapping another closes the first and opens the second, and tapping the active row closes it. Confirm the route and wrapped text do not overlap.

- [ ] **Step 3: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce` and confirm detail expansion has no transition while remaining functional.

- [ ] **Step 4: Review, commit, push, and fast-forward local main**

Run:

```bash
git diff --check
git diff -- site/app/page.tsx
git add site/app/page.tsx docs/superpowers/plans/2026-07-21-experience-section.md
git commit -m "Make experience trail entries expandable"
git push origin codex/experience-section
git -C ../.. merge --ff-only codex/experience-section
```

Expected: pull request #1 updates with the refined experience interaction, and local `main` points at the same commit without rewriting history.
