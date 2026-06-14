import { cpSync, rmSync, mkdirSync } from 'fs'
import path from 'path'
import * as sass from 'sass'
import { minify } from 'html-minifier-terser'
import subsetFont from 'subset-font'

const SRC = path.resolve(import.meta.dir, 'src')
const OUT = path.resolve(import.meta.dir, 'dist')

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

// Bundle JS/TS
const result = await Bun.build({
  entrypoints: [`${SRC}/ts/main.ts`],
  outdir: OUT,
  naming: 'main.js',
  target: 'browser',
  minify: true,
})

if (!result.success) {
  for (const msg of result.logs) console.error(msg)
  process.exit(1)
}

// Compile SCSS
const css = sass.compile(`${SRC}/styles/styles.scss`, { style: 'compressed' })
await Bun.write(`${OUT}/styles.css`, css.css)

// Copy static assets (exclude TS, SCSS, and font source folders — fonts are subsetted below)
cpSync(SRC, OUT, {
  recursive: true,
  filter: (src: string) =>
    !src.includes('/ts') &&
    !src.includes('/styles') &&
    !src.includes('/_dist') &&
    !src.includes('/fonts'),
})

// Rewrite script src and minify HTML
const htmlPath = `${OUT}/index.html`
const html = await Bun.file(htmlPath).text()
const minifiedHtml = await minify(html.replace('src="ts/main.ts"', 'src="main.js"'), {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
})
await Bun.write(htmlPath, minifiedHtml)

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

console.log('Built → dist/')
