// enums
import { EncryptionMethodEnum } from '@provider/enums';

interface ICreateOptions {
  encryptedPrivateKey: Uint8Array;
  encryptionID: string;
  encryptionMethod: EncryptionMethodEnum;
  privateKey?: Uint8Array;
  publicKey: Uint8Array;
}

export default ICreateOptions;
