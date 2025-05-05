import { useSelector } from 'react-redux';

// types
import type { IMainRootState, INotification } from '@provider/types';

/**
 * Fetches all the notifications that are not currently showing.
 * @returns {INotification[]} the notifications that are not showing.
 */
export default function useSelectNotShowingNotifications(): INotification[] {
  return useSelector<IMainRootState, INotification[]>(({ notifications }) =>
    notifications.items.filter(({ showing, shown }) => !shown && !showing)
  );
}
