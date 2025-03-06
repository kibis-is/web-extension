// managers
import ConfigManager from '@client/managers/ConfigManager';
import WebAuthnMessageManager from '@client/managers/WebAuthnMessageManager';

// types
import type { IBaseOptions, IExternalConfig } from '@common/types';

interface INewOptions extends IBaseOptions {
  configManager?: ConfigManager;
  initialConfig?: IExternalConfig;
  navigatorCredentialsCreateFn: typeof navigator.credentials.create;
  webAuthnMessageManager?: WebAuthnMessageManager;
}

export default INewOptions;
