// features
import type { IState as INetworksState } from '@provider/features/networks';
import type { IState as INotificationsState } from '@provider/features/notifications';
import type { IState as RegistrationState } from '@provider/features/registration';

// types
import type IBaseRootState from './IBaseRootState';

interface IRegistrationRootState extends IBaseRootState {
  networks: INetworksState;
  notifications: INotificationsState;
  registration: RegistrationState;
}

export default IRegistrationRootState;
