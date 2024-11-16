// types
import type {
  IAccountGroup,
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
  ISystemInfo,
} from '@extension/types';

interface IProps {
  accounts: IAccountWithExtendedProps[];
  activeAccountID: string | null;
  groups: IAccountGroup[];
  isShortForm: boolean;
  network: INetworkWithTransactionParams;
  onAccountClick: (id: string) => void;
  onAccountSort: (items: IAccountWithExtendedProps[]) => void;
  onGroupSort: (items: IAccountGroup[]) => void;
  onRemoveAccountFromGroupClick: (accountID: string) => void;
  systemInfo: ISystemInfo | null;
}

export default IProps;
