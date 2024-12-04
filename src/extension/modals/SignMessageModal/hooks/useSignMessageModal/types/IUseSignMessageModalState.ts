import type { ISignMessageParams } from '@agoralabs-sh/avm-web-provider';

// events
import AVMWebProviderRequestEvent from '@extension/events/AVMWebProviderRequestEvent';

// types
import type { IAccountWithExtendedProps } from '@extension/types';

interface IUseSignMessageModalState {
  authorizedAccounts: IAccountWithExtendedProps[] | null;
  event: AVMWebProviderRequestEvent<ISignMessageParams> | null;
  signer: IAccountWithExtendedProps | null;
  setAuthorizedAccounts: (
    authorizedAccounts: IAccountWithExtendedProps[] | null
  ) => void;
  setSigner: (signer: IAccountWithExtendedProps | null) => void;
}

export default IUseSignMessageModalState;
