// types
import type { IBaseComponentProps } from '@common/types';
import type {
  IAccountGroup,
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
  ISystemInfo,
} from '@provider/types';

interface IProps extends IBaseComponentProps {
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
