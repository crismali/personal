import { describe, it, expect } from 'bun:test'
import { byTheme } from '../theme'

describe('byTheme', () => {
  it('returns the light value for light theme', () => {
    expect(byTheme('light', { light: '🌙', dark: '☀️' })).toBe('🌙')
  })

  it('returns the dark value for dark theme', () => {
    expect(byTheme('dark', { light: '🌙', dark: '☀️' })).toBe('☀️')
  })

  it('works with non-string values', () => {
    expect(byTheme('dark', { light: 1, dark: 2 })).toBe(2)
  })
})
