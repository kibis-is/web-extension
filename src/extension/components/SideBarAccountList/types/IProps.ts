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
  isLoading: boolean;
  isShortForm: boolean;
  items: (IAccountWithExtendedProps | IAccountGroup)[];
  network: INetworkWithTransactionParams | null;
  onAccountClick: (id: string) => void;
  onSort: (items: (IAccountWithExtendedProps | IAccountGroup)[]) => void;
  systemInfo: ISystemInfo | null;
}

export default IProps;
