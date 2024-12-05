// managers
import WebAuthnMessageManager from '@external/managers/WebAuthnMessageManager';

// types
import type { IBaseOptions, IExternalConfig } from '@common/types';

interface INewOptions extends IBaseOptions {
  config?: IExternalConfig;
  navigatorCredentialsCreateFn: typeof navigator.credentials.create;
  webAuthnMessageManager?: WebAuthnMessageManager;
}

export default INewOptions;
