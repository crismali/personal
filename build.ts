import { cpSync, rmSync, mkdirSync } from 'fs'
import path from 'path'
import * as sass from 'sass'

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

// Copy static assets (exclude TS and SCSS source folders)
cpSync(SRC, OUT, {
  recursive: true,
  filter: (src: string) =>
    !src.includes('/ts') && !src.includes('/styles') && !src.includes('/_dist'),
})

// Rewrite script src in HTML
const htmlPath = `${OUT}/index.html`
const html = await Bun.file(htmlPath).text()
await Bun.write(htmlPath, html.replace('src="ts/main.ts"', 'src="main.js"'))

console.log('Built → dist/')
