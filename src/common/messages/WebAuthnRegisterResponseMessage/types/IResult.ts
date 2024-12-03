// types
import type { ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse } from '@common/types';

/**
 * @property {ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse} credential - The serialized public
 * key credential with an attestation response.
 */
interface IResult {
  credential: ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse;
}

export default IResult;
