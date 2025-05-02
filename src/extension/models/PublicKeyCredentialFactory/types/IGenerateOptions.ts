// types
import type {
  IClientInformation,
  ISerializedPublicKeyCredentialCreationOptions,
} from '@common/types';

interface IGenerateOptions {
  clientInformation: IClientInformation;
  privateKey: Uint8Array;
  publicKeyCreationOptions: ISerializedPublicKeyCredentialCreationOptions;
}

export default IGenerateOptions;
