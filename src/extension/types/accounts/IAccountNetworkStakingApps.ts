// types
import type { IAccountStakingApp } from '@extension/types';

/**
 * @property {IAccountStakingApp[]} apps - The staking apps associated with this account and network.
 * @property {string | null} lastUpdatedAt - The timestamp (in milliseconds) for when the apps were last updated.
 */
interface IAccountNetworkStakingApps {
  apps: IAccountStakingApp[];
  lastUpdatedAt: number;
}

export default IAccountNetworkStakingApps;
