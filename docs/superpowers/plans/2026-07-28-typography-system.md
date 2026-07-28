# DevSpace Typography System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install and apply the approved five-role typography system while preserving the bold outlined Inter hero, removing fragmented per-letter markup, and keeping GSAP behavior.

**Architecture:** Fontsource packages provide locally bundled Cyrillic faces. `src/main.js` owns font loading, `src/styles.css` maps semantic font tokens to component roles, and `src/App.vue` keeps hero lines as uninterrupted text runs so GSAP can animate line wrappers without per-letter artifacts.

**Tech Stack:** Vue 3, Vite, CSS custom properties, Fontsource, GSAP, Node test runner, Playwright/Chrome for visual verification.

---

## File map

- `package.json` / `package-lock.json`: local font dependencies and test command.
- `src/main.js`: explicit Cyrillic and Latin face imports for required weights.
- `src/styles.css`: semantic typography tokens and role mappings.
- `src/App.vue`: uninterrupted hero text and unchanged GSAP stack copy.
- `tests/typography.test.mjs`: regression contract for font roles, outline removal, and GSAP preservation.

### Task 1: Add the regression contract

**Files:**
- Create: `tests/typography.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing source contract**

Create a Node test that reads the real source files and asserts:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('uses five local typography roles and clean hero text', async () => {
  const [main, css, app] = await Promise.all([
    read('src/main.js'),
    read('src/styles.css'),
    read('src/App.vue'),
  ])

  for (const family of ['inter', 'onest', 'manrope', 'golos-text', 'jetbrains-mono']) {
    assert.match(main, new RegExp(`@fontsource/${family}`))
  }

  for (const token of ['--font-hero', '--font-section', '--font-card', '--font-body', '--font-meta']) {
    assert.match(css, new RegExp(token))
  }

  assert.match(css, /--font-hero:\s*"Inter"/)
  assert.match(css, /-webkit-text-stroke/)
  assert.doesNotMatch(app, /hero-letter-(?:de|a)/)
  assert.match(app, /<span>ОТ ИДЕИ –<\/span>/)
  assert.match(app, /<span>ДО ПРОДАКШЕНА<\/span>/)
  assert.match(app, /GSAP/)
  assert.match(main, /from 'gsap'/)
})
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/typography.test.mjs`

Expected: FAIL because the five Fontsource families and semantic tokens do not
exist and the old per-letter wrappers remain.

- [ ] **Step 3: Add the reusable test command**

Add `"test": "node --test tests/*.test.mjs"` to `package.json`.

- [ ] **Step 4: Commit the failing test**

```powershell
git add -- tests/typography.test.mjs package.json
git commit -m "test: define DevSpace typography contract"
```

### Task 2: Bundle the five approved font families

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/main.js`

- [ ] **Step 1: Install local Fontsource packages**

Run:

```powershell
npm install @fontsource/unbounded@5.3.0 @fontsource/onest@5.3.0 @fontsource/manrope@5.3.0 @fontsource/golos-text@5.3.0 @fontsource/jetbrains-mono@5.3.0
```

Expected: packages are added to dependencies with no audit vulnerabilities.

- [ ] **Step 2: Replace the Inter imports with required local faces**

Use these imports in `src/main.js`:

```js
import '@fontsource/inter/cyrillic-900.css'
import '@fontsource/inter/latin-900.css'
import '@fontsource/onest/cyrillic-800.css'
import '@fontsource/onest/latin-800.css'
import '@fontsource/manrope/cyrillic-700.css'
import '@fontsource/manrope/cyrillic-800.css'
import '@fontsource/manrope/latin-700.css'
import '@fontsource/manrope/latin-800.css'
import '@fontsource/golos-text/cyrillic-400.css'
import '@fontsource/golos-text/cyrillic-600.css'
import '@fontsource/golos-text/cyrillic-700.css'
import '@fontsource/golos-text/latin-400.css'
import '@fontsource/golos-text/latin-600.css'
import '@fontsource/golos-text/latin-700.css'
import '@fontsource/jetbrains-mono/cyrillic-500.css'
import '@fontsource/jetbrains-mono/cyrillic-600.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import '@fontsource/jetbrains-mono/latin-600.css'
```

- [ ] **Step 3: Run the contract and confirm it still fails for CSS/markup only**

Run: `npm test`

Expected: FAIL on missing semantic CSS tokens or remaining hero outline markup,
not on missing font imports.

- [ ] **Step 4: Commit bundled font faces**

```powershell
git add -- package.json package-lock.json src/main.js
git commit -m "feat: bundle DevSpace font families"
```

### Task 3: Apply semantic font roles and repair outlined text

**Files:**
- Modify: `src/styles.css`
- Modify: `src/App.vue`

- [ ] **Step 1: Add semantic font tokens**

Replace the generic font variables with:

```css
--font-hero: "Inter", "Arial Black", sans-serif;
--font-section: "Onest", Arial, sans-serif;
--font-card: "Manrope", Arial, sans-serif;
--font-body: "Golos Text", Arial, sans-serif;
--font-meta: "JetBrains Mono", Consolas, monospace;
```

Map them by role:

- hero, brand, loader wordmarks and loader percentage → `--font-hero`;
- section and drawer hero headings → `--font-section`;
- project, capability and medium decorative headings → `--font-card`;
- body, navigation, filters, buttons and links → `--font-body`;
- metadata, stacks, counters and terminal decorations → `--font-meta`.

- [ ] **Step 2: Restore the bold outline without fragmented markup**

Use:

```css
.hero-title__line--outline > span {
  color: transparent;
  -webkit-text-stroke: clamp(1px, 0.13vw, 2px) var(--ink-inverse);
}
```

Keep the responsive outline, but remove every `.hero-letter-de` and
`.hero-letter-a` rule.

- [ ] **Step 3: Restore uninterrupted hero strings**

Use:

```html
<span class="hero-title__line"><span>ОТ ИДЕИ –</span></span>
<span class="hero-title__line hero-title__line--outline"><span>ДО ПРОДАКШЕНА</span></span>
```

Keep `.hero-title__line > span` so the existing GSAP selector
`.hero-title__line > span` continues to animate.

- [ ] **Step 4: Run the contract and verify GREEN**

Run: `npm test`

Expected: one passing test, zero failures.

- [ ] **Step 5: Commit the typography implementation**

```powershell
git add -- src/styles.css src/App.vue
git commit -m "feat: apply DevSpace typography hierarchy"
```

### Task 4: Verify responsive rendering and production output

**Files:**
- Modify only if verification exposes a defect: `src/styles.css`

- [ ] **Step 1: Run the production checks**

Run:

```powershell
npm test
npm run build
```

Expected: both commands exit 0; built assets include all five font families.

- [ ] **Step 2: Verify real browser behavior**

Using local Chrome through Playwright, check widths `320`, `390`, `768`, and
`1440`:

- computed hero font is Inter;
- secondary hero line is Inter 900 with the responsive stroke;
- section heading is Onest;
- project heading is Manrope;
- body is Golos Text;
- metadata is JetBrains Mono;
- all five required faces report `loaded`;
- no horizontal overflow;
- no console or page errors;
- no requests to `fonts.googleapis.com` or `fonts.gstatic.com`;
- hero GSAP transform changes during entrance and reaches its final state.

- [ ] **Step 3: Inspect mobile and desktop screenshots**

Confirm `А`, `Р`, and `Д` are continuous glyphs and the hierarchy is clear
without clipped headings or unstable line breaks.

- [ ] **Step 4: Run final source checks**

Run:

```powershell
rg -n "hero-letter-de|hero-letter-a|fonts\\.googleapis|fonts\\.gstatic" src index.html
git diff --check
git status --short
```

Expected: the first command has no matches; no whitespace errors exist in task
files; the worktree contains only intentional changes.
