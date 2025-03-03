// types
import type ISerializedAuthenticatorAssertionResponse from './ISerializedAuthenticatorAssertionResponse';
import type ISerializedAuthenticatorAttestationResponse from './ISerializedAuthenticatorAttestationResponse';

/**
 * @property {string} rawId - A base64 encoded string of the raw ID of the credential. On deserialization, it must be
 * converted to an `ArrayBuffer`.
 */
interface ISerializedPublicKeyCredential<
  Response extends
    | ISerializedAuthenticatorAssertionResponse
    | ISerializedAuthenticatorAttestationResponse
> {
  authenticatorAttachment: 'platform';
  rawId: string;
  response: Response;
  type: 'public-key';
}

export default ISerializedPublicKeyCredential;
