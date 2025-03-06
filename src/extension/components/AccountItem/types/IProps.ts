// types
import type { IBaseComponentProps } from '@common/types';
import type { IAccountWithExtendedProps } from '@extension/types';

interface IProps extends IBaseComponentProps {
  account: IAccountWithExtendedProps;
  subTextColor?: string;
  textColor?: string;
}

export default IProps;
