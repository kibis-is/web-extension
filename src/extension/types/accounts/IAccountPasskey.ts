/**
 * @property {-8} algorithm - The algorithm of the public key. **MUST** be "-8" (Ed25519) for AVM accounts.
 * @property {string} credentialID - The ID of the credential on the passkey.
 * @property {string} credentialName - The name of the credential on the passkey.
 * @property {AuthenticatorTransport[]} transports - A list of capabilities of the passkey.
 * @property {string} userID - The identifier used to represent Kibisis on the passkey.
 */
interface IAccountPasskey {
  algorithm: -8;
  credentialID: string;
  credentialName: string;
  transports: AuthenticatorTransport[];
  userID: string;
}

export default IAccountPasskey;
