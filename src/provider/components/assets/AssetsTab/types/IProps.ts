// types
import type { IBaseComponentProps } from '@common/types';
import type { IAccount } from '@provider/types';

interface IProps extends IBaseComponentProps {
  account: IAccount;
}

export default IProps;
