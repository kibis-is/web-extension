// types
import type { ISignTransactionState } from '@extension/types';
import type ISignTransactionsWithPasskeyActionOptions from './ISignTransactionsWithPasskeyActionOptions';

interface IState {
  reset: () => void;
  signTransactionStates: ISignTransactionState[];
  signTransactionsWithPasskeyAction: (
    options: ISignTransactionsWithPasskeyActionOptions
  ) => Promise<Uint8Array[]>;
}

export default IState;
