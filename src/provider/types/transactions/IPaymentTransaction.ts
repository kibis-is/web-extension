// enums
import { TransactionTypeEnum } from '@provider/enums';

// types
import type IBaseTransaction from './IBaseTransaction';

interface IPaymentTransaction extends IBaseTransaction {
  amount: string;
  receiver: string;
  type: TransactionTypeEnum.Payment;
}

export default IPaymentTransaction;
