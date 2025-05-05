// selectors
import useSelectSettingsSelectedNetwork from '../settings/useSelectSettingsSelectedNetwork';
import useSelectActiveAccount from './useSelectActiveAccount';

// repositories
import AccountRepository from '@provider/repositories/AccountRepository';

// types
import type { IAccountInformation } from '@provider/types';

/**
 * Gets the account information associated for the active account. If no active account is found, the account
 * information for first account in the list is returned.
 * @returns {IAccountInformation | null} the account information for the active account, the account information for
 * first account in the account list or null.
 */
export default function useSelectActiveAccountInformation(): IAccountInformation | null {
  const account = useSelectActiveAccount();
  const network = useSelectSettingsSelectedNetwork();

  if (!account || !network) {
    return null;
  }

  return AccountRepository.extractAccountInformationForNetwork(account, network);
}
