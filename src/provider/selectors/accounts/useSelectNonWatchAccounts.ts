import { useSelector } from 'react-redux';

// types
import type { IAccountWithExtendedProps, IMainRootState } from '@provider/types';

/**
 * Selects all non-watch accounts.
 * @returns {IAccountWithExtendedProps[]} all non-watch accounts.
 */
export default function useSelectNonWatchAccounts(): IAccountWithExtendedProps[] {
  return useSelector<IMainRootState, IAccountWithExtendedProps[]>((state) =>
    state.accounts.items.filter((value) => !value.watchAccount)
  );
}
