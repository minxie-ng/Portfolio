# Photo Card Proportions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the desktop About photo card feel balanced and photographic by using a 4:3 media ratio and equal photo/Field Notes columns, while preserving mobile sizing and all existing interactions.

**Architecture:** Keep the existing About composition and behavior in `site/app/page.tsx`. Change only the three large-screen Tailwind layout contracts that control the photo column, Field Notes column, and photo media ratio; add a Node source-contract test so those proportions and the preserved mobile heights remain explicit.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Node.js built-in assertions, ESLint.

---

## File Map

- Create `site/scripts/verify-photo-card-proportions.mjs`: verifies equal large-screen columns, the 4:3 desktop media ratio, preserved mobile heights, and unchanged photo interaction hooks.
- Modify `site/package.json`: adds `npm run test:photo-card`.
- Modify `site/app/page.tsx`: changes only the About photo and Field Notes responsive sizing classes.

### Task 1: Add the failing photo-card proportion contract

**Files:**
- Create: `site/scripts/verify-photo-card-proportions.mjs`
- Modify: `site/package.json`
- Test: `site/scripts/verify-photo-card-proportions.mjs`

- [ ] **Step 1: Create the source-contract test**

Create `site/scripts/verify-photo-card-proportions.mjs` with:

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const homepagePath = fileURLToPath(new URL("../app/page.tsx", import.meta.url));
const source = readFileSync(homepagePath, "utf8");
const aboutStart = source.indexOf("ref={aboutJournalRef}");
const aboutEnd = source.indexOf("{/* ✅ Divider BELOW About */}", aboutStart);

assert.notEqual(aboutStart, -1, "Missing About journal composition");
assert.notEqual(aboutEnd, -1, "Missing About composition boundary");

const aboutSource = source.slice(aboutStart, aboutEnd);
const equalColumns = aboutSource.match(/lg:col-span-6/g) ?? [];

assert.equal(equalColumns.length, 2, "Photo and Field Notes must each span six desktop columns");
assert.doesNotMatch(aboutSource, /lg:col-span-(?:5|7)/, "Unequal desktop About columns remain");
assert.match(
  aboutSource,
  /ref=\{photoBlockInnerRef\}[\s\S]{0,180}h-\[20\.5rem\][\s\S]{0,80}sm:h-\[20rem\][\s\S]{0,80}lg:aspect-\[4\/3\][\s\S]{0,80}lg:h-auto/,
  "Desktop photo media must use 4:3 while preserving mobile and tablet heights",
);

for (const behavior of [
  "onClick={handlePhotoAction}",
  "onMouseEnter={isTouchMobile ? undefined : startPhotoPreview}",
  "onFocus={isTouchMobile ? undefined : startPhotoPreview}",
  "style={photoRollStyle}",
]) {
  assert.ok(aboutSource.includes(behavior), `Missing preserved photo behavior: ${behavior}`);
}

console.log("Photo card proportion contract passed.");
```

- [ ] **Step 2: Add the test script to `site/package.json`**

Change the scripts block to:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test:photo-card": "node scripts/verify-photo-card-proportions.mjs"
}
```

- [ ] **Step 3: Run the contract and verify it fails**

Run from `site/`:

```bash
npm run test:photo-card
```

Expected: FAIL with `Photo and Field Notes must each span six desktop columns` because the current layout still uses a seven/five split.

### Task 2: Apply the approved 4:3 desktop proportions

**Files:**
- Modify: `site/app/page.tsx:918-1038`
- Test: `site/scripts/verify-photo-card-proportions.mjs`

- [ ] **Step 1: Change the photo wrapper to six desktop columns**

Replace the visual-card wrapper with:

```tsx
<div
  className="relative flex px-2 py-3 sm:px-3 sm:py-4 lg:col-span-6 lg:self-start"
  style={photoCardStyle}
>
```

- [ ] **Step 2: Give the desktop photo media a 4:3 ratio**

Replace the measured media wrapper with:

```tsx
<div
  ref={photoBlockInnerRef}
  className="h-[20.5rem] sm:h-[20rem] lg:aspect-[4/3] lg:h-auto"
>
```

The base and `sm` fixed heights remain exactly as they are today; only `lg` and above switch to the 4:3 ratio.

- [ ] **Step 3: Change Field Notes to six desktop columns**

Replace its outer wrapper class with:

```tsx
className="flex h-[24.75rem] self-center rounded-[1.55rem] border border-white/[0.08] bg-white/[0.032] p-3.5 shadow-[0_18px_52px_rgba(0,0,0,0.14)] sm:h-[24.5rem] sm:p-4 lg:col-span-6 lg:mt-4 lg:h-[25rem] lg:self-start lg:p-4 xl:p-5"
```

Do not modify any children, styles, state, callbacks, copy, image positions, or media-preview code.

- [ ] **Step 4: Run the proportion contract**

Run:

```bash
cd site
npm run test:photo-card
```

Expected: `Photo card proportion contract passed.`

- [ ] **Step 5: Run static verification**

Run:

```bash
npm run lint
npm run build
git diff --check
```

Expected: lint exits 0, Next.js reports `Compiled successfully`, all static routes generate, and `git diff --check` prints nothing.

- [ ] **Step 6: Commit the implementation**

```bash
git add site/app/page.tsx site/package.json site/scripts/verify-photo-card-proportions.mjs
git commit -m "Balance About photo card proportions"
```

### Task 3: Verify the composition and preserved behavior in a browser

**Files:**
- Modify only if verification reveals a proportion defect: `site/app/page.tsx`
- Test: live homepage in a browser

- [ ] **Step 1: Start the isolated development server**

Run from `site/`:

```bash
npm run dev
```

Expected: Next.js reports a local URL and `Ready`.

- [ ] **Step 2: Verify `1440 × 900` desktop proportions**

Scroll the About composition fully into view and measure the rendered media wrapper:

```js
const media = document.querySelector(
  '[aria-label="Show next photo moment"] [class*="lg:aspect-[4/3]"]',
);
const rect = media.getBoundingClientRect();
({ width: rect.width, height: rect.height, ratio: rect.width / rect.height });
```

Expected: ratio is approximately `1.333`, the photo and Field Notes occupy equal columns, both cards are fully visible, and there is no overlap.

- [ ] **Step 3: Verify `1280 × 720` laptop composition**

Scroll About into view and confirm:

- the photo remains 4:3;
- the caption remains inside the photo card;
- the photo and Field Notes do not overlap;
- the About section expands naturally if its content is taller than the viewport;
- the next section begins after both cards.

Expected: all content remains visible and the horizontal stretch is gone.

- [ ] **Step 4: Verify mobile at approximately `390 × 844`**

Measure the photo media and confirm its height remains the existing base `20.5rem` (approximately `328px`), the card stacks above Field Notes, and `document.documentElement.scrollWidth === document.documentElement.clientWidth`.

Expected: mobile proportions and stacking are unchanged with no horizontal overflow.

- [ ] **Step 5: Verify preserved interactions**

At desktop width:

- hover and focus the photo card, confirming its video preview becomes visible and plays;
- leave or blur the card, confirming the preview stops;
- activate the card and confirm the next photo moment appears.

At mobile width:

- tap a live photo once and confirm preview begins;
- tap again and confirm the photo advances.

Expected: the existing hover, focus, tap, and advance behavior is unchanged.

- [ ] **Step 6: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`, reload, and scroll to About.

Expected: the photo and Field Notes are visible without motion-dependent delays, and no error overlay appears.

- [ ] **Step 7: Check browser errors and final static verification**

Confirm no framework error overlay or browser runtime error appears, then run:

```bash
cd site
npm run test:photo-card
npm run lint
npm run build
git diff --check
```

Expected: the proportion contract passes, lint exits 0, the production build succeeds, and `git diff --check` prints nothing.

- [ ] **Step 8: Commit evidence-based corrections only when needed**

If browser verification required a responsive-class correction:

```bash
git add site/app/page.tsx site/scripts/verify-photo-card-proportions.mjs
git commit -m "Polish responsive photo card proportions"
```

If verification required no source changes, do not create an empty commit.
