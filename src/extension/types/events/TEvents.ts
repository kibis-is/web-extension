import { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// types
import ARC0300KeyRegistrationTransactionSendEvent from '@extension/events/ARC0300KeyRegistrationTransactionSendEvent';
import AVMWebProviderRequestEvent from '@extension/events/AVMWebProviderRequestEvent';
import WebAuthnRegisterRequestEvent from '@extension/events/WebAuthnRegisterRequestEvent';

type TEvents =
  | ARC0300KeyRegistrationTransactionSendEvent
  | AVMWebProviderRequestEvent<TRequestParams>
  | WebAuthnRegisterRequestEvent;

export default TEvents;
