/**
 * @property {Uint8Array} bytes - The bytes that were used in the signing.
 * @property {Uint8Array} signature - The signature that was the result of the signing of the bytes.
 */
interface IVerifyOptions {
  bytes: Uint8Array;
  signature: Uint8Array;
}

export default IVerifyOptions;
