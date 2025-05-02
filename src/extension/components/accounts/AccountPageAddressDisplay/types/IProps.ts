// types
import type {
  IAccountWithExtendedProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps {
  account: IAccountWithExtendedProps;
  network: INetworkWithTransactionParams;
}

export default IProps;
