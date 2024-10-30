interface IAVMAssetTransferTransaction {
  amount: bigint;
  ['asset-id']: bigint;
  ['close-amount']?: bigint;
  ['close-to']?: string;
  receiver: string;
  sender?: string;
}

export default IAVMAssetTransferTransaction;
