import type { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// types
import ARC0300KeyRegistrationTransactionSendEvent from '@provider/events/ARC0300KeyRegistrationTransactionSendEvent';
import AVMWebProviderRequestEvent from '@provider/events/AVMWebProviderRequestEvent';
import WebAuthnAuthenticateRequestEvent from '@provider/events/WebAuthnAuthenticateRequestEvent';
import WebAuthnRegisterRequestEvent from '@provider/events/WebAuthnRegisterRequestEvent';

type TEvents =
  | ARC0300KeyRegistrationTransactionSendEvent
  | AVMWebProviderRequestEvent<TRequestParams>
  | WebAuthnAuthenticateRequestEvent
  | WebAuthnRegisterRequestEvent;

export default TEvents;
