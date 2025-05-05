// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// messages
import BaseProviderMessage from '@common/messages/BaseProviderMessage';

// types
import type { ISession } from '@provider/types';
import type { IPayload } from './types';

export default class ProviderSessionsUpdatedMessage extends BaseProviderMessage {
  public readonly payload: IPayload;

  constructor(sessions: ISession[]) {
    super(ProviderMessageReferenceEnum.SessionsUpdated);

    this.payload = {
      sessions,
    };
  }
}
