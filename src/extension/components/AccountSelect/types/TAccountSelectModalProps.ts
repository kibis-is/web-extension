// types
import type { IBaseComponentProps } from '@common/types';
import type {
  IAccountWithExtendedProps,
  IModalProps,
  INetworkWithTransactionParams,
  ISystemInfo,
} from '@extension/types';

interface IAccountSelectModalProps {
  accounts: IAccountWithExtendedProps[];
  allowWatchAccounts?: boolean;
  isOpen: boolean;
  multiple?: boolean;
  network: INetworkWithTransactionParams | null;
  onSelect: (accounts: IAccountWithExtendedProps[]) => void;
  systemInfo: ISystemInfo | null;
  title?: string;
}

type TAccountSelectModalProps = IAccountSelectModalProps &
  IBaseComponentProps &
  IModalProps;

export default TAccountSelectModalProps;
