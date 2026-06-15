import { cpSync, rmSync, mkdirSync } from 'fs'
import path from 'path'
import * as sass from 'sass'
import { minify } from 'html-minifier-terser'
import subsetFont from 'subset-font'
import sharp from 'sharp'

const SRC = path.resolve(import.meta.dir, 'src')
const OUT = path.resolve(import.meta.dir, 'dist')

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

console.log('🔨 Building...')

// Get current git commit SHA
const gitProc = Bun.spawn(['git', 'rev-parse', '--short', 'HEAD'])
const buildSha = (await new Response(gitProc.stdout).text()).trim()

// Bundle JS/TS
const result = await Bun.build({
  entrypoints: [`${SRC}/ts/main.ts`],
  outdir: OUT,
  naming: 'main.js',
  target: 'browser',
  minify: true,
  define: { __BUILD_SHA__: JSON.stringify(buildSha) },
})

if (!result.success) {
  for (const msg of result.logs) console.error(msg)
  process.exit(1)
}
console.log('⚡ JS bundled')

// Compile SCSS
const css = sass.compile(`${SRC}/styles/styles.scss`, { style: 'compressed' })
console.log('🎨 CSS compiled')

// Copy static assets (exclude TS, SCSS, font sources, and original luna images — those are resized below)
cpSync(SRC, OUT, {
  recursive: true,
  filter: (src: string) =>
    !src.includes('/ts') &&
    !src.includes('/styles') &&
    !src.includes('/_dist') &&
    !src.includes('/fonts') &&
    !src.includes('luna_napping') &&
    !src.endsWith('avatar.webp'),
})
console.log('📁 Assets copied')

// Resize images for production
mkdirSync(`${OUT}/images`, { recursive: true })
const lunaSource = `${SRC}/images/luna_napping.webp`
await Promise.all([
  sharp(lunaSource).resize(400).webp().toFile(`${OUT}/images/luna_napping-400.webp`),
  sharp(lunaSource).resize(800).webp().toFile(`${OUT}/images/luna_napping-800.webp`),
  sharp(lunaSource).resize(400).png().toFile(`${OUT}/images/luna_napping-400.png`),
  sharp(`${SRC}/images/avatar.webp`).resize(300).webp().toFile(`${OUT}/images/avatar.webp`),
])
console.log('🖼️ Images resized')

// Rewrite script src and minify HTML
const htmlPath = `${OUT}/index.html`
const html = await Bun.file(htmlPath).text()
const minifiedHtml = await minify(
  html
    .replace('src="ts/main.ts"', 'src="main.js"')
    .replace('<link rel="stylesheet" href="styles.css" />', `<style>${css.css}</style>`),
  {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
  }
)
await Bun.write(htmlPath, minifiedHtml)
console.log('📄 HTML minified + CSS inlined')

// Subset fonts to characters used in the HTML + CSS
const characters = [...new Set(minifiedHtml + css.css)].join('')

const fonts = [
  { src: 'dm-sans-normal.woff2', dest: 'dm-sans-normal.woff2' },
  { src: 'dm-sans-italic.woff2', dest: 'dm-sans-italic.woff2' },
  { src: 'nunito.woff2', dest: 'nunito.woff2' },
]

mkdirSync(`${OUT}/fonts`, { recursive: true })

for (const font of fonts) {
  const input = await Bun.file(`${SRC}/fonts/${font.src}`).bytes()
  const subsetted = await subsetFont(Buffer.from(input), characters, { targetFormat: 'woff2' })
  await Bun.write(`${OUT}/fonts/${font.dest}`, subsetted)
}
console.log('🔤 Fonts subsetted')

console.log('✅ Built → dist/')
