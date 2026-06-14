export function initActiveNav() {
  const sections = document.querySelectorAll<HTMLElement>('main section[id]')
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]')

  if (!sections.length || !navLinks.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const id = entry.target.getAttribute('id')
        for (const link of navLinks) {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`)
        }
      }
    },
    // Trigger when a section crosses the middle band of the viewport (between 40% and 45% from top)
    { rootMargin: '-40% 0px -55% 0px' }
  )

  for (const section of sections) {
    observer.observe(section)
  }
}
