import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'

test('includes Sosed Gotovit as a localized web project with its own video preview', async () => {
  const [{ projects }, i18n] = await Promise.all([
    import('../src/data/projects.js'),
    readFile(new URL('../src/data/i18n.json', import.meta.url), 'utf8').then(JSON.parse),
  ])

  const project = projects.find(({ id }) => id === 'sosed-gotovit')

  assert.equal(project.category, 'web')
  assert.equal(project.link, 'https://sosedgotovit.ru/')
  assert.equal(project.mediaType, undefined)
  assert.match(project.media, /sosedgotoviti\.mp4$/)
  assert.ok(i18n.projectTranslations.en[project.id])
  assert.ok(i18n.projectTranslations.ro[project.id])

  await access(new URL('../gif/sosedgotoviti.mp4', import.meta.url))
})
