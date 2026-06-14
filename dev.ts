import { watch } from 'fs'
import path from 'path'
import * as sass from 'sass'

const SRC = path.resolve(import.meta.dir, 'src')
const PORT = 3000

async function buildJS() {
  const result = await Bun.build({
    entrypoints: [`${SRC}/ts/main.ts`],
    outdir: `${SRC}/_dist`,
    naming: 'main.js',
    target: 'browser',
  })
  if (!result.success) {
    for (const msg of result.logs) console.error(msg)
  }
}

async function buildCSS() {
  const result = sass.compile(`${SRC}/styles/styles.scss`)
  await Bun.write(`${SRC}/_dist/styles.css`, result.css)
}

await buildJS()
await buildCSS()

Bun.serve({
  port: PORT,
  async fetch(req: Request) {
    const url = new URL(req.url)
    let pathname = url.pathname === '/' ? '/index.html' : url.pathname

    if (pathname === '/ts/main.ts') pathname = '/_dist/main.js'
    if (pathname === '/styles.css') pathname = '/_dist/styles.css'

    const file = Bun.file(`${SRC}${pathname}`)
    if (await file.exists()) {
      return new Response(file)
    }
    return new Response('Not found', { status: 404 })
  },
})

console.log(`Dev server: http://localhost:${PORT}`)

watch(`${SRC}/ts`, { recursive: true }, async (_: string, filename: string | null) => {
  if (!filename) return
  await buildJS()
  console.log('Rebuilt JS')
})

watch(`${SRC}/styles`, { recursive: true }, async (_: string, filename: string | null) => {
  if (!filename) return
  await buildCSS()
  console.log('Rebuilt CSS')
})
