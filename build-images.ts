import { mkdirSync } from 'fs'
import sharp from 'sharp'

const OG_AVATAR_SIZE = 360
const OG_AVATAR_CX = 980
const OG_AVATAR_CY = 314

function ogBaseSvg(): Buffer {
  return Buffer.from(`<svg width="1200" height="627" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="627" fill="#f9f7f4"/>
    <rect x="0" y="0" width="8" height="627" fill="#a46220"/>
    <text x="80" y="210" font-family="sans-serif" font-size="72" font-weight="bold" fill="#2e2a26">Michael Crismali</text>
    <text x="80" y="285" font-family="sans-serif" font-size="36" fill="#6b6560">Full Stack Software Engineer</text>
    <text x="80" y="420" font-family="sans-serif" font-size="26" fill="#a46220">michaelcrismali.com</text>
    <text x="80" y="464" font-family="sans-serif" font-size="26" fill="#a46220">github.com/crismali</text>
  </svg>`)
}

function ogCircleMask(): Buffer {
  const size = OG_AVATAR_SIZE
  const half = size / 2
  return Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${half}" cy="${half}" r="${half}" fill="white"/></svg>`
  )
}

export async function processImages(src: string, out: string): Promise<void> {
  mkdirSync(`${out}/images`, { recursive: true })

  const lunaSource = `${src}/images/luna_napping.webp`
  const avatarSource = `${src}/images/avatar.webp`

  const [ogBase, ogAvatar] = await Promise.all([
    sharp(ogBaseSvg()).png().toBuffer(),
    sharp(avatarSource)
      .resize(OG_AVATAR_SIZE, OG_AVATAR_SIZE, { fit: 'cover', position: 'top' })
      .composite([{ input: ogCircleMask(), blend: 'dest-in' }])
      .png()
      .toBuffer(),
  ])

  await Promise.all([
    sharp(lunaSource).resize(400).webp().toFile(`${out}/images/luna_napping-400.webp`),
    sharp(lunaSource).resize(800).webp().toFile(`${out}/images/luna_napping-800.webp`),
    sharp(lunaSource).resize(400).png().toFile(`${out}/images/luna_napping-400.png`),
    sharp(avatarSource).resize(300).webp().toFile(`${out}/images/avatar.webp`),
    sharp(ogBase)
      .composite([
        {
          input: ogAvatar,
          left: OG_AVATAR_CX - OG_AVATAR_SIZE / 2,
          top: OG_AVATAR_CY - OG_AVATAR_SIZE / 2,
        },
      ])
      .png()
      .toFile(`${out}/images/og.png`),
  ])
}
