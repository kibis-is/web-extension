/**
 * @property {string} id - A base64 string for ID for the relaying party.
 */
interface ISerializedPublicKeyCredentialDescriptor
  extends Omit<PublicKeyCredentialDescriptor, 'id'> {
  id: string;
}

export default ISerializedPublicKeyCredentialDescriptor;
