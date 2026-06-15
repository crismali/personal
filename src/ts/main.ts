import { initTheme } from './theme'
import { initActiveNav } from './nav'
import { setYearsExperience, setCurrentYear, setContactLink } from './init'

declare const __BUILD_SHA__: string | undefined
const buildSha = typeof __BUILD_SHA__ !== 'undefined' ? ` (${__BUILD_SHA__})` : ''
console.log(`👋 Hey there! Really appreciate you poking around under the hood!${buildSha}`)

if (typeof document !== 'undefined') {
  setYearsExperience()
  setCurrentYear()
  setContactLink()
  initTheme()
  initActiveNav()
}
