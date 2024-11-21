// enums
import { EventTypeEnum } from '@extension/enums';

// types
import type IBaseEvent from './IBaseEvent';
import type IWebAuthnRequestEventPayload from './IWebAuthnRequestEventPayload';

interface IWebAuthnRequestEvent
  extends IBaseEvent<IWebAuthnRequestEventPayload> {
  type: EventTypeEnum.WebAuthnRequest;
}

export default IWebAuthnRequestEvent;
