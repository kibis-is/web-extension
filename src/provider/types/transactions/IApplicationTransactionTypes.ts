// enums
import { TransactionTypeEnum } from '@provider/enums';

type IApplicationTransactionTypes =
  | TransactionTypeEnum.ApplicationClearState
  | TransactionTypeEnum.ApplicationCloseOut
  | TransactionTypeEnum.ApplicationCreate
  | TransactionTypeEnum.ApplicationDelete
  | TransactionTypeEnum.ApplicationNoOp
  | TransactionTypeEnum.ApplicationOptIn
  | TransactionTypeEnum.ApplicationUpdate
  | TransactionTypeEnum.ARC0200AssetTransfer;

export default IApplicationTransactionTypes;
