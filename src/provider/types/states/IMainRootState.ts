// features
import type { IState as IAccountsState } from '@provider/features/accounts';
import type { IState as IAddAssetsState } from '@provider/features/add-assets';
import type { IState as IARC0072AssetsState } from '@provider/features/arc0072-assets';
import type { IState as ICredentialLockState } from '@provider/features/credential-lock';
import type { IState as IEventsState } from '@provider/features/events';
import type { IState as IManageGroupsModalState } from '@provider/features/manage-groups-modal';
import type { IState as IMoveGroupModalState } from '@provider/features/move-group-modal';
import type { IState as INetworksState } from '@provider/features/networks';
import type { IState as INotificationsState } from '@provider/features/notifications';
import type { IState as IPasskeysState } from '@provider/features/passkeys';
import type { IState as IReKeyAccountState } from '@provider/features/re-key-account';
import type { IState as IRemoveAssetsState } from '@provider/features/remove-assets';
import type { IState as ISendAssetsState } from '@provider/features/send-assets';
import type { IState as ISessionsState } from '@provider/features/sessions';
import type { IState as IStandardAssetsState } from '@provider/features/standard-assets';
import type { IState as IWebAuthnState } from '@provider/features/webauthn';

// types
import IBaseRootState from './IBaseRootState';

interface IMainRootState extends IBaseRootState {
  accounts: IAccountsState;
  addAssets: IAddAssetsState;
  arc0072Assets: IARC0072AssetsState;
  credentialLock: ICredentialLockState;
  events: IEventsState;
  manageGroupsModal: IManageGroupsModalState;
  moveGroupModal: IMoveGroupModalState;
  networks: INetworksState;
  notifications: INotificationsState;
  passkeys: IPasskeysState;
  reKeyAccount: IReKeyAccountState;
  removeAssets: IRemoveAssetsState;
  sendAssets: ISendAssetsState;
  sessions: ISessionsState;
  standardAssets: IStandardAssetsState;
  webauthn: IWebAuthnState;
}

export default IMainRootState;
