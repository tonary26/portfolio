import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('removes Coraviero and links Hotel Rai to its production domain', async () => {
  const [{ projects }, app, i18n] = await Promise.all([
    import('../src/data/projects.js'),
    read('src/App.vue'),
    read('src/data/i18n.json').then(JSON.parse),
  ])

  const hotel = projects.find(({ id }) => id === 'hotel-rai')

  assert.equal(projects.some(({ id }) => id === 'coraviero'), false)
  assert.equal(hotel.link, 'https://тетюши-гостиница.рф/')
  assert.equal('coraviero' in i18n.projectTranslations.en, false)
  assert.equal('coraviero' in i18n.projectTranslations.ro, false)

  assert.doesNotMatch(app, /class="preloader"/)
  assert.doesNotMatch(app, /loaderComplete|tickProgress|progressFrame|completionTimer/)
})
