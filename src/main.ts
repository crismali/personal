console.log('Site loaded')

function setCurrentYear() {
  const yearEl = document.getElementById('year')
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString()
}

setCurrentYear()
