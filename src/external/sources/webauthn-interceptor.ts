// managers
import WebAuthnInterceptor from '@external/interceptors/WebAuthnInterceptor';

// utils
import createLogger from '@common/utils/createLogger';

(() => {
  const logger = createLogger(__ENV__ === 'development' ? 'debug' : 'error');
  const webAuthnInterceptor: WebAuthnInterceptor = new WebAuthnInterceptor({
    credentialsContainer: navigator.credentials,
    logger,
  });

  // intercept the webauthn functions to create/get passkeys
  navigator.credentials.create = webAuthnInterceptor.create.bind(
    webAuthnInterceptor,
    navigator.credentials.create
  );
  navigator.credentials.get = webAuthnInterceptor.get.bind(
    webAuthnInterceptor,
    navigator.credentials.get
  );
})();
