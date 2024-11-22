// types
import ISerializedPublicKeyCredentialDescriptor from './ISerializedPublicKeyCredentialDescriptor';

/**
 * @property {ISerializedPublicKeyCredentialDescriptor} allowCredentials - An array of objects used to restrict the list
 * of acceptable credentials.
 * @property {string} challenge - The challenge serialized to a base64 string.
 */
interface ISerializedPublicKeyCredentialCreationOptions
  extends Omit<
    PublicKeyCredentialRequestOptions,
    'allowCredentials' | 'challenge'
  > {
  allowCredentials?: ISerializedPublicKeyCredentialDescriptor[];
  challenge: string;
}

export default ISerializedPublicKeyCredentialCreationOptions;
