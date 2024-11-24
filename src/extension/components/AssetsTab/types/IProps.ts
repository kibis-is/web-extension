// types
import type { IBaseComponentProps } from '@common/types';
import type { IAccount } from '@extension/types';

interface IProps extends IBaseComponentProps {
  account: IAccount;
}

export default IProps;
