interface IAVMAssetHolding {
  amount: bigint;
  ['asset-id']: bigint;
  creator: string;
  deleted: boolean;
  ['is-frozen']: boolean;
  ['opted-in-at-round']: bigint;
  ['opted-out-at-round']: bigint;
}

export default IAVMAssetHolding;
