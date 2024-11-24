// types
import type { ISerializedPublicKeyCredentialCreationOptions } from '@common/types';

interface IPayload {
  options: ISerializedPublicKeyCredentialCreationOptions;
  publicKey: string;
}

export default IPayload;
