// types
import ISerializedPublicKeyCredentialDescriptor from './ISerializedPublicKeyCredentialDescriptor';
import ISerializedPublicKeyCredentialUserEntity from './ISerializedPublicKeyCredentialUserEntity';

/**
 * @property {string} challenge - The challenge serialized to a base64 string.
 * @property {ISerializedPublicKeyCredentialDescriptor} excludeCredentials - A list of serialized credentials that may
 * already be mapped to the authenticator.
 * @property {ISerializedPublicKeyCredentialUserEntity} user - A serialized object describing the user account for which
 * the credential is generated.
 */
interface ISerializedPublicKeyCredentialCreationOptions
  extends Omit<
    PublicKeyCredentialCreationOptions,
    'challenge' | 'excludeCredentials' | 'user'
  > {
  challenge: string;
  excludeCredentials?: ISerializedPublicKeyCredentialDescriptor[];
  user: ISerializedPublicKeyCredentialUserEntity;
}

export default ISerializedPublicKeyCredentialCreationOptions;
