// types
import type {
  IExternalAccount,
  ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse,
} from '@common/types';

/**
 * @property {IExternalAccount} account - The account used to create the credential.
 * @property {ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse} credential - The serialized public
 * key credential with an attestation response.
 */
interface IResult {
  account: IExternalAccount;
  credential: ISerializedPublicKeyCredentialWithAuthenticatorAttestationResponse;
}

export default IResult;
