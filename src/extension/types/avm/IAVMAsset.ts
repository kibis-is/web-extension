// types
import type IAVMAssetParams from './IAVMAssetParams';

interface IAVMAsset {
  ['created-at-round']?: bigint;
  deleted?: boolean;
  ['destroyed-at-round']: bigint;
  index: bigint;
  params: IAVMAssetParams;
}

export default IAVMAsset;
