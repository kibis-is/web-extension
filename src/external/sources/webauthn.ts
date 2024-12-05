// interceptors
import WebAuthnInterceptor from '@external/interceptors/WebAuthnInterceptor';

(async () => {
  let webAuthnInterceptor: WebAuthnInterceptor;

  if (!window.navigator.credentials) {
    return;
  }

  // initialize the interceptor with the original functions
  webAuthnInterceptor = await WebAuthnInterceptor.initialize({
    navigatorCredentialsCreateFn: window.navigator.credentials.create.bind(
      window.navigator.credentials
    ),
  });

  // intercept the webauthn functions to create/get passkeys
  window.navigator.credentials.create =
    webAuthnInterceptor.create.bind(webAuthnInterceptor);
})();
