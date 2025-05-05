// repositories
import PasskeyCredentialRepository from '@provider/repositories/PasskeyCredentialRepository';

// types
import type { ISavePrivateKeyItemBaseOptions } from '@provider/types';

/**
 * @property {Uint8Array} inputKeyMaterial - the input key material used to derive the private key.
 * @property {PasskeyCredentialRepository} passkeyCredentialRepository - [optional] a passkey credential repository to use, if omitted a new one is created.
 */
interface IOptions extends ISavePrivateKeyItemBaseOptions {
  inputKeyMaterial: Uint8Array;
  passkeyCredentialRepository?: PasskeyCredentialRepository;
}

export default IOptions;
