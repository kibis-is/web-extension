// types
import type { IOptions } from './types';

/**
 * Utility function to use an ellipsis in the middle of an address. E.g
 * @param {string} address - the address to ellipse.
 * @param {IOptions} options - [optional] options to customise.
 * @returns {string} an ellipsed address.
 */
export default function ellipseAddress(
  address: string,
  options?: IOptions
): string {
  const defaultLength: number = 5;
  const start: number =
    options && options.start ? options.start : defaultLength;
  const end: number = options && options.end ? options.end : defaultLength;

  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
