import type { Transaction } from 'algosdk';

// types
import type { IAccountWithExtendedProps } from '@extension/types';

interface ISignTransactionsWithPasskeyActionOptions {
  signer: IAccountWithExtendedProps;
  transactions: Transaction[];
}

export default ISignTransactionsWithPasskeyActionOptions;
