import { AssetTypeEnum } from '@provider/enums';

/**
 * @property {string} amount - The amount, in atomic units, the asset.
 * @property {string} id - The asset ID i.e. the contract ID.
 * @property {AssetTypeEnum} type - The type of asset.
 */
interface IBaseAssetHolding {
  amount: string;
  id: string;
  type: AssetTypeEnum;
}

export default IBaseAssetHolding;
