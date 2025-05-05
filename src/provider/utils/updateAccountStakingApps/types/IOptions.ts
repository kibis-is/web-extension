// types
import type { IBaseOptions } from '@common/types';
import type { IAccountNetworkStakingApps, INetworkWithTransactionParams } from '@provider/types';

interface IOptions extends IBaseOptions {
  address: string;
  currentNetworkStakingApps: IAccountNetworkStakingApps;
  delay?: number;
  network: INetworkWithTransactionParams;
  nodeID: string | null;
}

export default IOptions;
