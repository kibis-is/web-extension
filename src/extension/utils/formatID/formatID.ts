// utils
import ellipseAddress from '@common/utils/ellipseAddress';

/**
 * Formats an ID for human-readable format by ensuring it is short enough and, if specified, has the "#" symbol
 * prefixed.
 * @param {string} id - The ID to format.
 * @param {boolean} prefix - [optional] Whether to prefix a "#" symbol.
 * @returns {string} The ID shortened if necessary
 */
export default function formatID(id: string, prefix?: boolean): string {
  return `${prefix ? '#' : ''}${
    id.length <= 15
      ? id
      : ellipseAddress(id, {
          end: 5,
          start: 5,
        })
  }`;
}
