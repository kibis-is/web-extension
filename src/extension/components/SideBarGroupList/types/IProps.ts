// types
import type {
  IAccountGroup,
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
  ISystemInfo,
} from '@extension/types';

interface IProps {
  accounts: IAccountWithExtendedProps[];
  activeAccount: IAccountWithExtendedProps | null;
  groups: IAccountGroup[];
  isShortForm: boolean;
  network: INetworkWithTransactionParams;
  onAccountClick: (id: string) => void;
  onSort: (items: IAccountGroup[]) => void;
  systemInfo: ISystemInfo | null;
}

export default IProps;
