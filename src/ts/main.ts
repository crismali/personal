import { initTheme } from './theme'
import { initActiveNav } from './nav'

console.log('Site loaded')

function setCurrentYear() {
  const yearElement = document.getElementById('year')
  if (yearElement) yearElement.textContent = new Date().getFullYear().toString()
}

function setContactLink() {
  const link = document.getElementById('contact-link')
  if (!link) return
  const parts = ['michael', '@', 'crismali', '.', 'com']
  const email = parts.join('')
  link.setAttribute('href', `mailto:${email}`)
}

setCurrentYear()
setContactLink()
initTheme()
initActiveNav()
