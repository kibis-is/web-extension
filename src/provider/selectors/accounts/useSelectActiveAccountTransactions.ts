// selectors
import useSelectSettingsSelectedNetwork from '../settings/useSelectSettingsSelectedNetwork';
import useSelectActiveAccount from './useSelectActiveAccount';

// repositories
import AccountRepository from '@provider/repositories/AccountRepository';

// types
import type { IAccountTransactions } from '@provider/types';

/**
 * Gets the account transactions associated with the active account. If no active account is found, the account
 * transactions for first account in the list is returned.
 * @returns {IAccountInformation | null} the account transactions for the active account, the account transactions for
 * first account in the account list or null.
 */
export default function useSelectActiveAccountTransactions(): IAccountTransactions | null {
  const account = useSelectActiveAccount();
  const network = useSelectSettingsSelectedNetwork();

  if (!account || !network) {
    return null;
  }

  return AccountRepository.extractAccountTransactionsForNetwork(account, network);
}
