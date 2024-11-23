// types
import type { IBaseComponentProps } from '@common/types';
import type { IAccountWithExtendedProps, IModalProps } from '@extension/types';

interface IAccountSelectModalProps {
  accounts: IAccountWithExtendedProps[];
  allowWatchAccounts?: boolean;
  isOpen: boolean;
  multiple?: boolean;
  onSelect: (accounts: IAccountWithExtendedProps[]) => void;
  title?: string;
}

type TAccountSelectModalProps = IAccountSelectModalProps &
  IBaseComponentProps &
  IModalProps;

export default TAccountSelectModalProps;
