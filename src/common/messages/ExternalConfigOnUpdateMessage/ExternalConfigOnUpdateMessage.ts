// enums
import { ExternalConfigMessageReferenceEnum } from '@common/enums';

// types
import type { IBaseMessage } from '@common/types';

export default class ExternalConfigOnUpdateMessage
  implements IBaseMessage<ExternalConfigMessageReferenceEnum.OnUpdate>
{
  public readonly id: string;
  public readonly reference: ExternalConfigMessageReferenceEnum.OnUpdate;

  constructor({
    id,
    reference,
  }: IBaseMessage<ExternalConfigMessageReferenceEnum.OnUpdate>) {
    this.id = id;
    this.reference = reference;
  }
}
