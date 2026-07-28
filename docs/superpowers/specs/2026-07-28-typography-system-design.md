# DevSpace Typography System

## Goal

Create an immediately readable hierarchy for the DevSpace portfolio and remove
the fragmented appearance of Cyrillic letters in every outlined text treatment.
GSAP and the existing motion system remain unchanged.

## Approved font roles

The interface uses five locally bundled Cyrillic-capable font families. Each
family has one clear responsibility:

1. **Unbounded** — hero title, DevSpace wordmark, loader wordmark, and the
   highest-priority display text.
2. **Onest** — major section headings and drawer hero headings.
3. **Manrope** — project names, capability names, and medium display headings.
4. **Golos Text** — paragraphs, navigation, buttons, filters, links, and other
   interface copy.
5. **JetBrains Mono** — project metadata, technology tags, loader status,
   counters, and terminal-like decorative interfaces.

All fonts must be installed as local npm dependencies and bundled by Vite.
There must be no Google Fonts or other runtime font request.

## Hierarchy

Typography communicates importance through family, size, weight, spacing, and
color together:

- Hero: Unbounded 800/900, fluid display scale, tight but safe tracking.
- Secondary hero line: Unbounded 300, visually light and linear.
- Section heading: Onest 800/900, one clear step below the hero.
- Card and capability heading: Manrope 700/800.
- Body and interactive copy: Golos Text 400/600/700.
- Metadata: JetBrains Mono 500/600 with restrained uppercase tracking.

The five families are role tokens, not interchangeable decoration. A component
must use the token for its semantic level.

## Outlined-text correction

The current combination of `font-weight: 900`, transparent fill, and
`-webkit-text-stroke` creates inner contours that make letters such as
`А`, `Р`, and `Д` appear split into separate pieces.

All outlined headline treatments will be replaced by a real light font:

- use Unbounded 300;
- render the glyphs with a solid foreground color;
- remove `-webkit-text-stroke` and transparent text fill;
- render each line as one uninterrupted text run;
- remove manual per-letter `i` wrappers and spacing corrections.

This keeps the secondary line visually lighter than the solid hero line while
preserving intact Cyrillic glyph construction at every scale.

## Implementation boundaries

- Keep the current copy, layout, colors, project data, filters, drawers, and
  GSAP animations.
- Keep the existing hero entrance selectors working after markup cleanup.
- Replace the current `--display`, `--body`, and `--mono` model with semantic
  font-family tokens for the five roles.
- Load only the weights used by the mapped components.
- Preserve `prefers-reduced-motion` behavior.
- Do not add remote font links.

## Responsive behavior

- Hero copy must fit without horizontal overflow from 320 px upward.
- Heading line breaks remain intentional and stable.
- Body text remains at least 1rem.
- Large display tracking must not be tighter than `-0.04em`.
- Font loading must not hide text; local Fontsource faces use their normal
  `font-display` behavior and metric-compatible fallbacks.

## Verification

Implementation is accepted when:

1. No `-webkit-text-stroke` remains on text.
2. No `hero-letter-de` or `hero-letter-a` wrappers remain.
3. Browser font faces confirm all five required families are loaded where used.
4. The hero has no horizontal overflow at 320, 390, 768, and 1440 px.
5. Cyrillic `А`, `Р`, and `Д` render as uninterrupted glyphs in mobile and
   desktop screenshots.
6. No Google Fonts requests or console errors occur.
7. Existing GSAP hero and scroll animations still run.
8. `npm run build` completes successfully.
