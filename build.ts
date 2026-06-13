import { cpSync, rmSync, mkdirSync } from 'fs'
import path from 'path'

const SRC = path.resolve(import.meta.dir, 'src')
const OUT = path.resolve(import.meta.dir, 'dist')

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

// Bundle JS/TS
const result = await Bun.build({
  entrypoints: [`${SRC}/main.ts`],
  outdir: OUT,
  naming: 'main.js',
  minify: true,
})

if (!result.success) {
  for (const msg of result.logs) console.error(msg)
  process.exit(1)
}

// Copy static assets
cpSync(SRC, OUT, {
  recursive: true,
  filter: (src: string) => !src.endsWith('.ts') && !src.includes('/_dist'),
})

// Rewrite script src in HTML
const htmlPath = `${OUT}/index.html`
const html = await Bun.file(htmlPath).text()
await Bun.write(htmlPath, html.replace('src="main.ts"', 'src="main.js"'))

console.log('Built → dist/')
