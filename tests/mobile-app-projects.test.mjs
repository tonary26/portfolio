import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('includes MotionDeck and EagleBreath as playable mobile app cases', async () => {
  const [{ filters, projects }, card, drawer, app] = await Promise.all([
    import('../src/data/projects.js'),
    read('src/components/ProjectCard.vue'),
    read('src/components/ProjectDrawer.vue'),
    read('src/App.vue'),
  ])

  assert.deepEqual(filters.find((filter) => filter.id === 'apps'), {
    id: 'apps',
    label: 'Игры / приложения',
  })

  const motionDeck = projects.find((project) => project.id === 'motiondeck')
  const eagleBreath = projects.find((project) => project.id === 'eaglebreath')

  assert.equal(motionDeck.category, 'apps')
  assert.equal(motionDeck.link, 'https://play.google.com/store/apps/details?id=com.motiondeck.sportutility')
  assert.equal(motionDeck.externalLabel, 'Открыть в Google Play')
  assert.match(motionDeck.media, /motiondeck\.mp4$/)

  assert.equal(eagleBreath.category, 'apps')
  assert.equal(eagleBreath.link, 'https://play.google.com/store/apps/details?id=com.eaglebreath.calmcoach&hl=en')
  assert.equal(eagleBreath.externalLabel, 'Открыть в Google Play')
  assert.match(eagleBreath.media, /eaglebreath\.mp4$/)

  await Promise.all([
    access(new URL('../gif/motiondeck.mp4', import.meta.url)),
    access(new URL('../gif/eaglebreath.mp4', import.meta.url)),
  ])

  assert.match(card, /project\.externalLabel \|\| 'Открыть сайт'/)
  assert.match(drawer, /project\.externalLabel \|\| 'Открыть готовый сайт'/)
  assert.match(app, /VUE\.JS · FLUTTER · PYTHON/)
})
