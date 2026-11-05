import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')
const domain = 'https://portfolio-tau-seven-199mu3aht5.vercel.app/'

test('publishes crawlable metadata for the production domain', async () => {
  const [html, robots, sitemap] = await Promise.all([
    read('index.html'),
    read('public/robots.txt'),
    read('public/sitemap.xml'),
  ])

  assert.match(html, /<meta name="robots" content="index, follow"/)
  assert.match(html, new RegExp(`<link rel="canonical" href="${domain}"`))
  assert.match(html, new RegExp(`<meta property="og:url" content="${domain}"`))
  assert.match(html, /"@type": "Organization"/)
  assert.match(robots, /User-agent: \*\nAllow: \//)
  assert.match(robots, /Sitemap: https:\/\/portfolio-tau-seven-199mu3aht5\.vercel\.app\/sitemap\.xml/)
  assert.match(sitemap, /<loc>https:\/\/portfolio-tau-seven-199mu3aht5\.vercel\.app\/<\/loc>/)
})
