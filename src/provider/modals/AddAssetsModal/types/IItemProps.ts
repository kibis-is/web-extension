// types
import type { IAssetTypes, INetwork } from '@provider/types';

interface IItemProps<Asset = IAssetTypes> {
  added: boolean;
  asset: Asset;
  network: INetwork;
  onClick: (asset: Asset) => void;
}

export default IItemProps;
