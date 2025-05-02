import type { i18n } from 'i18next';

// managers
import WebAuthnMessageManager from '@client/managers/WebAuthnMessageManager';

// types
import type {
  IClientInformation,
  IExternalConfig,
  ILogger,
} from '@common/types';

interface IBaseAppProps {
  clientInfo: IClientInformation;
  config: IExternalConfig;
  i18n: i18n;
  logger?: ILogger;
  onClose: () => void;
  onResponse: (response: PublicKeyCredential | null) => void;
  webAuthnMessageManager?: WebAuthnMessageManager;
}

export default IBaseAppProps;
