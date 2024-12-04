// interceptors
import WebAuthnInterceptor from '@external/interceptors/WebAuthnInterceptor';

// types
import type { ILogger } from '@common/types';

// utils
import createLogger from '@common/utils/createLogger';

(() => {
  let logger: ILogger;
  let webAuthnInterceptor: WebAuthnInterceptor;

  if (!window.navigator.credentials) {
    return;
  }

  logger = createLogger(__ENV__ === 'development' ? 'debug' : 'error');
  webAuthnInterceptor = new WebAuthnInterceptor({
    logger,
    navigatorCredentialsCreateFn: window.navigator.credentials.create.bind(
      window.navigator.credentials
    ),
  });

  // intercept the webauthn functions to create/get passkeys
  window.navigator.credentials.create =
    webAuthnInterceptor.create.bind(webAuthnInterceptor);
})();
