// types
import type {
  IClientInformation,
  ISerializedPublicKeyCredentialCreationOptions,
} from '@common/types';

interface IPayload {
  clientInfo: IClientInformation;
  options: ISerializedPublicKeyCredentialCreationOptions;
}

export default IPayload;
