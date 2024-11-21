import type { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// enums
import { EventTypeEnum } from '@extension/enums';

// types
import type IBaseEvent from './IBaseEvent';
import type IAVMWebProviderRequestEventPayload from './IAVMWebProviderRequestEventPayload';

interface IAVMWebProviderRequestEvent<Params extends TRequestParams>
  extends IBaseEvent<IAVMWebProviderRequestEventPayload<Params>> {
  type: EventTypeEnum.AVMWebProviderRequest;
}

export default IAVMWebProviderRequestEvent;
