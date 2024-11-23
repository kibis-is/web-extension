// types
import type { IExternalAccount } from '@common/types';

interface IState {
  accounts: IExternalAccount[];
  fetchAccountsAction: () => Promise<void>;
  fetching: boolean;
}

export default IState;
