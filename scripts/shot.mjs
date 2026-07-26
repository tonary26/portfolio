// Быстрый скриншот страницы через Playwright: node scripts/shot.mjs <out.png> [width] [height] [url]
import { chromium } from 'playwright'

const [out = 'output/playwright/shot.png', w = '390', h = '844', url = process.env.SHOT_URL || 'http://localhost:5173'] = process.argv.slice(2)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(3500)
await page.screenshot({ path: out })
for (const sel of ['.hero-title', '.hero-title__line:nth-child(1) > span', '.hero-title__line:nth-child(2) > span']) {
  console.log(sel, JSON.stringify(await page.locator(sel).boundingBox()))
}
await browser.close()
