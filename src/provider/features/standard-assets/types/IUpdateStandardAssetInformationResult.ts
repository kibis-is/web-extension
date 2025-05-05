// types
import { IStandardAsset, INetwork } from '@provider/types';

/**
 * @property {IStandardAsset[]} standardAssets - the updated standard assets.
 * @property {INetwork} network - the network.
 */
interface IUpdateStandardAssetInformationResult {
  network: INetwork;
  standardAssets: IStandardAsset[];
}

export default IUpdateStandardAssetInformationResult;
