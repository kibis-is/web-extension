// types
import type { IBaseComponentProps } from '@common/types';
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
  ISystemInfo,
} from '@extension/types';

interface IProps extends IBaseComponentProps {
  accounts: IAccountWithExtendedProps[];
  allowWatchAccounts?: boolean;
  disabled?: boolean;
  label?: string;
  network: INetworkWithTransactionParams | null;
  onSelect: (account: IAccountWithExtendedProps) => void;
  required?: boolean;
  selectModalTitle?: string;
  systemInfo: ISystemInfo | null;
  value: IAccountWithExtendedProps | null;
}

export default IProps;
