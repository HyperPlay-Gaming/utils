/**
 * Get a human-readable string from a number of milliseconds
 * @param etaInMs - The number of milliseconds
 * @returns A human-readable string
 * @example
 * getETAStringFromMs(1000) // '1s'
 * getETAStringFromMs(1000 * 60) // '1m:0s'
 * getETAStringFromMs(1000 * 60 * 60) // '1h:0m'
 * getETAStringFromMs(1000 * 60 * 60 * 24) // '1d'
 **/
export function getETAStringFromMs(etaInMs: number) {
  const totalSeconds = Math.round(etaInMs / 1000)
  const seconds = totalSeconds % 60
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const days = Math.floor(totalSeconds / 86400)

  if (days > 0) {
    if (days > 1000) {
      return '+1000d'
    }
    return `${days}d`
  } else if (hours > 0) {
    return `${hours}h:${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m:${seconds}s`
  } else {
    return `${seconds}s`
  }
}

/**
 * Calculate the estimated time of arrival (ETA) for a download
 * @param downloadedBytes - The number of bytes downloaded
 * @param downloadSpeed - The download speed in bytes per second
 * @param downloadSize - The total size of the download in bytes
 * @param lastProgressTime - The time of the last progress update in milliseconds
 * @returns A human-readable string in the format from getETAStringFromMs
 * @example
 * calculateEtaFromBytes(1, 1000, 10000) // '10s'
 * calculateEtaFromBytes(5000, 1000, 10000) // '5s'
 * calculateEtaFromBytes(15000, 10000, 10000000) // '16m:40s'
 * calculateEtaFromBytes(10000, 550, 1000000000) // '5d'
 **/
export function calculateEtaFromBytes(
  downloadedBytes: number,
  downloadSpeed: number,
  downloadSize: number,
  lastProgressTime: number = Date.now()
): string | null {
  // Calculate the remaining seconds
  const remainingBytes = downloadSize - downloadedBytes
  const elapsedSeconds = (Date.now() - lastProgressTime) / 1000
  const remainingSeconds = remainingBytes / downloadSpeed - elapsedSeconds

  // Check if the download has completed or failed
  if (remainingSeconds <= 0) {
    return '00:00:00'
  } else if (!isFinite(remainingSeconds)) {
    return null
  }

  // Format the remaining seconds as "hh:mm:ss"
  return getETAStringFromMs(Math.floor(remainingSeconds))
}

/**
 * Format a number of seconds as "hh:mm:ss"
 * @param seconds - The number of seconds
 * @returns A string in the format "hh:mm:ss"
 * @example
 * formatTime(1) // '00:00:01'
 * formatTime(60) // '00:01:00'
 * formatTime(3600) // '01:00:00'
 * formatTime(86400) // '24:00:00'
 * formatTime(86400 + 3600) // '25:00:00'
 * formatTime(86400 + 3600 + 60) // '25:01:00'
 **/
export function formatTimeFromMs(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - hours * 3600) / 60)
  const remainingSeconds = seconds - hours * 3600 - minutes * 60
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}
