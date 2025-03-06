// types
import type {
  IExternalAccount,
  ISerializedAuthenticatorAssertionResponse,
  ISerializedPublicKeyCredential,
} from '@common/types';

/**
 * @property {IExternalAccount} account - The account used to create the credential.
 * @property {ISerializedPublicKeyCredential<ISerializedAuthenticatorAssertionResponse>} credential - The serialized public
 * key credential with an assertion response.
 */
interface IResult {
  account: IExternalAccount;
  credential: ISerializedPublicKeyCredential<ISerializedAuthenticatorAssertionResponse>;
}

export default IResult;
