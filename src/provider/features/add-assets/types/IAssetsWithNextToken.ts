// types
import { IAssetTypes } from '@provider/types';

interface IAssetsWithNextToken<Asset = IAssetTypes> {
  items: Asset[];
  next: string | null;
}

export default IAssetsWithNextToken;
