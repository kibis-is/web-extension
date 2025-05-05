// types
import type { IBaseOptions } from '@common/types';
import type { IPasskeyCredential } from '@provider/types';

interface IEncryptBytesOptions extends IBaseOptions {
  bytes: Uint8Array;
  inputKeyMaterial: Uint8Array;
  passkey: IPasskeyCredential;
}

export default IEncryptBytesOptions;
