// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// types
import type { IBaseMessage } from '@common/types';

export default class WebAuthnAccountsRequestMessage
  implements IBaseMessage<WebAuthnMessageReferenceEnum.AccountsRequest>
{
  public readonly id: string;
  public readonly reference: WebAuthnMessageReferenceEnum.AccountsRequest;

  constructor({
    id,
    reference,
  }: IBaseMessage<WebAuthnMessageReferenceEnum.AccountsRequest>) {
    this.id = id;
    this.reference = reference;
  }
}
