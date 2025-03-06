// enums
import { ExternalConfigMessageReferenceEnum } from '@common/enums';

// types
import type { IBaseMessage, IBaseRequestMessage } from '@common/types';

export default class ExternalConfigRequestMessage
  implements IBaseRequestMessage<ExternalConfigMessageReferenceEnum.Request>
{
  public readonly id: string;
  public readonly payload: null;
  public readonly reference: ExternalConfigMessageReferenceEnum.Request;

  constructor({
    id,
    reference,
  }: IBaseMessage<ExternalConfigMessageReferenceEnum.Request>) {
    this.id = id;
    this.payload = null;
    this.reference = reference;
  }
}
