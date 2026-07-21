# Photo Card Proportions Design

## Goal

Correct the About section's overly wide photo card by giving the photograph a more substantial, balanced shape while preserving the portfolio's current visual identity and behavior.

## Approved Direction

Use a **4:3 photo ratio on desktop**. Rebalance the large-screen About grid from a seven-column photo and five-column Field Notes split to an equal six-column split. The combined changes make the photo narrower and taller, and keep the two cards visually balanced beside each other.

## Layout Behavior

- At the `lg` breakpoint and above, the photo card and Field Notes each span six of the twelve grid columns.
- The photo media area uses a 4:3 aspect ratio at the `lg` breakpoint and above instead of the current fixed short landscape height.
- Below the `lg` breakpoint, the current stacked layout and fixed mobile/tablet media heights remain unchanged.
- The caption stays beneath the image inside the existing card frame.
- The About section keeps its current width, spacing, palette, borders, shadows, and passport-journal styling.

## Preserved Behavior

The change does not alter:

- the three photo moments or their order;
- image cropping positions;
- stacked background cards;
- video preview on hover or focus;
- mobile tap-to-preview and tap-to-advance behavior;
- caption copy and cue text;
- scroll reveal, reduced-motion behavior, or Field Notes interactions.

## Implementation Boundaries

Only responsive grid spans and the desktop photo media sizing may change. Copy, colours, typography, assets, interaction handlers, animation calculations, Field Notes dimensions, and other homepage sections remain out of scope.

## Verification

- Verify the About composition at `1440 × 900` and `1280 × 720`.
- Confirm the desktop image renders at approximately 4:3 and aligns visually with Field Notes.
- Verify mobile at approximately `390 × 844` and confirm its current proportions are unchanged.
- Confirm photo hover, focus, and tap behavior still works.
- Confirm reduced-motion content remains visible.
- Confirm there is no horizontal overflow.
- Run lint and a production build.
