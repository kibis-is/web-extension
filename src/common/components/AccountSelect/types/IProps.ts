// types
import type { IBaseComponentProps } from '@common/types';
import type { IAccountWithExtendedProps } from '@extension/types';

interface IProps extends IBaseComponentProps {
  accounts: IAccountWithExtendedProps[];
  allowWatchAccounts?: boolean;
  disabled?: boolean;
  label?: string;
  onSelect: (account: IAccountWithExtendedProps) => void;
  required?: boolean;
  selectModalTitle?: string;
  value: IAccountWithExtendedProps | null;
}

export default IProps;
