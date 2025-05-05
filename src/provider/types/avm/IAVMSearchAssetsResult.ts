// types
import type IAVMAsset from './IAVMAsset';

interface IAVMSearchAssetsResult {
  assets: IAVMAsset[];
  ['current-round']: bigint;
  ['next-token']?: string;
}

export default IAVMSearchAssetsResult;
