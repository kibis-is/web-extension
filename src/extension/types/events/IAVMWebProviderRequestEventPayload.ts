import type { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// messages
import { AVMWebProviderRequestMessage } from '@common/messages';

interface IAVMWebProviderRequestEventPayload<Params extends TRequestParams> {
  message: AVMWebProviderRequestMessage<Params>;
  originTabId: number;
}

export default IAVMWebProviderRequestEventPayload;
