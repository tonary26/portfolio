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

  for (const family of ['arimo', 'onest', 'manrope', 'golos-text', 'jetbrains-mono']) {
    assert.match(main, new RegExp(`@fontsource/${family}`))
  }
  assert.doesNotMatch(main, /@fontsource\/inter/)

  for (const token of ['--font-hero', '--font-section', '--font-card', '--font-body', '--font-meta']) {
    assert.match(css, new RegExp(token))
  }

  assert.match(css, /--font-hero:\s*"Arimo"/)
  assert.match(css, /\.hero-title__line--outline > span\s*\{[^}]*color:\s*transparent;[^}]*-webkit-text-stroke:/s)
  assert.match(css, /\.marquee-track span\s*\{[^}]*var\(--font-hero\)[^}]*color:\s*transparent;[^}]*-webkit-text-stroke:/s)
  assert.doesNotMatch(css, /\.hero-title__line--outline > span\s*\{[^}]*font-weight:\s*300/s)
  assert.doesNotMatch(app, /hero-letter-(?:de|a)/)
  assert.match(app, /first:\s*'ОТ ИДЕИ –'/)
  assert.match(app, /second:\s*'ДО ПРОДАКШЕНА'/)
  assert.match(app, /<span>\{\{ t\.hero\.first \}\}<\/span>/)
  assert.match(app, /<span>\{\{ t\.hero\.second \}\}<\/span>/)
  assert.match(app, /GSAP/)
  assert.match(app, /from 'gsap'/)
})
