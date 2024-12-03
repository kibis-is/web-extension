// types
import type ISerializedAttestationObject from './ISerializedAttestationObject';

/**
 * @property {ISerializedAttestationObject} attestationObject - The serialized `attestationObject` property.
 * @property {string} clientDataJSON - The JSON string of the public key `clientDataJSON` property.
 */
interface ISerializedAuthenticatorAttestationResponse {
  attestationObject: ISerializedAttestationObject;
  clientDataJSON: string;
}

export default ISerializedAuthenticatorAttestationResponse;
