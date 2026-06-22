import { createHash } from 'crypto'

function hashAll(html: string, tag: 'script' | 'style'): string[] {
  // [\s\S]*? (lazy) rather than [^<]* — inline script/style content can legally
  // contain '<' (e.g. `a<b`); only an actual closing tag should end the match.
  const matches = [...html.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g'))]
  if (matches.length === 0) throw new Error(`No inline <${tag}> found to hash for CSP`)
  return matches.map((match) => createHash('sha256').update(match[1]).digest('base64'))
}

function asCspTokens(hashes: string[]): string {
  return hashes.map((hash) => `'sha256-${hash}'`).join(' ')
}

// Injects SHA-256 hashes of inline <script>/<style> blocks into the CSP headers
// so script-src/style-src can avoid 'unsafe-inline'.
export async function injectCspHashes(outDir: string, html: string): Promise<void> {
  const scriptHashes = hashAll(html, 'script')
  const styleHashes = hashAll(html, 'style')

  const headers = await Bun.file(`${outDir}/_headers`).text()
  await Bun.write(
    `${outDir}/_headers`,
    headers
      .replace('__INLINE_SCRIPT_HASH__', asCspTokens(scriptHashes))
      .replace('__INLINE_STYLE_HASHES__', asCspTokens(styleHashes))
  )
}
