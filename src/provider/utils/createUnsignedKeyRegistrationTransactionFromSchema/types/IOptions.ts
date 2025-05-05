// types
import type { IBaseOptions } from '@common/types';
import type {
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
  INetwork,
} from '@provider/types';

interface IOptions extends IBaseOptions {
  network: INetwork;
  nodeID: string | null;
  schema: IARC0300OfflineKeyRegistrationTransactionSendSchema | IARC0300OnlineKeyRegistrationTransactionSendSchema;
}

export default IOptions;
