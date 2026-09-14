import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('shows Coraviero as a localized web case with its video', async () => {
  const [{ projects }, app, i18n] = await Promise.all([
    import('../src/data/projects.js'),
    read('src/App.vue'),
    read('src/data/i18n.json').then(JSON.parse),
  ])

  const project = projects.find(({ id }) => id === 'coraviero')

  assert.equal(project.category, 'web')
  assert.equal(project.link, 'https://coraviero.com/')
  assert.match(project.media, /coraviero\.mp4$/)
  assert.match(project.long, /846/)
  assert.ok(project.features.some((feature) => /52/.test(feature)))
  assert.ok(project.features.some((feature) => /NIF/.test(feature)))
  assert.ok(project.features.some((feature) => /WP Rocket/.test(feature)))
  assert.ok(project.features.some((feature) => /AI/.test(feature)))

  assert.ok(i18n.projectTranslations.en.coraviero)
  assert.ok(i18n.projectTranslations.ro.coraviero)
  await access(new URL('../gif/coraviero.mp4', import.meta.url))

  assert.doesNotMatch(app, /class="preloader"/)
  assert.doesNotMatch(app, /loaderComplete|tickProgress|progressFrame|completionTimer/)
})
