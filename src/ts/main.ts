import { initTheme } from './theme'
import { initActiveNav } from './nav'

console.log('Site loaded')

export const CAREER_START_YEAR = 2013

export function setYearsExperience() {
  const element = document.getElementById('years-experience')
  if (element) element.textContent = (new Date().getFullYear() - CAREER_START_YEAR).toString()
}

export function setCurrentYear() {
  const yearElement = document.getElementById('year')
  if (yearElement) yearElement.textContent = new Date().getFullYear().toString()
}

export function setContactLink() {
  const link = document.getElementById('contact-link')
  if (!link) return
  const parts = ['michael', '@', 'crismali', '.', 'com']
  const email = parts.join('')
  link.setAttribute('href', `mailto:${email}`)
}

if (typeof document !== 'undefined') {
  setYearsExperience()
  setCurrentYear()
  setContactLink()
  initTheme()
  initActiveNav()
}
