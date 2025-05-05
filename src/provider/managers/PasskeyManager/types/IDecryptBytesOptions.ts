// types
import type { IBaseOptions } from '@common/types';
import type { IPasskeyCredential } from '@provider/types';

interface IDecryptBytesOptions extends IBaseOptions {
  encryptedBytes: Uint8Array;
  inputKeyMaterial: Uint8Array;
  passkey: IPasskeyCredential;
}

export default IDecryptBytesOptions;
