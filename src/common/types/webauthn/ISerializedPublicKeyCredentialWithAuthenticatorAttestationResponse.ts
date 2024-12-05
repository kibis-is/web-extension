// types
import type ISerializedAuthenticatorAttestationResponse from './ISerializedAuthenticatorAttestationResponse';

/**
 * @property {string} rawId - A base64 encoded string of the raw ID of the credential. On deserialization, it must be
 * converted to an `ArrayBuffer`.
 */
interface ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse {
  authenticatorAttachment: 'platform';
  rawId: string;
  response: ISerializedAuthenticatorAttestationResponse;
  type: 'public-key';
}

export default ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse;
