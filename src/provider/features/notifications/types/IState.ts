// types
import { INotification } from '@provider/types';

/**
 * @property {INotification[]} items - a list of notifications.
 */
interface IState {
  items: INotification[];
  showingConfetti: boolean;
}

export default IState;
