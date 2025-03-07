// types
import type IAccountPasskeyRelayingParty from './IAccountPasskeyRelayingParty';
import type IAccountPasskeyUser from './IAccountPasskeyUser';

/**
 * @property {number} alg - The COSE algorithm identifier. **SHOULD** be -7 (ES256) or -8 (Ed25519).
 * @property {string} createdAt - A timestamp (in milliseconds) when this passkey created.
 * @property {string} id - The ID of the credential.
 * @property {string} lastUsedAt -A timestamp (in milliseconds) for when the passkey was last used.
 * @see {@link https://www.iana.org/assignments/cose/cose.xhtml#algorithms}
 */
interface IAccountPasskey {
  alg: number;
  createdAt: string;
  id: string;
  lastUsedAt: string;
  origin: string;
  rp: IAccountPasskeyRelayingParty;
  user: IAccountPasskeyUser;
}

export default IAccountPasskey;
