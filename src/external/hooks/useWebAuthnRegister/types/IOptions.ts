// managers
import WebAuthnMessageManager from '@external/managers/WebAuthnMessageManager';

// types
import type { ILogger } from '@common/types';

interface IOptions {
  logger?: ILogger;
  webAuthnMessageManager?: WebAuthnMessageManager;
}

export default IOptions;
