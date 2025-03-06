// features
import type { IState as INetworksState } from '@extension/features/networks';
import type { IState as INotificationsState } from '@extension/features/notifications';
import type { IState as RegistrationState } from '@extension/features/registration';

// types
import type IBaseRootState from './IBaseRootState';

interface IRegistrationRootState extends IBaseRootState {
  networks: INetworksState;
  notifications: INotificationsState;
  registration: RegistrationState;
}

export default IRegistrationRootState;
