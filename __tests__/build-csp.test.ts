import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { mkdtempSync, rmSync } from 'fs'
import { createHash } from 'crypto'
import { tmpdir } from 'os'
import path from 'path'
import { injectCspHashes } from '../build-csp'

let outDir: string

beforeEach(() => {
  outDir = mkdtempSync(path.join(tmpdir(), 'build-csp-test-'))
})

afterEach(() => {
  rmSync(outDir, { recursive: true, force: true })
})

async function writeHeaders(outDir: string): Promise<void> {
  await Bun.write(
    `${outDir}/_headers`,
    "script-src 'self' __INLINE_SCRIPT_HASH__\nstyle-src 'self' __INLINE_STYLE_HASHES__"
  )
}

function hashCount(headers: string, directive: 'script-src' | 'style-src'): number {
  const line = headers.split('\n').find((line) => line.startsWith(directive))
  return line?.match(/'sha256-[^']+'/g)?.length ?? 0
}

describe('injectCspHashes', () => {
  it('replaces the script and style placeholders with sha256 hashes', async () => {
    await writeHeaders(outDir)
    const html = '<script>const a = 1</script><style>body{color:red}</style>'

    await injectCspHashes(outDir, html)

    const headers = await Bun.file(`${outDir}/_headers`).text()
    expect(headers).toContain("script-src 'self' 'sha256-")
    expect(headers).toContain("style-src 'self' 'sha256-")
    expect(headers).not.toContain('__INLINE_SCRIPT_HASH__')
    expect(headers).not.toContain('__INLINE_STYLE_HASHES__')
  })

  it('produces a stable hash for identical content', async () => {
    await writeHeaders(outDir)
    const html = '<script>const a = 1</script><style>body{color:red}</style>'

    await injectCspHashes(outDir, html)
    const first = await Bun.file(`${outDir}/_headers`).text()

    await writeHeaders(outDir)
    await injectCspHashes(outDir, html)
    const second = await Bun.file(`${outDir}/_headers`).text()

    expect(first).toBe(second)
  })

  it('includes a hash per inline style block', async () => {
    await writeHeaders(outDir)
    const html = '<script>const a = 1</script><style>a{}</style><style>b{}</style>'

    await injectCspHashes(outDir, html)

    const headers = await Bun.file(`${outDir}/_headers`).text()
    expect(hashCount(headers, 'style-src')).toBe(2)
  })

  it('includes a hash per inline script block', async () => {
    await writeHeaders(outDir)
    const html = '<script>const a = 1</script><script>const b = 2</script><style>a{}</style>'

    await injectCspHashes(outDir, html)

    const headers = await Bun.file(`${outDir}/_headers`).text()
    expect(hashCount(headers, 'script-src')).toBe(2)
  })

  it('hashes content containing a literal "<" instead of truncating at it', async () => {
    await writeHeaders(outDir)
    // a minified comparison like `a<b` would previously break the [^<]* regex
    const html = '<script>if(a<b){c()}</script><style>a{}</style>'

    await injectCspHashes(outDir, html)

    const headers = await Bun.file(`${outDir}/_headers`).text()
    const expectedHash = createHash('sha256').update('if(a<b){c()}').digest('base64')
    expect(headers).toContain(`'sha256-${expectedHash}'`)
  })

  it('throws when no inline script is present', async () => {
    await writeHeaders(outDir)
    const html = '<style>body{color:red}</style>'

    await expect(injectCspHashes(outDir, html)).rejects.toThrow('No inline <script> found')
  })

  it('throws when no inline style is present', async () => {
    await writeHeaders(outDir)
    const html = '<script>const a = 1</script>'

    await expect(injectCspHashes(outDir, html)).rejects.toThrow('No inline <style> found')
  })
})
