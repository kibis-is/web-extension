// types
import type {
  IClientInformation,
  ISerializedPublicKeyCredentialRequestOptions,
} from '@common/types';

interface IPayload {
  clientInfo: IClientInformation;
  options: ISerializedPublicKeyCredentialRequestOptions;
}

export default IPayload;
