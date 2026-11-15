/**
 * Gera public/og-cover.jpg (1200×630) — a capa que aparece no WhatsApp.
 * Usa a arte do título + unicórnio 3D sobre o pattern (sem foto da criança).
 * Uso: npm run og   (requer: npm i -D playwright && npx playwright install chromium)
 */
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { TITLE_ART, BACKGROUNDS, EVENT } from '../src/config/event.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(root + '/')
let chromium
try {
  ;({ chromium } = require('playwright'))
} catch {
  console.error('Instale o Playwright: npm i -D playwright && npx playwright install chromium')
  process.exit(1)
}
const data = (p) => {
  const f = path.join(root, 'public', p.replace(/^\//, ''))
  if (!p || !existsSync(f)) return ''
  const ext = path.extname(f).slice(1).replace('jpg', 'jpeg')
  return `data:image/${ext === 'svg' ? 'svg+xml' : ext};base64,${readFileSync(f).toString('base64')}`
}
const font = (pkg, file) => `data:font/woff2;base64,${readFileSync(path.join(root, 'node_modules/@fontsource', pkg, 'files', file)).toString('base64')}`

const bg = data(BACKGROUNDS.opening || BACKGROUNDS.finale || '')
const title = data(TITLE_ART.src || '')
const uni = data('/img/layla/layla-sentada.webp')
const layla = data('/img/layla/layla-acenando.webp')
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fredoka;font-weight:600;src:url(${font('fredoka', 'fredoka-latin-600-normal.woff2')})}
@font-face{font-family:Fredoka;font-weight:700;src:url(${font('fredoka', 'fredoka-latin-700-normal.woff2')})}
body{margin:0} .c{width:1200px;height:630px;position:relative;overflow:hidden;font-family:Fredoka;background:linear-gradient(160deg,#E9D9FB,#F6D6EC 50%,#F8CDE3)}
.bg{position:absolute;inset:0;background:url(${bg}) center/cover;opacity:.45}
.title{position:absolute;left:30px;top:40px;height:330px}
.layla{position:absolute;left:150px;bottom:20px;height:250px}
.card{position:absolute;right:50px;top:70px;width:640px;height:490px;border-radius:44px;background:#FFF8F0;border:10px solid #EBCB85;box-shadow:0 30px 60px -20px rgba(150,70,140,.55);text-align:center;box-sizing:border-box;padding:48px 40px}
.ola{font-size:78px;font-weight:700;color:#E0479A;line-height:1;text-shadow:0 4px 0 #fff,0 7px 0 rgba(214,160,205,.9)}
.t{font-size:44px;font-weight:700;color:#7B2E9E;line-height:1.2;margin-top:18px}
.n{font-size:96px;font-weight:700;color:#E0479A;line-height:1;margin-top:6px;text-transform:uppercase;text-shadow:0 4px 0 #fff,0 8px 0 rgba(214,160,205,.9)}
.btn{position:absolute;left:50%;transform:translateX(-50%);bottom:-46px;white-space:nowrap;background:linear-gradient(135deg,#e374ae,#ad84e3 55%,#6fb6d9);color:#fff;font-size:44px;font-weight:700;padding:18px 54px;border-radius:999px;border:7px solid #fff;box-shadow:0 14px 30px -10px rgba(150,60,140,.7)}
</style></head><body><div class="c">${bg ? '<div class="bg"></div>' : ''}
${title ? `<img class="title" src="${title}">` : ''}<img class="layla" src="${layla}">
<div class="card"><div class="ola">Olá!</div><div class="t">Você recebeu um convite<br>muito especial da</div><div class="n">${EVENT.childFirstName}!</div>
<div class="btn">👆 Clique aqui ✨</div></div></div></body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: path.join(root, 'public/og-convite-sophie.jpg'), type: 'jpeg', quality: 84 })
await page.setViewportSize({ width: 180, height: 180 })
await page.setContent(`<body style="margin:0;background:linear-gradient(160deg,#E6E0FA,#F8CDE3)"><img src="${uni}" style="width:180px;height:180px;object-fit:contain"></body>`, { waitUntil: 'load' })
await page.screenshot({ path: path.join(root, 'public/apple-touch-icon.png') })
await browser.close()
console.log('✓ public/og-cover.jpg e public/apple-touch-icon.png')
