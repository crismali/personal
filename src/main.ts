console.log('Site loaded')

function setCurrentYear() {
  const yearEl = document.getElementById('year')
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString()
}

function setContactLink() {
  const el = document.getElementById('contact-link')
  if (!el) return
  const parts = ['michael', '@', 'crismali', '.', 'com']
  const email = parts.join('')
  el.setAttribute('href', `mailto:${email}`)
}

setCurrentYear()
setContactLink()
