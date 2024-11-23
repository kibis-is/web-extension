// types
import type { IExternalAccount } from '@external/types';

interface IState {
  accounts: IExternalAccount[];
  fetchAccountsAction: () => Promise<void>;
  fetching: boolean;
}

export default IState;
