export function isValidHttpsUrl(url: string) {
  try {
    const newUrl = new URL(url)
    return newUrl.protocol === 'https:'
  } catch (err) {
    return false
  }
}
