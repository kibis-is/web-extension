import type { i18n } from 'i18next';

// managers
import WebAuthnMessageManager from '@external/managers/WebAuthnMessageManager';

// types
import type {
  IClientInformation,
  IExternalConfig,
  ILogger,
} from '@common/types';

interface IAppProps {
  clientInfo: IClientInformation;
  config: IExternalConfig;
  credentialCreationOptions: CredentialCreationOptions;
  i18n: i18n;
  navigatorCredentialsCreateFn: typeof navigator.credentials.create;
  logger?: ILogger;
  onClose: () => void;
  onResponse: (response: PublicKeyCredential | null) => void;
  webAuthnMessageManager?: WebAuthnMessageManager;
}

export default IAppProps;
