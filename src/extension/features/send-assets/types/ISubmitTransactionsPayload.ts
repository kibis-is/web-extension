import type { Transaction } from 'algosdk';

interface ISubmitTransactionsPayload {
  signedTransactions: Uint8Array[];
  transactions: Transaction[];
}

export default ISubmitTransactionsPayload;
