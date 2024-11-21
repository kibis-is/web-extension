import type { ISignTransactionsParams } from '@agoralabs-sh/avm-web-provider';

// types
import type { IAVMWebProviderRequestEvent } from '@extension/types';

interface IState {
  event: IAVMWebProviderRequestEvent<ISignTransactionsParams> | null;
}

export default IState;
