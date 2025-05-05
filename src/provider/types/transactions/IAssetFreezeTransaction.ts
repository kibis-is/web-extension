// enums
import { TransactionTypeEnum } from '@provider/enums';

// types
import type IBaseAssetFreezeTransaction from './IBaseAssetFreezeTransaction';

interface IAssetFreezeTransaction extends IBaseAssetFreezeTransaction {
  type: TransactionTypeEnum.AssetFreeze;
}

export default IAssetFreezeTransaction;
