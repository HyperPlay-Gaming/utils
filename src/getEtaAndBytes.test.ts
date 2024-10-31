import {
  getETAStringFromMs,
  calculateEtaFromBytes,
  formatTimeFromMs
} from './getEtaAndBytes'
describe('getETAStringFromMs', () => {
  test('should return "1s" for 1000 milliseconds', () => {
    expect(getETAStringFromMs(1000)).toBe('1s')
  })

  test('should return "1m:0s" for 60000 milliseconds', () => {
    expect(getETAStringFromMs(1000 * 60)).toBe('1m:0s')
  })

  test('should return "1h:0m" for 3600000 milliseconds', () => {
    expect(getETAStringFromMs(1000 * 60 * 60)).toBe('1h:0m')
  })

  test('should return "1d" for 86400000 milliseconds', () => {
    expect(getETAStringFromMs(1000 * 60 * 60 * 24)).toBe('1d')
  })

  test('should return "1d" for 90000000 milliseconds', () => {
    expect(getETAStringFromMs(1000 * 60 * 60 * 24 + 1000 * 60 * 60)).toBe('1d')
  })
})

describe('calculateEtaFromBytes', () => {
  test('should return "10s" for 0 bytes downloaded out of 10000000 bytes at 1000 bytes/second', () => {
    expect(calculateEtaFromBytes(0, 1000, 10000000)).toBe('10s')
  })

  test('should return "5s" for 5000 bytes downloaded out of 5000000 bytes at 1000 bytes/second', () => {
    expect(calculateEtaFromBytes(5000, 1000, 5000000)).toBe('5s')
  })

  test('should return "2h:46m" for 5000 bytes downloaded out of 1000000000 bytes at 100 bytes/second', () => {
    expect(calculateEtaFromBytes(5000, 100, 1000000000)).toBe('2h:46m')
  })

  test('should return "6d" for 1000 bytes downloaded out of 5500000000 bytes at 10 bytes/second', () => {
    expect(calculateEtaFromBytes(1000, 10, 5500000000)).toBe('6d')
  })

  test('should return null for infinite remaining seconds', () => {
    expect(calculateEtaFromBytes(0, 0, 10000)).toBeNull()
  })
})

describe('formatTimeFromMs', () => {
  test('should return "00:00:01" for 1 second', () => {
    expect(formatTimeFromMs(1)).toBe('00:00:01')
  })

  test('should return "00:01:00" for 60 seconds', () => {
    expect(formatTimeFromMs(60)).toBe('00:01:00')
  })

  test('should return "01:00:00" for 3600 seconds', () => {
    expect(formatTimeFromMs(3600)).toBe('01:00:00')
  })

  test('should return "24:00:00" for 86400 seconds', () => {
    expect(formatTimeFromMs(86400)).toBe('24:00:00')
  })

  test('should return "25:00:00" for 90000 seconds', () => {
    expect(formatTimeFromMs(86400 + 3600)).toBe('25:00:00')
  })

  test('should return "25:01:00" for 90060 seconds', () => {
    expect(formatTimeFromMs(86400 + 3600 + 60)).toBe('25:01:00')
  })
})
