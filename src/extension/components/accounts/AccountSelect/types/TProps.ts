// types
import type { IBaseComponentProps } from '@common/types';
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
  ISystemInfo,
} from '@extension/types';

interface IProps {
  accounts: IAccountWithExtendedProps[];
  allowWatchAccounts?: boolean;
  disabled?: boolean;
  label?: string;
  network: INetworkWithTransactionParams;
  onSelect: (account: IAccountWithExtendedProps) => void;
  required?: boolean;
  selectModalTitle?: string;
  systemInfo: ISystemInfo | null;
  value: IAccountWithExtendedProps | null;
}

type TProps = IBaseComponentProps & IProps;

export default TProps;
