import {
  BaseARC0027Error,
  type TRequestParams,
} from '@agoralabs-sh/avm-web-provider';

// events
import AVMWebProviderRequestEvent from '@extension/events/AVMWebProviderRequestEvent';

interface IBaseResponseThunkPayload<Params extends TRequestParams> {
  error: BaseARC0027Error | null;
  event: AVMWebProviderRequestEvent<Params>;
}

export default IBaseResponseThunkPayload;
