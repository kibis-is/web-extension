// types
import type IAVMAssetParams from './IAVMAssetParams';

interface IAVMAssetConfigTransaction {
  ['asset-id']: bigint;
  params: IAVMAssetParams;
}

export default IAVMAssetConfigTransaction;
