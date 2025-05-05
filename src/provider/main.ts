// message handlers
import AVMWebProviderMessageHandler from '@provider/message-handlers/AVMWebProviderMessageHandler';
import ExternalConfigMessageHandler from '@provider/message-handlers/ExternalConfigMessageHandler';
import ProviderMessageHandler from '@provider/message-handlers/ProviderMessageHandler';
import WebAuthnMessageHandler from '@provider/message-handlers/WebAuthnMessageHandler';

// repositories
import SettingsRepository from '@provider/repositories/SettingsRepository';

// services
import HeartbeatService from '@provider/services/HeartbeatService';
import ProviderActionListener from '@provider/services/ProviderActionListener';

// utils
import createLogger from '@common/utils/createLogger';

(async () => {
  const settings = await new SettingsRepository().fetch();
  let avmWebProviderMessageHandler: AVMWebProviderMessageHandler;
  let externalConfigMessageHandler: ExternalConfigMessageHandler;
  let logger = createLogger(__ENV__ === 'development' ? 'debug' : 'error');
  let heartbeatService: HeartbeatService;
  let providerActionListener: ProviderActionListener;
  let providerMessageHandler: ProviderMessageHandler;
  let webAuthnMessageHandler: WebAuthnMessageHandler;

  // if the debug logging is enabled, re-create the logger with debug logging enabled
  if (settings.advanced.debugLogging) {
    logger = createLogger('debug');
  }

  heartbeatService = new HeartbeatService({ logger });
  avmWebProviderMessageHandler = new AVMWebProviderMessageHandler({
    logger,
  });
  externalConfigMessageHandler = new ExternalConfigMessageHandler({
    logger,
  });
  providerActionListener = new ProviderActionListener({
    logger,
  });
  providerMessageHandler = new ProviderMessageHandler({
    logger,
  });
  webAuthnMessageHandler = new WebAuthnMessageHandler({
    logger,
  });

  // listen to messages from the middleware (content scripts)
  avmWebProviderMessageHandler.startListening();
  externalConfigMessageHandler.startListening();
  webAuthnMessageHandler.startListening();

  // create an alarm to "tick" that will keep the extension from going idle
  await heartbeatService.createOrGetAlarm();

  // listen to incoming messages from the provider (popups)
  providerMessageHandler.startListening();

  // listen to special extension events
  providerActionListener.startListening();
})();
