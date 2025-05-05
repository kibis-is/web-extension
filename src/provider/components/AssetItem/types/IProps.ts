// types
import type { IAssetTypes, INativeCurrency, INetworkWithTransactionParams } from '@provider/types';

interface IProps {
  asset: IAssetTypes | INativeCurrency;
  network: INetworkWithTransactionParams;
}

export default IProps;
