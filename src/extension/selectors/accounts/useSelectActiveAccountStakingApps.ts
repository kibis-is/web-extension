// selectors
import useSelectSettingsSelectedNetwork from '@extension/selectors/settings/useSelectSettingsSelectedNetwork';
import useSelectActiveAccount from './useSelectActiveAccount';

// types
import type { IAccountStakingApp } from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

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

  return (
    account.networkStakingApps[convertGenesisHashToHex(network.genesisHash)]
      ?.apps ?? []
  );
}
