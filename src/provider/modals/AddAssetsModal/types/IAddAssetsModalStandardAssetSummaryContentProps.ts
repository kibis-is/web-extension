// models
import BaseBlockExplorer from '@provider/models/BaseBlockExplorer';

// types
import type { IAccount, INetworkWithTransactionParams, IStandardAsset } from '@provider/types';

interface IAddAssetsModalStandardAssetSummaryContentProps {
  account: IAccount;
  accounts: IAccount[];
  asset: IStandardAsset;
  blockExplorer: BaseBlockExplorer | null;
  network: INetworkWithTransactionParams;
}

export default IAddAssetsModalStandardAssetSummaryContentProps;
