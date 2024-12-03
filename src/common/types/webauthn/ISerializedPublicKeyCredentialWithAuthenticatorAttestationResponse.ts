// types
import type ISerializedAuthenticatorAttestationResponse from './ISerializedAuthenticatorAttestationResponse';

/**
 * @property {string} id - A base64 URL safe encoded string of the raw ID of the credential.
 */
interface ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse {
  authenticatorAttachment: 'platform';
  id: string;
  response: ISerializedAuthenticatorAttestationResponse;
  type: 'public-key';
}

export default ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse;
