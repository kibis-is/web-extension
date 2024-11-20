import { Transaction } from 'algosdk';

// types
import type { IBaseOptions } from '@common/types';
import type { IAccount } from '@extension/types';

interface ISignTransactionOptions extends IBaseOptions {
  signer: IAccount;
  transaction: Transaction;
}

export default ISignTransactionOptions;
