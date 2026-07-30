export const CAREER_START_YEAR = 2013

export function setYearsExperience() {
  const element = document.getElementById('years-experience')
  if (element) element.textContent = (new Date().getFullYear() - CAREER_START_YEAR).toString()
}

export function setCurrentYear() {
  const yearElement = document.getElementById('year')
  if (yearElement) yearElement.textContent = new Date().getFullYear().toString()
}

function rot13(string: string): string {
  return string.replace(/[a-zA-Z]/g, (character) => {
    const base = character < 'a' ? 65 : 97
    return String.fromCharCode(((character.charCodeAt(0) - base + 13) % 26) + base)
  })
}

export function setContactLink() {
  const link = document.getElementById('contact-link')
  if (!link) return
  const encoded = 'zvpunry@pevfznyv.pbz'
  link.setAttribute('href', '#contact')
  link.addEventListener(
    'click',
    (event) => {
      event.preventDefault()
      link.setAttribute('href', `mailto:${rot13(encoded)}`)
      link.click()
    },
    { once: true }
  )
  // The link ships hidden and the fallback ships visible, so a script that never
  // runs — JS disabled, but also a CSP block or network failure — leaves a usable
  // message rather than a dead <a> with no href. Hiding the <li> rather than the
  // <a> keeps the flex row's 2rem gap from leaving a phantom slot.
  link.closest('li')?.removeAttribute('hidden')
  document.getElementById('contact-fallback')?.remove()
}
