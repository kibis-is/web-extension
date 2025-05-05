// features
import type { IState as IAccountsState } from '@provider/features/accounts';
import type { IState as ICredentialLockState } from '@provider/features/credential-lock';
import type { IState as IEventsState } from '@provider/features/events';
import type { IState as INetworksState } from '@provider/features/networks';
import type { IState as IPasskeysState } from '@provider/features/passkeys';
import type { IState as ISessionsState } from '@provider/features/sessions';
import type { IState as IStandardAssetsState } from '@provider/features/standard-assets';
import type { IState as IWebAuthnState } from '@provider/features/webauthn';

// types
import type IBaseRootState from './IBaseRootState';

interface IBackgroundRootState extends IBaseRootState {
  accounts: IAccountsState;
  credentialLock: ICredentialLockState;
  events: IEventsState;
  networks: INetworksState;
  passkeys: IPasskeysState;
  sessions: ISessionsState;
  standardAssets: IStandardAssetsState;
  webauthn: IWebAuthnState;
}

export default IBackgroundRootState;
