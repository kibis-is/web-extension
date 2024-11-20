import type { Transaction } from 'algosdk';

// types
import type { TEncryptionCredentials } from '@extension/types';

interface ISignTransactionsThunkPayload {
  transactions: Transaction[];
}
type TSignTransactionsThunkPayload = ISignTransactionsThunkPayload &
  TEncryptionCredentials;

export default TSignTransactionsThunkPayload;
