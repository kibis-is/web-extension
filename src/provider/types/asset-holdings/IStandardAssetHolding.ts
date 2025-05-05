// enums
import { AssetTypeEnum } from '@provider/enums';

// types
import { IBaseAssetHolding } from '@provider/types';

/**
 * @property {boolean} isFrozen - whether this standard asset is frozen.
 */
interface IStandardAssetHolding extends IBaseAssetHolding {
  isFrozen: boolean;
  type: AssetTypeEnum.Standard;
}

export default IStandardAssetHolding;
