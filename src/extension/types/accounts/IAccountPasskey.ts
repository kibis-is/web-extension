// types
import type IAccountPasskeyRelayingParty from './IAccountPasskeyRelayingParty';
import type IAccountPasskeyUser from './IAccountPasskeyUser';

/**
 * @property {-8} alg - The COSE algorithm identifier. **MUST** be -8 to indicate the Ed25519.
 * @property {string} createdAt - A timestamp (in milliseconds) when this passkey created.
 * @property {string} id - The ID of the credential.
 * @property {string} lastUsedAt -A timestamp (in milliseconds) for when the passkey was last used.
 * @see {@link https://www.iana.org/assignments/cose/cose.xhtml#algorithms}
 */
interface IAccountPasskey {
  alg: -8;
  createdAt: string;
  id: string;
  lastUsedAt: string;
  origin: string;
  rp: IAccountPasskeyRelayingParty;
  user: IAccountPasskeyUser;
}

export default IAccountPasskey;
