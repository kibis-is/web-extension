/**
 * Convenience function that converts a string value to kebab-case.
 * @param {string} value - a string to convert.
 * @returns {string} the converted value to kebab-case.
 */
export default function convertToKebabCase(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_',"!?<>£$%^&*()+={}]+/g, '-') // replace whitespace and ',"!?<>£$%^&*()+={} with a hyphen "-"
    .replace(/^-+|-+$/g, '') // trim any hyphens from the beginning and end of the string
    .toLowerCase();
}
