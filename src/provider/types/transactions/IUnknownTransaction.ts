// enums
import { TransactionTypeEnum } from '@provider/enums';

// types
import IBaseTransaction from './IBaseTransaction';

interface IUnknownTransaction extends IBaseTransaction {
  type: TransactionTypeEnum.Unknown;
}

export default IUnknownTransaction;
