// types
import type TAVMTransaction from './TAVMTransaction';

interface IAVMPendingTransactionResponse {
  ['application-index']?: bigint;
  ['asset-closing-amount']?: bigint;
  ['asset-index']?: bigint;
  ['close-rewards']?: bigint;
  ['closing-amount']?: bigint;
  ['confirmed-round']?: bigint;
  ['pool-error']: string;
  ['receiver-rewards']?: bigint;
  ['sender-rewards']?: bigint;
  ['txn ']: TAVMTransaction;
}

export default IAVMPendingTransactionResponse;
