# Experience Section Design

## Goal

Add a concise experience section to Min Xie's portfolio homepage that communicates professional work and student leadership without competing with the existing project gallery. The section should feel native to the site's dark, exploratory visual language and help recruiters scan four current roles quickly.

## Placement and hierarchy

The section will sit between **About Me** and **Selected Work**. This creates a clear narrative: personal perspective, evidence of contribution, then detailed project cases.

The section header will use only the heading `Experience`. Remove the supporting headline and descriptive sentence so the timeline carries the section.

## Content

Display these four entries in this order:

1. **AI Product Operations Intern — TigerSec**
   - Date: May 2026–Present
   - Location: Hangzhou
   - Summary: Supporting AI agents, product workflows, content operations, and user guidance.
2. **Student Assistant — SMU Academy**
   - Date: Jan 2026–Present
   - Location: Singapore
   - Summary: Supporting the delivery of professional learning programmes and learner operations.
3. **Trekking President — SMUXploration Crew**
   - Date: Jan 2026–Present
   - Location: Singapore
   - Summary: Revived the club's first overseas expedition in six years, serving as OIC while leading logistics, safety planning, and the student team.
4. **Event Executive — SMU Product Club**
   - Date: Jan 2026–Present
   - Location: Singapore
   - Summary: Creating product events that connect students with practitioners and industry teams.

Do not include the Product Management Experience Community role in this section because the related work already appears in the project gallery.

## Visual direction

Use a vertical **trail log** rather than a grid of cards. A thin route line connects four stops, tying the section to the portfolio's existing mountain and exploration language while remaining professional.

- Reuse the page background `#061820` and existing white opacity hierarchy.
- Use the existing mint accent `#9fe7bf` for route stops and restrained highlights.
- Keep typography consistent with the current Geist-based system.
- Avoid company logos, large cards, and decorative numbering.
- Treat dates as metadata rather than headings.

The route is the signature element. Everything else should remain quiet and compact so the experience section does not compete with the project cards.

## Layout and components

Store the entries in a typed `experiences` data array near the existing homepage data. Render them through a focused experience section in the homepage component.

Desktop layout:

- Section header above the timeline.
- A slim left metadata column for the date.
- A central route line and stop marker.
- A flexible right column for organisation and role.
- Location and summary remain collapsed until the row is active.

Mobile layout:

- Collapse to one vertical column.
- Keep the route line on the left.
- Place the date above each role.
- Reveal location and summary below the role when its row is tapped.
- Allow expanded summaries to wrap naturally without horizontal scrolling.

## Interaction and motion

Use one restrained reveal for the section: the route and entries appear progressively as the section enters the viewport.

Each timeline row behaves as a compact one-at-a-time accordion:

- Default state: show only date, organisation, and role.
- Desktop pointer: reveal location and summary while the row is hovered; collapse it when the pointer leaves.
- Keyboard: focusing a row reveals it, and moving focus away collapses it.
- Mobile/touch: tapping a row expands it; tapping a different row switches the active entry; tapping the active row again may collapse it.
- Only one entry may be expanded at once.
- The entire row is the control. Do not add a separate “View details” label or button.
- Animate the detail region with a short height/opacity transition. Reduced-motion users receive the same state changes without animation.

When `prefers-reduced-motion: reduce` is active, render the timeline immediately with no entry or accordion animation. Detail regions remain collapsed until their row is activated.

## Accessibility

- Use a semantic `<section>` with a labelled heading.
- Render the experience list with list semantics.
- Make each row a semantic button with `aria-expanded` and an `aria-controls` relationship to its detail region.
- Keep location and summary in the DOM while collapsed so assistive technology can associate the controlled content correctly.
- Keep the route line and stop markers decorative and hidden from assistive technology.
- Maintain readable contrast for role titles, metadata, and summaries.
- Do not rely on color or motion to convey entry order.

## Failure and edge handling

The section is static and has no external data dependency. If a field is intentionally absent in a future entry, omit its separator rather than rendering empty text. Long role or organisation names must wrap without changing the route alignment.

## Verification

- Confirm all four entries, dates, locations, and summaries render in the agreed order.
- Confirm all entries are collapsed initially.
- Confirm hover and keyboard focus reveal only one desktop entry at a time.
- Confirm tap expands, switches, and collapses entries on mobile.
- Verify the desktop and mobile timeline layouts at representative breakpoints.
- Verify no horizontal overflow is introduced.
- Verify reduced-motion behavior.
- Run lint and a production build.
- Inspect the finished homepage visually at desktop and mobile widths.

## Out of scope

- A dedicated résumé or experience detail page.
- Company logos or external company links.
- Multi-bullet responsibility lists.
- Additional LinkedIn roles.
- Changes to the existing About, Projects, Contact, or pointer-atmosphere behavior.
