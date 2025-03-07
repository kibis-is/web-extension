// types
import type { ISerializedPublicKeyCredentialCreationOptions } from '@common/types';

interface IGenerateOptions {
  origin: string;
  privateKey: Uint8Array;
  publicKeyCreationOptions: ISerializedPublicKeyCredentialCreationOptions;
}

export default IGenerateOptions;
