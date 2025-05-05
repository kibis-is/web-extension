// types
import type { IAssetTypes } from '@provider/types';

interface IInitializeRemoveAssetsPayload {
  accountId: string;
  selectedAsset: IAssetTypes;
}

export default IInitializeRemoveAssetsPayload;
