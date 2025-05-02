/**
 * @property {number} decimals - [optional] decimals that will be displayed after the whole number. Defaults to 2.
 * @property {boolean} thousandSeparatedOnly - [optional] whether to use a thousand separated only for big numbers.
 * Defaults to false.
 */
interface IOptions {
  decimals?: number;
  thousandSeparatedOnly?: boolean;
}

export default IOptions;
