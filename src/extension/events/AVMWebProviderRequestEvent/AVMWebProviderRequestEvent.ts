import { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// enums
import { EventTypeEnum } from '@extension/enums';

// types
import type { IBaseEvent } from '@extension/types';
import type { TPayload } from './types';

export default class AVMWebProviderRequestEvent<Params extends TRequestParams>
  implements IBaseEvent<TPayload<Params>, EventTypeEnum.AVMWebProviderRequest>
{
  public readonly id: string;
  public readonly payload: TPayload<Params>;
  public readonly type: EventTypeEnum.AVMWebProviderRequest;

  constructor({
    id,
    payload,
    type,
  }: IBaseEvent<TPayload<Params>, EventTypeEnum.AVMWebProviderRequest>) {
    this.id = id;
    this.payload = payload;
    this.type = type;
  }
}
