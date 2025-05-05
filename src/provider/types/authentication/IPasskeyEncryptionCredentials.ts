// enums
import { EncryptionMethodEnum } from '@provider/enums';

// types
import type { IPasskeyCredential } from '@provider/types';

interface IPasskeyEncryptionCredentials {
  inputKeyMaterial: Uint8Array;
  passkey: IPasskeyCredential;
  type: EncryptionMethodEnum.Passkey;
}

export default IPasskeyEncryptionCredentials;
