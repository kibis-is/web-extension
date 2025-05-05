import type { Transaction } from 'algosdk';

// types
import type { TEncryptionCredentials } from '@provider/types';

interface ISubmitTransactionsThunkPayload {
  transactions: Transaction[];
}

type TSubmitTransactionsThunkPayload = ISubmitTransactionsThunkPayload & TEncryptionCredentials;

export default TSubmitTransactionsThunkPayload;
