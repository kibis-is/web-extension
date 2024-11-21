// managers
import WebAuthnManager from '@external/managers/WebAuthnManager';

// utils
import createLogger from '@common/utils/createLogger';

(() => {
  const logger = createLogger(__ENV__ === 'development' ? 'debug' : 'error');
  const webAuthnManager: WebAuthnManager = new WebAuthnManager({
    credentialsContainer: navigator.credentials,
    logger,
  });

  // intercept the webauthn functions to create/get passkeys
  navigator.credentials.create = webAuthnManager.create.bind(
    webAuthnManager,
    navigator.credentials.create
  );
  navigator.credentials.get = webAuthnManager.get.bind(
    webAuthnManager,
    navigator.credentials.get
  );
})();
