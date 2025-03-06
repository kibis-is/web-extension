import type { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// messages
import AVMWebProviderRequestMessage from '@common/messages/AVMWebProviderRequestMessage';

// types
import type { IBaseMessageEventPayload } from '@extension/types';

type TPayload<Params extends TRequestParams> = IBaseMessageEventPayload<
  AVMWebProviderRequestMessage<Params>
>;

export default TPayload;
