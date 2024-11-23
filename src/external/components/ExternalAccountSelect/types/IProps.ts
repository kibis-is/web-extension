// types
import type { IBaseComponentProps, IExternalAccount } from '@common/types';

interface IProps extends IBaseComponentProps {
  accounts: IExternalAccount[];
  disabled?: boolean;
  label?: string;
  onSelect: (account: IExternalAccount) => void;
  required?: boolean;
  selectModalTitle?: string;
  value: IExternalAccount | null;
}

export default IProps;
