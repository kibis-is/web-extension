// types
import type { IAssetTypes } from '@provider/types';

interface IUpdateAssetHoldingsPayload<AssetType = IAssetTypes> {
  accountId: string;
  assets: AssetType[];
  genesisHash: string;
}

export default IUpdateAssetHoldingsPayload;
