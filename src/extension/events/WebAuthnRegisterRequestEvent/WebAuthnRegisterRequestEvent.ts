// enums
import { EventTypeEnum } from '@extension/enums';

// types
import type { IBaseEvent } from '@extension/types';
import type { TPayload } from './types';

export default class WebAuthnRegisterRequestEvent
  implements IBaseEvent<TPayload, EventTypeEnum.WebAuthnRegisterRequest>
{
  public readonly id: string;
  public readonly payload: TPayload;
  public readonly type: EventTypeEnum.WebAuthnRegisterRequest;

  constructor({
    id,
    payload,
    type,
  }: IBaseEvent<TPayload, EventTypeEnum.WebAuthnRegisterRequest>) {
    this.id = id;
    this.payload = payload;
    this.type = type;
  }
}
