// types
import type { IAccountWithExtendedProps, INetworkWithTransactionParams } from '@provider/types';

interface IProps {
  account: IAccountWithExtendedProps;
  network: INetworkWithTransactionParams;
}

export default IProps;
