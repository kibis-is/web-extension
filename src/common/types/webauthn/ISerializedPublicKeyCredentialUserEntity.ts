/**
 * @property {string} id - A base64 encoded representing a unique ID for the user account.
 */
interface ISerializedPublicKeyCredentialUserEntity
  extends Omit<PublicKeyCredentialUserEntity, 'id'> {
  id: string;
}

export default ISerializedPublicKeyCredentialUserEntity;
