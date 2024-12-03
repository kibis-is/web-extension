// types
import type ISerializedAttestationStatement from './ISerializedAttestationStatement';

/**
 * @property {ISerializedAttestationStatement} attStmt - The serialized attestation statement.
 * @property {string} authData - A base64 encoded string of `authData` property.
 * @property {`none`} fmt - The JSON string of the public key `clientDataJSON` property.
 */
interface ISerializedAttestationObject {
  attStmt: ISerializedAttestationStatement;
  authData: string;
  fmt: 'none';
}

export default ISerializedAttestationObject;
