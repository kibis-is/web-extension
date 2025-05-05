import { Transaction } from 'algosdk';

// types
import type { IBaseOptions } from '@common/types';
import type { IAccount, INetworkWithTransactionParams } from '@provider/types';

interface IOptions extends IBaseOptions {
  account: IAccount;
  network: INetworkWithTransactionParams;
  transactions: Transaction[];
}

export default IOptions;
