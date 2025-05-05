import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@provider/types';

/**
 * Checks whether the confetti is shoeing or not.
 * @returns {boolean} whether the confetti is showing.
 */
export default function useSelectNotificationsShowingConfetti(): boolean {
  return useSelector<IMainRootState, boolean>(({ notifications }) => notifications.showingConfetti);
}
