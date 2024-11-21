import type { ISignMessageParams } from '@agoralabs-sh/avm-web-provider';

// types
import type {
  IAccountWithExtendedProps,
  IAVMWebProviderRequestEvent,
} from '@extension/types';

interface IUseSignMessageModalState {
  authorizedAccounts: IAccountWithExtendedProps[] | null;
  event: IAVMWebProviderRequestEvent<ISignMessageParams> | null;
  signer: IAccountWithExtendedProps | null;
  setAuthorizedAccounts: (
    authorizedAccounts: IAccountWithExtendedProps[] | null
  ) => void;
  setSigner: (signer: IAccountWithExtendedProps | null) => void;
}

export default IUseSignMessageModalState;
