// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// messages
import BaseProviderMessage from '@common/messages/BaseProviderMessage';

export default class ProviderCredentialLockActivatedMessage extends BaseProviderMessage {
  constructor() {
    super(ProviderMessageReferenceEnum.CredentialLockActivated);
  }
}
