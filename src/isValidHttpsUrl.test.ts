import { isValidHttpsUrl } from './isValidHttpsUrl'

describe('isValidHttpsUrl', () => {
  it('should return true for a valid HTTPS URL', () => {
    expect(isValidHttpsUrl('https://example.com')).toBe(true)
  })

  it('should return false for an invalid URL', () => {
    expect(isValidHttpsUrl('invalid-url')).toBe(false)
  })

  it('should return false for a URL with a different protocol', () => {
    expect(isValidHttpsUrl('http://example.com')).toBe(false)
  })
})
