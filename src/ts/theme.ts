type Theme = 'light' | 'dark'

type ThemeOptions<T> = Record<Theme, T>

export function byTheme<T>(theme: Theme, options: ThemeOptions<T>): T {
  return options[theme]
}

function currentTheme(): Theme {
  const attribute = document.documentElement.getAttribute('data-theme')
  if (attribute === 'light' || attribute === 'dark') return attribute
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function updateButton(button: HTMLElement, theme: Theme) {
  button.textContent = byTheme(theme, { dark: '☀️', light: '🌙' })
  button.setAttribute(
    'aria-label',
    byTheme(theme, { dark: 'Switch to light mode', light: 'Switch to dark mode' })
  )
}

function handleThemeToggle(button: HTMLElement) {
  const next = byTheme<Theme>(currentTheme(), { dark: 'light', light: 'dark' })
  document.documentElement.setAttribute('data-theme', next)
  localStorage.setItem('theme', next)
  updateButton(button, next)
}

export function initTheme() {
  const button = document.getElementById('theme-toggle')
  if (!button) return

  const stored = localStorage.getItem('theme') as Theme | null
  if (stored) document.documentElement.setAttribute('data-theme', stored)

  updateButton(button, currentTheme())

  button.addEventListener('click', () => handleThemeToggle(button))
}
