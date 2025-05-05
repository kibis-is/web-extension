// selectors
import useSelectSettingsSelectedNetwork from '@provider/selectors/settings/useSelectSettingsSelectedNetwork';
import useSelectActiveAccount from './useSelectActiveAccount';

// types
import type { IAccountStakingApp } from '@provider/types';

// utils
import convertGenesisHashToHex from '@provider/utils/convertGenesisHashToHex';

/**
 * Gets staking apps for the active account for the selected network.
 * @returns {IAccountStakingApp[]} The staking apps for the active account.
 */
export default function useSelectActiveAccountStakingApps(): IAccountStakingApp[] {
  const account = useSelectActiveAccount();
  const network = useSelectSettingsSelectedNetwork();

  if (!account || !network) {
    return [];
  }

  return account.networkStakingApps[convertGenesisHashToHex(network.genesisHash)]?.apps ?? [];
}
