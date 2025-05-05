// types
import type IAVMAssetHolding from './IAVMAssetHolding';

interface IAVMAccountInformation {
  address: string;
  amount: bigint;
  assets: IAVMAssetHolding[];
  ['auth-addr']?: string;
  ['min-balance']: bigint;
}

export default IAVMAccountInformation;
