// enums
import { EventTypeEnum } from '@extension/enums';

// types
import type { IBaseEvent } from '@extension/types';
import type { TPayload } from './types';

export default class ARC0300KeyRegistrationTransactionSendEvent
  implements
    IBaseEvent<TPayload, EventTypeEnum.ARC0300KeyRegistrationTransactionSend>
{
  public readonly id: string;
  public readonly payload: TPayload;
  public readonly type: EventTypeEnum.ARC0300KeyRegistrationTransactionSend;

  constructor({
    id,
    payload,
    type,
  }: IBaseEvent<
    TPayload,
    EventTypeEnum.ARC0300KeyRegistrationTransactionSend
  >) {
    this.id = id;
    this.payload = payload;
    this.type = type;
  }
}
