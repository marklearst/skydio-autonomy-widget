/**
 * Formats a number of seconds as a time string (MM:SS or H:MM:SS).
 *
 * @param sec - The number of seconds to format.
 * @returns {string} The formatted time string.
 *
 * @example
 * formatTime(65) // '1:05'
 * formatTime(3661) // '1:01:01'
 */
export function formatTime(sec: number): string {
  const seconds = Math.max(0, Math.floor(sec))
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}
