import { Transaction } from 'algosdk';

// types
import type { IAccount, INetworkWithTransactionParams } from '@provider/types';

interface IOptions {
  account: IAccount;
  network: INetworkWithTransactionParams;
  transactions: Transaction[];
}

export default IOptions;
