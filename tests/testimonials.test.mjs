import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('renders six localized testimonials in an accessible horizontal rail', async () => {
  const [app, component, i18n] = await Promise.all([
    read('src/App.vue'),
    read('src/components/TestimonialsSection.vue'),
    read('src/data/i18n.json').then(JSON.parse),
  ])

  for (const language of ['ru', 'en', 'ro']) {
    assert.equal(i18n.messages[language].reviews.items.length, 6)
    assert.ok(i18n.messages[language].nav.reviews)
    assert.ok(i18n.messages[language].reviews.prev)
    assert.ok(i18n.messages[language].reviews.next)
  }

  assert.match(app, /scrollTo\('reviews'\)/)
  assert.match(app, /<TestimonialsSection/)
  assert.match(component, /scroll-snap|testimonials__rail/)
  assert.match(component, /:disabled="!canScrollPrev"/)
  assert.match(component, /https:\/\/t\.me\//)
  assert.match(component, /@touchstart\.passive="handleTouchStart"/)
  assert.match(component, /@touchend\.passive="handleTouchEnd"/)
  assert.match(component, /settleOnNearestReview/)
})
