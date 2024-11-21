import {
  BaseARC0027Error,
  TRequestParams,
} from '@agoralabs-sh/avm-web-provider';

// events
import type { IAVMWebProviderRequestEvent } from '@extension/types';

interface IBaseResponseThunkPayload<RequestParams extends TRequestParams> {
  error: BaseARC0027Error | null;
  event: IAVMWebProviderRequestEvent<RequestParams>;
}

export default IBaseResponseThunkPayload;
