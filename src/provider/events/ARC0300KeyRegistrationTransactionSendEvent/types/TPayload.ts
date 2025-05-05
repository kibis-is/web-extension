// types
import type {
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
} from '@provider/types';

type TPayload =
  | IARC0300OfflineKeyRegistrationTransactionSendSchema
  | IARC0300OnlineKeyRegistrationTransactionSendSchema;

export default TPayload;
