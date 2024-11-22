// managers
import WebAuthnInterceptor from '@external/interceptors/WebAuthnInterceptor';

// utils
import createLogger from '@common/utils/createLogger';

(() => {
  const logger = createLogger(__ENV__ === 'development' ? 'debug' : 'error');
  const webAuthnInterceptor: WebAuthnInterceptor = new WebAuthnInterceptor({
    logger,
    navigatorCredentialsCreateFn: window.navigator.credentials.create.bind(
      window.navigator.credentials
    ),
  });

  // intercept the webauthn functions to create/get passkeys
  navigator.credentials.create =
    webAuthnInterceptor.create.bind(webAuthnInterceptor);
})();
