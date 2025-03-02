/**
 * Formats a timestamp to a locale date/time string.
 * @param {string | number} input - The timestamp as a number or as a stringified number.
 * @returns {string} The locale date/time string, e.g. 02/03/2025, 12:30:45
 */
export default function formatTimestamp(input: number | string): string {
  if (typeof input === 'string') {
    return new Date(parseInt(input)).toLocaleString();
  }

  return new Date(input).toLocaleString();
}
