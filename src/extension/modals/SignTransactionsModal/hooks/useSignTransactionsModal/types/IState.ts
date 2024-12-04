import type { ISignTransactionsParams } from '@agoralabs-sh/avm-web-provider';

// events
import AVMWebProviderRequestEvent from '@extension/events/AVMWebProviderRequestEvent';

interface IState {
  event: AVMWebProviderRequestEvent<ISignTransactionsParams> | null;
}

export default IState;
