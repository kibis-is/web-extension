// enums
import { EventTypeEnum } from '@provider/enums';

// messages
import WebAuthnRegisterRequestMessage from '@common/messages/WebAuthnRegisterRequestMessage';

// types
import type { IBaseEvent, IBaseMessageEventPayload } from '@provider/types';

export default class WebAuthnRegisterRequestEvent
  implements IBaseEvent<IBaseMessageEventPayload<WebAuthnRegisterRequestMessage>, EventTypeEnum.WebAuthnRegisterRequest>
{
  public readonly id: string;
  public readonly payload: IBaseMessageEventPayload<WebAuthnRegisterRequestMessage>;
  public readonly type: EventTypeEnum.WebAuthnRegisterRequest;

  constructor({
    id,
    payload,
    type,
  }: IBaseEvent<IBaseMessageEventPayload<WebAuthnRegisterRequestMessage>, EventTypeEnum.WebAuthnRegisterRequest>) {
    this.id = id;
    this.payload = payload;
    this.type = type;
  }
}
