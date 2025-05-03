import { AlgorandProvider } from '@agoralabs-sh/algorand-provider';

// interceptors
import WebAuthnInterceptor from '@client/interceptors/WebAuthnInterceptor';

// managers
import LegacyProviderAdapter from '@client/adapters/LegacyProviderAdapter';

// types
import type { IWindow } from '@client/types';

(async () => {
  let webAuthnInterceptor: WebAuthnInterceptor;

  // if webauthn is supported override the functions with the kibisis interceptors
  if (window.navigator.credentials) {
    webAuthnInterceptor = await WebAuthnInterceptor.initialize({
      navigatorCredentialsCreateFn: window.navigator.credentials.create.bind(
        window.navigator.credentials
      ),
      navigatorCredentialsGetFn: window.navigator.credentials.get.bind(
        window.navigator.credentials
      ),
    });

    // intercept the webauthn functions to create/get passkeys
    window.navigator.credentials.create =
      webAuthnInterceptor.create.bind(webAuthnInterceptor);
    window.navigator.credentials.get =
      webAuthnInterceptor.get.bind(webAuthnInterceptor);
  }

  // add the algorand provider if it doesn't exist
  if (
    !(window as IWindow).algorand ||
    !(window as IWindow).algorand?.addWallet
  ) {
    (window as IWindow).algorand = new AlgorandProvider();
  }

  // add the provider adapter
  (window as IWindow).algorand?.addWallet(new LegacyProviderAdapter(), {
    replace: true,
  });
})();
