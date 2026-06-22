import { createHash } from 'crypto'

function hashAll(html: string, tag: 'script' | 'style'): string[] {
  const matches = [...html.matchAll(new RegExp(`<${tag}>([^<]*)</${tag}>`, 'g'))]
  if (matches.length === 0) throw new Error(`No inline <${tag}> found to hash for CSP`)
  return matches.map((match) => createHash('sha256').update(match[1]).digest('base64'))
}

// Injects SHA-256 hashes of inline <script>/<style> blocks into the CSP headers
// so script-src/style-src can avoid 'unsafe-inline'.
export async function injectCspHashes(outDir: string, html: string): Promise<void> {
  const [scriptHash] = hashAll(html, 'script')
  const styleHashes = hashAll(html, 'style')

  const headers = await Bun.file(`${outDir}/_headers`).text()
  await Bun.write(
    `${outDir}/_headers`,
    headers
      .replace('__INLINE_SCRIPT_HASH__', `sha256-${scriptHash}`)
      .replace('__INLINE_STYLE_HASHES__', styleHashes.map((hash) => `'sha256-${hash}'`).join(' '))
  )
}
