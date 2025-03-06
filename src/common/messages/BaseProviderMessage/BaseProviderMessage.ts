import { generate as generateUUID } from '@agoralabs-sh/uuid';

// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

export default class BaseProviderMessage {
  public readonly id: string;
  public readonly reference: ProviderMessageReferenceEnum;

  constructor(reference: ProviderMessageReferenceEnum) {
    this.id = generateUUID();
    this.reference = reference;
  }
}
