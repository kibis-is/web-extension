/**
 * @property {string} attestationObject - The base64 encoded string of the public key credential's `attestationObject`
 * property. On deserialization, it must be converted to an `ArrayBuffer`.
 * @property {string} clientDataJSON - The base64 encoded string of the public key credential's `clientDataJSON`
 * property. On deserialization, it must be converted to an `ArrayBuffer`.
 */
interface ISerializedAuthenticatorAttestationResponse {
  attestationObject: string;
  clientDataJSON: string;
}

export default ISerializedAuthenticatorAttestationResponse;
