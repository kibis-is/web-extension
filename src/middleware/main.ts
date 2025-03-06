import browser from 'webextension-polyfill';

// message brokers
import AVMWebProviderMessageBroker from '@middleware/message-brokers/AVMWebProviderMessageBroker';
import ExternalConfigMessageBroker from '@middleware/message-brokers/ExternalConfigMessageBroker';
import ProviderMessageBroker from '@middleware/message-brokers/ProviderMessageBroker';
import WebAuthnMessageBroker from '@middleware/message-brokers/WebAuthnMessageBroker';

// utils
import createLogger from '@common/utils/createLogger';
import injectScript from '@middleware/utils/injectScript';

(() => {
  const debug = __ENV__ === 'development';
  const logger = createLogger(debug ? 'debug' : 'error');
  const avmWebProviderMessageBroker = new AVMWebProviderMessageBroker({
    debug,
    logger,
  });
  const externalConfigMessageBroker = new ExternalConfigMessageBroker({
    logger,
  });
  const providerMessageBroker = new ProviderMessageBroker({
    logger,
  });
  const webAuthnMessageBroker = new WebAuthnMessageBroker({
    logger,
  });

  // start listening to messages from the client and the provider
  avmWebProviderMessageBroker.startListening();
  externalConfigMessageBroker.startListening();
  providerMessageBroker.startListening();
  webAuthnMessageBroker.startListening();

  // inject the script to access the full dom
  injectScript(browser.runtime.getURL('client.js'));
})();
