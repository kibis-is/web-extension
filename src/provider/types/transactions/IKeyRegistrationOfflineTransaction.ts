// enums
import { TransactionTypeEnum } from '@provider/enums';

// types
import type IBaseTransaction from './IBaseTransaction';

interface IKeyRegistrationOfflineTransaction extends IBaseTransaction {
  type: TransactionTypeEnum.KeyRegistrationOffline;
}

export default IKeyRegistrationOfflineTransaction;
