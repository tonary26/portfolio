# Design System

## Theme

Technical workshop portfolio. Dark, high-contrast hero transitions into a true off-white paper surface. Warm forged-copper orange is the single anchor; blue and green appear only inside project-specific visualizations.

## Color Palette

- Background dark: `oklch(0.10 0 0)`
- Background paper: `oklch(0.975 0 0)`
- Ink on paper: `oklch(0.17 0.012 49)`
- Ink on dark: `oklch(0.96 0 0)`
- Primary: `oklch(0.704 0.189 49)`
- Primary deep: `oklch(0.48 0.17 42)`
- Muted dark: `oklch(0.72 0.008 49)`
- Muted paper: `oklch(0.43 0.015 49)`

## Typography

Display uses local `Arial Black`/Impact-style fallback for compact uppercase shapes. Body uses Arial/Helvetica-style humanist sans fallbacks; technical labels use Consolas. Display tracking never exceeds `-0.04em`.

## Components

- Hero: two-line uppercase title, second line outlined.
- Paper sheet: rounded top transition that overlaps the dark hero.
- Project plates: wide editorial rows with one content block and one meaningful visualization.
- Filter tabs: compact segmented control with a solid active state.
- Project drawer: full-screen overlay with case narrative, features and complete stack.

## Motion

Hero title reveals by clipped vertical motion. Project blocks reveal on intersection. Cards use subtle pointer tilt only on precise pointer devices. Reduced-motion mode removes transforms, marquee motion and staged entrances.

## Layout

Fluid padding uses `clamp()`. Desktop project plates use a 1.05/0.95 split; mobile stacks media first. Body text stays below 70 characters per line.
