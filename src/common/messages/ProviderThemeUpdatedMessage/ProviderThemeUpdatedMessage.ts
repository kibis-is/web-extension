// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// messages
import BaseProviderMessage from '@common/messages/BaseProviderMessage';

// types
import type { IExternalTheme } from '@common/types';
import type { IPayload } from './types';

export default class ProviderThemeUpdatedMessage extends BaseProviderMessage {
  public readonly payload: IPayload;

  constructor(theme: IExternalTheme) {
    super(ProviderMessageReferenceEnum.ThemeUpdated);

    this.payload = {
      theme,
    };
  }
}
