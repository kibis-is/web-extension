// models
import BaseBlockExplorer from '@provider/models/BaseBlockExplorer';

// types
import type { IARC0200Asset, INetworkWithTransactionParams } from '@provider/types';

interface IAddAssetsARC0200SummaryModalContentProps {
  asset: IARC0200Asset;
  blockExplorer: BaseBlockExplorer | null;
  network: INetworkWithTransactionParams;
}

export default IAddAssetsARC0200SummaryModalContentProps;
