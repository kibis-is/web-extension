// selectors
import useSelectActiveAccount from './useSelectActiveAccount';
import useSelectAccountGroups from './useSelectAccountGroups';

// types
import type { IAccountGroup } from '@provider/types';

/**
 * Selects the active account group, or null if it doesn't exist.
 * @returns {IAccountGroup | null} The active account group, or null.
 */
export default function useSelectActiveAccountGroup(): IAccountGroup | null {
  const account = useSelectActiveAccount();
  const groups = useSelectAccountGroups();

  if (!account || !account.groupID) {
    return null;
  }

  return groups.find(({ id }) => id === account.groupID) || null;
}
