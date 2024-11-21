// enums
import { EventTypeEnum } from '@extension/enums';

// events
import BaseEvent from './BaseEvent';

// types
import type {
  IWebAuthnRequestEvent,
  IWebAuthnRequestEventPayload,
} from '@extension/types';

export interface INewOptions {
  id: string;
  payload: IWebAuthnRequestEventPayload;
}

export default class WebAuthnRequestEvent
  extends BaseEvent<IWebAuthnRequestEventPayload>
  implements IWebAuthnRequestEvent
{
  public type: EventTypeEnum.WebAuthnRequest;

  constructor({ id, payload }: INewOptions) {
    super();

    this.id = id;
    this.payload = payload;
    this.type = EventTypeEnum.WebAuthnRequest;
  }
}
