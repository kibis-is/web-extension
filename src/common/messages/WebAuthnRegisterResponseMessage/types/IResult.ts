// types
import type {
  IExternalAccount,
  ISerializedAuthenticatorAttestationResponse,
  ISerializedPublicKeyCredential,
} from '@common/types';

/**
 * @property {IExternalAccount} account - The account used to create the credential.
 * @property {ISerializedPublicKeyCredential<ISerializedAuthenticatorAttestationResponse>} credential - The serialized public
 * key credential with an attestation response.
 */
interface IResult {
  account: IExternalAccount;
  credential: ISerializedPublicKeyCredential<ISerializedAuthenticatorAttestationResponse>;
}

export default IResult;
