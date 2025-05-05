// types
import type { IAccount, INetworkWithTransactionParams } from '@provider/types';

interface IOptions {
  account: IAccount;
  network: INetworkWithTransactionParams;
}

export default IOptions;
