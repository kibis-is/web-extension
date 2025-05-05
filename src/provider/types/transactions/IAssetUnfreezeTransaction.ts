// enums
import { TransactionTypeEnum } from '@provider/enums';

// types
import type IBaseAssetFreezeTransaction from './IBaseAssetFreezeTransaction';

interface IAssetUnfreezeTransaction extends IBaseAssetFreezeTransaction {
  type: TransactionTypeEnum.AssetUnfreeze;
}

export default IAssetUnfreezeTransaction;
