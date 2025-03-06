// types
import type { IBaseComponentProps } from '@common/types';
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps extends IBaseComponentProps {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  fetching: boolean;
  network: INetworkWithTransactionParams;
  onRefreshClick: () => void;
  onScrollEnd: () => void;
  updating: boolean;
}

export default IProps;
