import { useSelector } from 'react-redux';

// types
import type { IAccountWithExtendedProps, IBackgroundRootState, IMainRootState } from '@provider/types';

/**
 * Determines if the account transactions are being updated for the active account.
 * @returns {boolean} true if the account transactions are being updated for the active account, false otherwise.
 */
export default function useSelectActiveAccountTransactionsUpdating(): boolean {
  return useSelector<IBackgroundRootState | IMainRootState, boolean>(({ accounts }) => {
    let activeAccount: IAccountWithExtendedProps | null;

    if (!accounts.activeAccountDetails) {
      return false;
    }

    activeAccount = accounts.items.find((value) => value.id === accounts.activeAccountDetails?.accountId) || null;

    if (!activeAccount) {
      return false;
    }

    return accounts.updateRequests
      .filter(({ accountIDs }) => accountIDs.some((value) => value === activeAccount?.id))
      .some(({ transactions }) => transactions);
  });
}
