// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// types
import type {
  IClientInformation,
  IWebAuthnRequestMessage,
  ISerializedPublicKeyCredentialCreationOptions,
} from '@common/types';

export default class WebAuthnCreateRequestMessage
  implements
    IWebAuthnRequestMessage<ISerializedPublicKeyCredentialCreationOptions>
{
  public readonly clientInfo: IClientInformation;
  public readonly id: string;
  public readonly options: ISerializedPublicKeyCredentialCreationOptions;
  public readonly reference: WebAuthnMessageReferenceEnum.CreateRequest;

  constructor({
    clientInfo,
    id,
    options,
  }: IWebAuthnRequestMessage<ISerializedPublicKeyCredentialCreationOptions>) {
    this.clientInfo = clientInfo;
    this.id = id;
    this.options = options;
    this.reference = WebAuthnMessageReferenceEnum.CreateRequest;
  }
}
