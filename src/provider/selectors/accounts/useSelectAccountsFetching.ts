import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@provider/types';

/**
 * Selects the account information fetching state.
 * @returns {boolean} true if the account information is being fetched, false otherwise.
 */
export default function useSelectAccountsFetching(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.accounts.fetching);
}
