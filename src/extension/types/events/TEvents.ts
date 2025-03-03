import type { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// types
import ARC0300KeyRegistrationTransactionSendEvent from '@extension/events/ARC0300KeyRegistrationTransactionSendEvent';
import AVMWebProviderRequestEvent from '@extension/events/AVMWebProviderRequestEvent';
import WebAuthnAuthenticateRequestEvent from '@extension/events/WebAuthnAuthenticateRequestEvent';
import WebAuthnRegisterRequestEvent from '@extension/events/WebAuthnRegisterRequestEvent';

type TEvents =
  | ARC0300KeyRegistrationTransactionSendEvent
  | AVMWebProviderRequestEvent<TRequestParams>
  | WebAuthnAuthenticateRequestEvent
  | WebAuthnRegisterRequestEvent;

export default TEvents;
