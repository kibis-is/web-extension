import { BigNumber } from 'bignumber.js';

// enums
import { TransactionTypeEnum } from '@provider/enums';

// types
import type {
  IAccountReKeyTransaction,
  IAccountUndoReKeyTransaction,
  IAVMPaymentTransaction,
  IBaseTransaction,
  IPaymentTransaction,
} from '@provider/types';

export default function parsePaymentAndReKeyTransaction(
  algorandPaymentTransaction: IAVMPaymentTransaction,
  baseTransaction: IBaseTransaction
): IAccountReKeyTransaction | IAccountUndoReKeyTransaction | IPaymentTransaction {
  const amount = new BigNumber(String(algorandPaymentTransaction.amount as bigint));
  let type = TransactionTypeEnum.Payment;

  // check if this is a [undo] re-key - a zero amount and the re-key-to field has been used
  if (amount.lte(0) && baseTransaction.rekeyTo) {
    type =
      baseTransaction.rekeyTo === baseTransaction.sender
        ? TransactionTypeEnum.AccountUndoReKey
        : TransactionTypeEnum.AccountReKey;
  }

  return {
    ...baseTransaction,
    amount: amount.toFixed(),
    receiver: algorandPaymentTransaction.receiver,
    type,
  };
}
