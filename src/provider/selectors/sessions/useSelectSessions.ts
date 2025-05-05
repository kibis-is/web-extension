import { useSelector } from 'react-redux';

// types
import { IMainRootState, ISession } from '@provider/types';

/**
 * Fetches all the available sessions.
 * @returns {ISession[]} the available sessions.
 */
export default function useSelectSessions(): ISession[] {
  return useSelector<IMainRootState, ISession[]>((state) => state.sessions.items);
}
