// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// types
import type {
  IClientInformation,
  ISerializedPublicKeyCredentialRequestOptions,
  IWebAuthnRequestMessage,
} from '@common/types';

export default class WebAuthnGetRequestMessage
  implements
    IWebAuthnRequestMessage<ISerializedPublicKeyCredentialRequestOptions>
{
  public readonly clientInfo: IClientInformation;
  public readonly id: string;
  public readonly options: ISerializedPublicKeyCredentialRequestOptions;
  public readonly reference: WebAuthnMessageReferenceEnum.GetRequest;

  constructor({
    clientInfo,
    id,
    options,
  }: IWebAuthnRequestMessage<ISerializedPublicKeyCredentialRequestOptions>) {
    this.clientInfo = clientInfo;
    this.id = id;
    this.options = options;
    this.reference = WebAuthnMessageReferenceEnum.GetRequest;
  }
}
