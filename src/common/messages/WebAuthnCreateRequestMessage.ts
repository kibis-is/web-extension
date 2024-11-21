// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// types
import type {
  IClientInformation,
  IWebAuthnRequestMessage,
} from '@common/types';

export default class WebAuthnCreateRequestMessage
  implements IWebAuthnRequestMessage<CredentialCreationOptions>
{
  public readonly clientInfo: IClientInformation;
  public readonly id: string;
  public readonly options: CredentialCreationOptions;
  public readonly reference: WebAuthnMessageReferenceEnum.CreateRequest;

  constructor({
    clientInfo,
    id,
    options,
  }: IWebAuthnRequestMessage<CredentialCreationOptions>) {
    this.clientInfo = clientInfo;
    this.id = id;
    this.options = options;
    this.reference = WebAuthnMessageReferenceEnum.CreateRequest;
  }
}
