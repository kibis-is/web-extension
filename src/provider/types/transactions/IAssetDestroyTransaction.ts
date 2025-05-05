// enums
import { TransactionTypeEnum } from '@provider/enums';

// types
import type IBaseTransaction from './IBaseTransaction';

interface IAssetDestroyTransaction extends IBaseTransaction {
  assetId: string;
  creator: string;
  decimals: number;
  defaultFrozen: boolean;
  total: string;
  type: TransactionTypeEnum.AssetDestroy;
}

export default IAssetDestroyTransaction;
