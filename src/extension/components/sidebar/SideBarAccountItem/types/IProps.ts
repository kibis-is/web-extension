// types
import type { IBaseComponentProps } from '@common/types';
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
  ISystemInfo,
} from '@extension/types';

/**
 * @property {boolean} isShortForm - Whether the full item is being shown or just the avatar.
 */
interface IProps extends IBaseComponentProps {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  active: boolean;
  isShortForm: boolean;
  network: INetworkWithTransactionParams;
  onAddToGroupClick?: (accountID: string) => void;
  onClick: (id: string) => void;
  onRemoveFromGroupClick?: (accountID: string) => void;
  systemInfo: ISystemInfo | null;
}

export default IProps;
