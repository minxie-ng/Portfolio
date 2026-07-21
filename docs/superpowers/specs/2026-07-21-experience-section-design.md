# Experience Section Design

## Goal

Add a concise experience section to Min Xie's portfolio homepage that communicates professional work and student leadership without competing with the existing project gallery. The section should feel native to the site's dark, exploratory visual language and help recruiters scan four current roles quickly.

## Placement and hierarchy

The section will sit between **About Me** and **Selected Work**. This creates a clear narrative: personal perspective, evidence of contribution, then detailed project cases.

The section header will use:

- Eyebrow: `Experience`
- Heading: `Where I've contributed, learned, and led.`

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
- A slim left metadata column for date and location.
- A central route line and stop marker.
- A flexible right column for role, organisation, and one-line summary.

Mobile layout:

- Collapse to one vertical column.
- Keep the route line on the left.
- Place date and location above each role.
- Allow summaries to wrap naturally without horizontal scrolling.

## Interaction and motion

Use one restrained reveal for the section: the route and entries appear progressively as the section enters the viewport. Do not add hover-dependent information or per-card effects.

When `prefers-reduced-motion: reduce` is active, render the complete section immediately with no animated transition. All content must remain available without JavaScript-driven motion.

## Accessibility

- Use a semantic `<section>` with a labelled heading.
- Render the experience list with list semantics.
- Keep the route line and stop markers decorative and hidden from assistive technology.
- Maintain readable contrast for role titles, metadata, and summaries.
- Do not rely on color or motion to convey entry order.

## Failure and edge handling

The section is static and has no external data dependency. If a field is intentionally absent in a future entry, omit its separator rather than rendering empty text. Long role or organisation names must wrap without changing the route alignment.

## Verification

- Confirm all four entries, dates, locations, and summaries render in the agreed order.
- Verify the desktop and mobile timeline layouts at representative breakpoints.
- Verify no horizontal overflow is introduced.
- Verify reduced-motion behavior.
- Run lint and a production build.
- Inspect the finished homepage visually at desktop and mobile widths.

## Out of scope

- A dedicated résumé or experience detail page.
- Company logos or external company links.
- Expandable responsibility lists.
- Additional LinkedIn roles.
- Changes to the existing About, Projects, Contact, or pointer-atmosphere behavior.
