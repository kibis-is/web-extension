// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// messages
import BaseProviderMessage from '@common/messages/BaseProviderMessage';

export default class ProviderFactoryResetMessage extends BaseProviderMessage {
  constructor() {
    super(ProviderMessageReferenceEnum.FactoryReset);
  }
}
