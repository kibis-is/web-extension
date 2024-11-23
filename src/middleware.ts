import browser from 'webextension-polyfill';

// message brokers
import AVMWebProviderMessageBroker from '@extension/message-brokers/AVMWebProviderMessageBroker';
import WebAuthnMessageBroker from '@extension/message-brokers/WebAuthnMessageBroker';

// types
import type { ILogger } from '@common/types';

// utils
import createLogger from '@common/utils/createLogger';
import injectScript from '@extension/utils/injectScript';

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

  // inject the script to intercept webauthn requests
  injectScript(browser.runtime.getURL('webauthn.js'));
})();
