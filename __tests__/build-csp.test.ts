import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { mkdtempSync, rmSync } from 'fs'
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
    "script-src 'self' '__INLINE_SCRIPT_HASH__'\nstyle-src 'self' __INLINE_STYLE_HASHES__"
  )
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
    const styleLine = headers.split('\n').find((line) => line.startsWith('style-src'))
    expect(styleLine?.match(/'sha256-[^']+'/g)).toHaveLength(2)
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
