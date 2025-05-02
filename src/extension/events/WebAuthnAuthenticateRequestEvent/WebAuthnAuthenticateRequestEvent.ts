// enums
import { EventTypeEnum } from '@extension/enums';

// messages
import WebAuthnAuthenticateRequestMessage from '@common/messages/WebAuthnAuthenticateRequestMessage';

// types
import type { IBaseEvent, IBaseMessageEventPayload } from '@extension/types';

export default class WebAuthnAuthenticateRequestEvent
  implements
    IBaseEvent<
      IBaseMessageEventPayload<WebAuthnAuthenticateRequestMessage>,
      EventTypeEnum.WebAuthnAuthenticateRequest
    >
{
  public readonly id: string;
  public readonly payload: IBaseMessageEventPayload<WebAuthnAuthenticateRequestMessage>;
  public readonly type: EventTypeEnum.WebAuthnAuthenticateRequest;

  constructor({
    id,
    payload,
    type,
  }: IBaseEvent<
    IBaseMessageEventPayload<WebAuthnAuthenticateRequestMessage>,
    EventTypeEnum.WebAuthnAuthenticateRequest
  >) {
    this.id = id;
    this.payload = payload;
    this.type = type;
  }
}
