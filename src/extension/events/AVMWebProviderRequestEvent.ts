import { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// enums
import { EventTypeEnum } from '@extension/enums';

// events
import BaseEvent from './BaseEvent';

// types
import type {
  IAVMWebProviderRequestEvent,
  IAVMWebProviderRequestEventPayload,
} from '@extension/types';

export interface INewOptions<Params extends TRequestParams> {
  id: string;
  payload: IAVMWebProviderRequestEventPayload<Params>;
}

export default class AVMWebProviderRequestEvent<Params extends TRequestParams>
  extends BaseEvent<IAVMWebProviderRequestEventPayload<Params>>
  implements IAVMWebProviderRequestEvent<Params>
{
  public type: EventTypeEnum.AVMWebProviderRequest;

  constructor({ id, payload }: INewOptions<Params>) {
    super();

    this.id = id;
    this.payload = payload;
    this.type = EventTypeEnum.AVMWebProviderRequest;
  }
}
