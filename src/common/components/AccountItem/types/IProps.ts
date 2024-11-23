// types
import type { IBaseComponentProps, IExternalAccount } from '@common/types';
import type { IAccountWithExtendedProps } from '@extension/types';

interface IProps extends IBaseComponentProps {
  account: IAccountWithExtendedProps | IExternalAccount;
  subTextColor?: string;
  textColor?: string;
}

export default IProps;
