// types
import type { IBaseComponentProps } from '@common/types';
import type {
  IAccountGroup,
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
  ISystemInfo,
} from '@extension/types';

/**
 * @property {IAccountWithExtendedProps[]} accounts - All accounts.
 * @property {IAccountGroup} group - The group.
 * @property {boolean} isShortForm - Whether the full item is being shown or just the avatar.
 */
interface IProps extends IBaseComponentProps {
  accounts: IAccountWithExtendedProps[];
  activeAccountID: string | null;
  group: IAccountGroup;
  isShortForm: boolean;
  network: INetworkWithTransactionParams;
  onAccountClick: (id: string) => void;
  onAccountSort: (items: IAccountWithExtendedProps[]) => void;
  onRemoveAccountFromGroupClick: (accountID: string) => void;
  systemInfo: ISystemInfo | null;
}

export default IProps;
