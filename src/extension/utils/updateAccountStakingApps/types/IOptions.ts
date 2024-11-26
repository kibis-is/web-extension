// types
import type { IBaseOptions } from '@common/types';
import type { IAccountNetworkStakingApps, INetwork } from '@extension/types';

interface IOptions extends IBaseOptions {
  address: string;
  currentNetworkStakingApps: IAccountNetworkStakingApps;
  delay?: number;
  network: INetwork;
  nodeID: string | null;
}

export default IOptions;
