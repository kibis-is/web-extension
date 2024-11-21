import browser from 'webextension-polyfill';

// message brokers
import AVMWebProviderMessageBroker from '@extension/message-brokers/AVMWebProviderMessageBroker';
import WebAuthnMessageBroker from '@extension/message-brokers/WebAuthnMessageBroker';

// services
import LegacyUseWalletMessageBroker from '@external/services/LegacyUseWalletMessageBroker';

// types
import type { ILogger } from '@common/types';

// utils
import createLogger from '@common/utils/createLogger';
import injectScript from '@common/utils/injectScript';

(() => {
  const debug: boolean = __ENV__ === 'development';
  const logger: ILogger = createLogger(debug ? 'debug' : 'error');
  const avmWebProviderMessageBroker = new AVMWebProviderMessageBroker({
    debug,
    logger,
  });
  const webAuthnMessageBroker = new WebAuthnMessageBroker({
    logger,
  });

  // start listening to messages from client and provider
  avmWebProviderMessageBroker.startListening();
  webAuthnMessageBroker.startListening();

  // inject the webauthn manager to intercept webauthn requests
  injectScript(browser.runtime.getURL('webauthn-listener.js'));

  /**
   * deprecated - older versions of use-wallet will still use broadcastchannel messages
   */
  LegacyUseWalletMessageBroker.init({ logger });

  /**
   * deprecated - this is using algorand-provider, but will be phased out in favour of the new avm-web-provider
   */
  // inject the web resources into the web page to initialize the window.algorand object
  injectScript(browser.runtime.getURL('algorand-provider.js'));
})();
