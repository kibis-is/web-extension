import { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// types
import type IAVMWebProviderRequestEvent from './IAVMWebProviderRequestEvent';
import type IARC0300KeyRegistrationTransactionSendEvent from './IARC0300KeyRegistrationTransactionSendEvent';

type TEvents =
  | IARC0300KeyRegistrationTransactionSendEvent
  | IAVMWebProviderRequestEvent<TRequestParams>;

export default TEvents;
