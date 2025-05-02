// types
import type { IBaseComponentProps } from '@common/types';
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
  ISystemInfo,
} from '@extension/types';

interface IProps extends IBaseComponentProps {
  accounts: IAccountWithExtendedProps[];
  activeAccountID: string | null;
  isShortForm: boolean;
  network: INetworkWithTransactionParams;
  onAccountClick: (id: string) => void;
  onAddToGroupClick: (accountID: string) => void;
  onSort: (items: IAccountWithExtendedProps[]) => void;
  systemInfo: ISystemInfo | null;
}

export default IProps;
