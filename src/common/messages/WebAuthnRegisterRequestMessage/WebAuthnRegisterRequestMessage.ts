// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// types
import type { IBaseRequestMessage } from '@common/types';
import type { IPayload } from './types';

export default class WebAuthnRegisterRequestMessage
  implements
    IBaseRequestMessage<WebAuthnMessageReferenceEnum.RegisterRequest, IPayload>
{
  public readonly id: string;
  public readonly payload: IPayload;
  public readonly reference: WebAuthnMessageReferenceEnum.RegisterRequest;

  constructor({
    id,
    payload,
    reference,
  }: IBaseRequestMessage<
    WebAuthnMessageReferenceEnum.RegisterRequest,
    IPayload
  >) {
    this.id = id;
    this.payload = payload;
    this.reference = reference;
  }
}
