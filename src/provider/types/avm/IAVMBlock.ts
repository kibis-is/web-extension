interface IAVMBlock {
  bonus?: bigint;
  ['fees-collected']?: bigint;
  ['genesis-hash']: string;
  ['genesis-id']: string;
  ['previous-block-hash']: string;
  proposer?: string;
  ['proposer-payout']?: bigint;
  round: bigint;
  seed: string;
  timestamp: bigint;
  ['transactions-root']: string;
  ['transactions-root-sha256']: string;
  ['txn-counter']?: bigint;
}

export default IAVMBlock;
