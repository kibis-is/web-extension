import type { IEnableParams } from '@agoralabs-sh/avm-web-provider';

// events
import AVMWebProviderRequestEvent from '@extension/events/AVMWebProviderRequestEvent';

// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IUseEnableModalState {
  availableAccounts: IAccountWithExtendedProps[] | null;
  event: AVMWebProviderRequestEvent<IEnableParams> | null;
  network: INetworkWithTransactionParams | null;
  setAvailableAccounts: (accounts: IAccountWithExtendedProps[] | null) => void;
  setNetwork: (network: INetworkWithTransactionParams | null) => void;
}

export default IUseEnableModalState;
