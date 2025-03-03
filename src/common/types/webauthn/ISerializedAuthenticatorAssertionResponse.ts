/**
 * @property {string} authenticatorData  - The base64 encoded string of the public key credential's `authenticatorData`
 * property. On deserialization, it must be converted to an `ArrayBuffer`.
 * @property {string} clientDataJSON - The base64 encoded string of the public key credential's `clientDataJSON`
 * property. On deserialization, it must be converted to an `ArrayBuffer`.
 * @property {string} signature - The base64 encoded string of the public key credential's `signature`
 * property. On deserialization, it must be converted to an `ArrayBuffer`.
 * @property {string} userHandle - The base64 encoded string of the public key credential's `userHandle`
 * property. On deserialization, it must be converted to an `ArrayBuffer`.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse}
 */
interface ISerializedAuthenticatorAssertionResponse {
  authenticatorData: string;
  clientDataJSON: string;
  signature: string;
  userHandle: string;
}

export default ISerializedAuthenticatorAssertionResponse;
