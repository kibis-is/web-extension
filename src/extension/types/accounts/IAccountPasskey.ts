/**
 * @property {-8} alg - The COSE algorithm identifier. **MUST** be -8 to indicate the Ed25519.
 * @property {string} createdAt - A timestamp (in milliseconds) when this passkey created.
 * @property {"none"} fmt - Indicates the format of the attStmt.
 * @property {string} id - The ID of the credential.
 * @property {string} lastUsedAt -A timestamp (in milliseconds) for when the passkey was last used.
 * @see {@link https://www.iana.org/assignments/cose/cose.xhtml#algorithms}
 */
interface IAccountPasskey {
  alg: -8;
  createdAt: string;
  fmt: 'none';
  id: string;
  lastUsedAt: string;
  rpID: string;
}

export default IAccountPasskey;
