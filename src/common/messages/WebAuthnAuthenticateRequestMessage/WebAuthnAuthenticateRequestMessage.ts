// enums
import { WebAuthnMessageReferenceEnum } from '@common/enums';

// types
import type { IBaseRequestMessage } from '@common/types';
import type { IPayload } from './types';

export default class WebAuthnAuthenticateRequestMessage
  implements
    IBaseRequestMessage<
      WebAuthnMessageReferenceEnum.AuthenticateRequest,
      IPayload
    >
{
  public readonly id: string;
  public readonly payload: IPayload;
  public readonly reference: WebAuthnMessageReferenceEnum.AuthenticateRequest;

  constructor({
    id,
    payload,
    reference,
  }: IBaseRequestMessage<
    WebAuthnMessageReferenceEnum.AuthenticateRequest,
    IPayload
  >) {
    this.id = id;
    this.payload = payload;
    this.reference = reference;
  }
}
