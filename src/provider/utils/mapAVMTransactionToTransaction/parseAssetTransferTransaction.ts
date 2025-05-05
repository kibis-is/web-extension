import { BigNumber } from 'bignumber.js';

// enums
import { TransactionTypeEnum } from '@provider/enums';

// types
import { IBaseTransaction, IAVMAssetTransferTransaction, IAssetTransferTransaction } from '@provider/types';

export default function parseAssetTransferTransaction(
  algorandAssetTransferTransaction: IAVMAssetTransferTransaction,
  baseTransaction: IBaseTransaction
): IAssetTransferTransaction {
  return {
    ...baseTransaction,
    amount: new BigNumber(String(algorandAssetTransferTransaction.amount as bigint)).toFixed(),
    assetId: new BigNumber(String(algorandAssetTransferTransaction['asset-id'] as bigint)).toFixed(),
    receiver: algorandAssetTransferTransaction.receiver,
    type: TransactionTypeEnum.AssetTransfer,
  };
}
