import {
  getPlayStreakDays,
  GetPlayStreakDaysArgs,
  GetPlayStreakDaysReturn,
  oneDayInMs,
  getPlaytimePercentage
} from './playstreak'

describe('get playstreak test', () => {
  describe('getPlaytimePercentage', () => {
    test('10%', () => {
      const now = new Date().toUTCString()
      const percentage = getPlaytimePercentage({
        minimumSessionTimeInSeconds: 1000,
        accumulatedPlaytimeTodayInSeconds: 100,
        lastPlaySessionCompletedDateTimeUTC: now
      })
      expect(percentage).toEqual(10)
    })

    test('> 100%', () => {
      const now = new Date().toUTCString()
      const percentage = getPlaytimePercentage({
        minimumSessionTimeInSeconds: 1000,
        accumulatedPlaytimeTodayInSeconds: 10000,
        lastPlaySessionCompletedDateTimeUTC: now
      })
      expect(percentage).toEqual(100)
    })

    test('< 0%', () => {
      const now = new Date().toUTCString()
      const percentage = getPlaytimePercentage({
        minimumSessionTimeInSeconds: 1000,
        accumulatedPlaytimeTodayInSeconds: -100,
        lastPlaySessionCompletedDateTimeUTC: now
      })
      expect(percentage).toEqual(0)
    })

    test('= 0% when timestamp is > 1 UTC day old', () => {
      const old = new Date(Date.now() - 2 * oneDayInMs).toUTCString()
      const percentage = getPlaytimePercentage({
        minimumSessionTimeInSeconds: 1000,
        accumulatedPlaytimeTodayInSeconds: 951,
        lastPlaySessionCompletedDateTimeUTC: old
      })
      expect(percentage).toEqual(0)
    })

    test('add unrecorded playtime', () => {
      const twoHoursAgo = new Date(Date.now() - 1000 * 3600 * 2).toUTCString()
      const now = Date.now()
      jest.useFakeTimers().setSystemTime(new Date(Date.now() + 1000 * 45))
      const percentage = getPlaytimePercentage({
        minimumSessionTimeInSeconds: 100,
        accumulatedPlaytimeTodayInSeconds: 10,
        lastPlaySessionCompletedDateTimeUTC: twoHoursAgo,
        dateTimeCurrentSessionStartedInMsSinceEpoch: now
      })
      expect(percentage).toEqual(55)
    })
  })

  describe('getPlayStreak', () => {
    function testGetPlaystreakDays(
      args: GetPlayStreakDaysArgs,
      expectedResult: GetPlayStreakDaysReturn
    ) {
      expect(getPlayStreakDays(args)).toEqual(expectedResult)
    }

    test('3 out of 7 days', () => {
      const now = new Date().toUTCString()
      testGetPlaystreakDays(
        {
          lastPlaySessionCompletedDateTimeUTC: now,
          requiredStreakInDays: 7,
          currentStreakInDays: 3
        },
        {
          currentStreakInDays: 3,
          requiredStreakInDays: 7
        }
      )
    })

    test('3 out of 7 days but > 2 day UTC old timestamp', () => {
      const old = new Date(Date.now() - 2 * oneDayInMs).toUTCString()
      testGetPlaystreakDays(
        {
          lastPlaySessionCompletedDateTimeUTC: old,
          requiredStreakInDays: 7,
          currentStreakInDays: 3
        },
        {
          currentStreakInDays: 0,
          requiredStreakInDays: 7
        }
      )
    })

    test('3 out of 7 days but 1 day UTC old timestamp', () => {
      const old = new Date(Date.now() - 1 * oneDayInMs).toUTCString()
      testGetPlaystreakDays(
        {
          lastPlaySessionCompletedDateTimeUTC: old,
          requiredStreakInDays: 7,
          currentStreakInDays: 3
        },
        {
          currentStreakInDays: 3,
          requiredStreakInDays: 7
        }
      )
    })

    test('8 out of 7 days', () => {
      const now = new Date().toUTCString()
      testGetPlaystreakDays(
        {
          lastPlaySessionCompletedDateTimeUTC: now,
          requiredStreakInDays: 7,
          currentStreakInDays: 8
        },
        {
          currentStreakInDays: 7,
          requiredStreakInDays: 7
        }
      )
    })

    test('8 out of 7 days but 2 days old', () => {
      const old = new Date(Date.now() - 2 * oneDayInMs).toUTCString()
      testGetPlaystreakDays(
        {
          lastPlaySessionCompletedDateTimeUTC: old,
          requiredStreakInDays: 7,
          currentStreakInDays: 8
        },
        {
          currentStreakInDays: 7,
          requiredStreakInDays: 7
        }
      )
    })

    test('7 out of 7 days but 2 days old', () => {
      const old = new Date(Date.now() - 2 * oneDayInMs).toUTCString()
      testGetPlaystreakDays(
        {
          lastPlaySessionCompletedDateTimeUTC: old,
          requiredStreakInDays: 7,
          currentStreakInDays: 7
        },
        {
          currentStreakInDays: 7,
          requiredStreakInDays: 7
        }
      )
    })
  })
})

export {}
