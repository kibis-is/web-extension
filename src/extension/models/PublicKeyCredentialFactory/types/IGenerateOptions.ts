// cryptography
import Ed21559KeyPair from '@extension/cryptography/Ed21559KeyPair';

// types
import type { ISerializedPublicKeyCredentialCreationOptions } from '@common/types';

interface IGenerateOptions {
  keyPair: Ed21559KeyPair;
  origin: string;
  publicKeyCreationOptions: ISerializedPublicKeyCredentialCreationOptions;
}

export default IGenerateOptions;
