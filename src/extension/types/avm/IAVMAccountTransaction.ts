// types
import type TAVMTransaction from './TAVMTransaction';

interface IAVMAccountTransaction {
  ['current-round']: bigint;
  ['next-token']?: string;
  transactions: TAVMTransaction[];
}

export default IAVMAccountTransaction;
