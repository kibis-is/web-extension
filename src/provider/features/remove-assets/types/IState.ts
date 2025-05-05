// types
import type { IAssetTypes } from '@provider/types';

interface IState {
  accountId: string | null;
  confirming: boolean;
  selectedAsset: IAssetTypes | null;
}

export default IState;
