import { watch, mkdirSync } from 'fs'
import path from 'path'
import * as sass from 'sass'

const SRC = path.resolve(import.meta.dir, 'src')
const PORT = Number(process.env.PORT ?? 3000)

mkdirSync(`${SRC}/_dist`, { recursive: true })

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

await Promise.all([buildJS(), buildCSS()])

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

console.log(`🚀 Dev server: http://localhost:${PORT}`)

watch(`${SRC}/ts`, { recursive: true }, async (_event: string, filename: string | null) => {
  if (!filename) return
  try {
    await buildJS()
    console.log('⚡ JS rebuilt')
  } catch (error) {
    console.error('⚠️ JS build failed:', error)
  }
})

watch(`${SRC}/styles`, { recursive: true }, async (_event: string, filename: string | null) => {
  if (!filename) return
  try {
    await buildCSS()
    console.log('🎨 CSS rebuilt')
  } catch (error) {
    console.error('⚠️ CSS build failed:', error)
  }
})
