import { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// types
import type IAVMWebProviderRequestEvent from './IAVMWebProviderRequestEvent';
import type IARC0300KeyRegistrationTransactionSendEvent from './IARC0300KeyRegistrationTransactionSendEvent';
import type IWebAuthnRequestEvent from './IWebAuthnRequestEvent';

type TEvents =
  | IARC0300KeyRegistrationTransactionSendEvent
  | IAVMWebProviderRequestEvent<TRequestParams>
  | IWebAuthnRequestEvent;

export default TEvents;
