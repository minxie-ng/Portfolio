# Breathable Homepage Spacing Design

## Goal

Make the portfolio feel calmer and more intentional by giving each major idea substantially more room. Learn from the spacious section rhythm of Jonte Lee's portfolio without copying its visual identity, typography, palette, copy, or component styling.

## Design Direction

Use **breathable chapters**. Each major homepage section should occupy roughly one desktop viewport and present one clear focal idea. Scrolling remains continuous and natural; the page will not use mandatory scroll snapping.

The existing Min Xie identity remains unchanged:

- dark atmospheric palette and mountain-inspired details;
- existing typography and copy voice;
- photography, language-passport treatment, field-note motif, experience trail, and project-card styling;
- current hover, tap, keyboard, and reduced-motion behavior.

## Homepage Structure

### Hero

Keep the current full-screen hero. Only adjust its spacing if necessary to align its content width and vertical rhythm with the later chapters.

### About chapter

Give the language introduction and photo moment their own spacious composition of approximately `90–100svh` on desktop. Preserve the language content and photo interaction, but avoid showing the field notes in the same viewport.

### Field Notes chapter

Move the Explore, Connect, and Build field notes into a distinct chapter of approximately `90–100svh`. Keep the existing accordion behavior and visual motif. The chapter should have enough internal space that the three notes read as one intentional composition rather than the continuation of a dense About block.

### Experience chapter

Expand the existing Experience section to approximately `90–100svh` on desktop. Keep the four-role timeline and its one-open hover, focus, and tap behavior. Use vertical centering and controlled gaps to make the timeline feel like the section's sole focus.

### Selected Work chapter

Give the existing project gallery approximately one viewport of breathing room. Preserve its horizontal card treatment and all project links. Increase the separation between the heading and the gallery, and let the rail occupy more of the available width without redesigning the cards.

### Contact chapter

Increase the contact section to a calm closing chapter, targeting roughly `70–85svh` on desktop. Keep the same contact content and links, with restrained spacing and no additional decorative elements.

## Responsive Behavior

- Desktop sections use viewport-based minimum heights plus safe vertical padding.
- Tablet and mobile use content-driven height with generous padding instead of forcing `100vh`, preventing clipped content and awkward browser-toolbar behavior.
- Existing responsive layouts and horizontal overflow protections remain intact.
- No mandatory scroll snapping is introduced.

## Implementation Boundaries

This experiment changes layout and spacing only. It does not change copy, colours, fonts, images, project content, experience content, navigation model, or interactive feature behavior.

Implementation will happen in a separate Git worktree so the current site remains untouched while the experiment is evaluated.

## Verification

- Compare desktop views at `1440 × 900` and a representative laptop viewport.
- Verify mobile at approximately `390 × 844`.
- Confirm each desktop chapter has one clear focal composition and no clipped content.
- Confirm all existing hover, keyboard, tap, media-preview, and reduced-motion behavior still works.
- Confirm there is no horizontal overflow.
- Run lint and production build before presenting the experiment.
