// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// types
import type {
  IClientInformation,
  IWebAuthnRequestMessage,
} from '@common/types';

export default class WebAuthnGetRequestMessage
  implements IWebAuthnRequestMessage<CredentialRequestOptions>
{
  public readonly clientInfo: IClientInformation;
  public readonly id: string;
  public readonly options: CredentialRequestOptions;
  public readonly reference: WebAuthnMessageReferenceEnum.GetRequest;

  constructor({
    clientInfo,
    id,
    options,
  }: IWebAuthnRequestMessage<CredentialRequestOptions>) {
    this.clientInfo = clientInfo;
    this.id = id;
    this.options = options;
    this.reference = WebAuthnMessageReferenceEnum.GetRequest;
  }
}
