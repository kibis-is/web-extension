import type { ReactElement } from 'react';

// types
import type { IProps as ISideBarAccountItemProps } from '@extension/components/SideBarAccountItem';

// types
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
interface IProps {
  activeAccountID: string | null;
  accounts: IAccountWithExtendedProps[];
  children:
    | ReactElement<ISideBarAccountItemProps>
    | ReactElement<ISideBarAccountItemProps>[]
    | null;
  defaultIsOpen?: boolean;
  group: IAccountGroup;
  isShortForm: boolean;
  network: INetworkWithTransactionParams;
  onAccountClick: (id: string) => void;
  systemInfo: ISystemInfo | null;
}

export default IProps;
