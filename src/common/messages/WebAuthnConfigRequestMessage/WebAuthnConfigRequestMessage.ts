// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// types
import type { IBaseMessage } from '@common/types';

export default class WebAuthnConfigRequestMessage
  implements IBaseMessage<WebAuthnMessageReferenceEnum.ConfigRequest>
{
  public readonly id: string;
  public readonly reference: WebAuthnMessageReferenceEnum.ConfigRequest;

  constructor({
    id,
    reference,
  }: IBaseMessage<WebAuthnMessageReferenceEnum.ConfigRequest>) {
    this.id = id;
    this.reference = reference;
  }
}
