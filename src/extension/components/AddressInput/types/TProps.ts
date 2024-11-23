import type { InputProps } from '@chakra-ui/react';

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
  error?: string | null;
  id?: string;
  label?: string;
  network: INetworkWithTransactionParams | null;
  onSelect?: (value: string) => void;
  required?: boolean;
  selectButtonLabel?: string;
  selectModalTitle?: string;
  systemInfo: ISystemInfo | null;
  validate?: (value: string) => string | null;
}
type TProps = IProps & IBaseComponentProps & Omit<InputProps, 'onSelect'>;

export default TProps;
