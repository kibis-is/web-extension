// managers
import WebAuthnInterceptor from '@external/interceptors/WebAuthnInterceptor';

// utils
import createLogger from '@common/utils/createLogger';

(() => {
  const logger = createLogger(__ENV__ === 'development' ? 'debug' : 'error');
  const webAuthnInterceptor: WebAuthnInterceptor = new WebAuthnInterceptor({
    logger,
  });
  const originCredentialsCreateFn = navigator.credentials.create;

  // intercept the webauthn functions to create/get passkeys
  navigator.credentials.create = async function (options) {
    let credential: PublicKeyCredential | null = null;

    try {
      credential = await webAuthnInterceptor.create(options);
    } catch (error) {}

    if (credential) {
      return credential;
    }

    return originCredentialsCreateFn.call(this, options);
  };
  navigator.credentials.get = webAuthnInterceptor.get.bind(
    webAuthnInterceptor,
    navigator.credentials.get
  );
})();
