import { describe, it, expect, beforeEach } from 'bun:test'
import { CAREER_START_YEAR, setYearsExperience, setCurrentYear, setContactLink } from '../main'

describe('CAREER_START_YEAR', () => {
  it('produces a reasonable years of experience count', () => {
    const years = new Date().getFullYear() - CAREER_START_YEAR
    expect(years).toBeGreaterThan(0)
    expect(years).toBeLessThan(50)
  })
})

describe('setYearsExperience', () => {
  beforeEach(() => {
    document.body.innerHTML = '<span id="years-experience">13</span>'
  })

  it('updates the element with the calculated years', () => {
    setYearsExperience()
    const expected = (new Date().getFullYear() - CAREER_START_YEAR).toString()
    expect(document.getElementById('years-experience')?.textContent).toBe(expected)
  })

  it('does nothing if the element is missing', () => {
    document.body.innerHTML = ''
    expect(() => setYearsExperience()).not.toThrow()
  })
})

describe('setCurrentYear', () => {
  beforeEach(() => {
    document.body.innerHTML = '<span id="year"></span>'
  })

  it('updates the element with the current year', () => {
    setCurrentYear()
    expect(document.getElementById('year')?.textContent).toBe(new Date().getFullYear().toString())
  })

  it('does nothing if the element is missing', () => {
    document.body.innerHTML = ''
    expect(() => setCurrentYear()).not.toThrow()
  })
})

describe('setContactLink', () => {
  beforeEach(() => {
    document.body.innerHTML = '<a id="contact-link">Email</a>'
  })

  it('sets the href to the correct mailto link', () => {
    setContactLink()
    expect(document.getElementById('contact-link')?.getAttribute('href')).toBe(
      'mailto:michael@crismali.com'
    )
  })

  it('does nothing if the element is missing', () => {
    document.body.innerHTML = ''
    expect(() => setContactLink()).not.toThrow()
  })
})
