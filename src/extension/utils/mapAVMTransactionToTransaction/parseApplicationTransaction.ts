import { BigNumber } from 'bignumber.js';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import {
  IApplicationTransaction,
  IApplicationTransactionTypes,
  IAVMApplicationTransaction,
  IBaseTransaction,
  TAVMTransaction,
} from '@extension/types';

// utils
import mapAVMTransactionToTransaction from '@extension/utils/mapAVMTransactionToTransaction';

export default function parseApplicationTransaction(
  algorandApplicationTransaction: IAVMApplicationTransaction,
  baseTransaction: IBaseTransaction,
  innerTransactions?: TAVMTransaction[]
): IApplicationTransaction {
  const applicationId: string | null =
    algorandApplicationTransaction['application-id'] > 0
      ? new BigNumber(
          String(algorandApplicationTransaction['application-id'] as bigint)
        ).toFixed()
      : null;
  let type: IApplicationTransactionTypes = TransactionTypeEnum.ApplicationNoOp;

  switch (algorandApplicationTransaction['on-completion']) {
    case 'clear':
      type = TransactionTypeEnum.ApplicationClearState;
      break;
    case 'closeout':
      type = TransactionTypeEnum.ApplicationCloseOut;
      break;
    case 'delete':
      type = TransactionTypeEnum.ApplicationDelete;
      break;
    case 'optin':
      type = TransactionTypeEnum.ApplicationOptIn;
      break;
    case 'update':
      type = TransactionTypeEnum.ApplicationUpdate;
      break;
    default:
      break;
  }

  // if the application id is zero, this will be an application create
  if (!applicationId) {
    type = TransactionTypeEnum.ApplicationCreate;
  }

  return {
    ...baseTransaction,
    applicationArgs: algorandApplicationTransaction['application-args'] || null,
    applicationId,
    accounts: algorandApplicationTransaction.accounts || null,
    approvalProgram: algorandApplicationTransaction['approval-program'] || null,
    clearStateProgram:
      algorandApplicationTransaction['clear-state-program'] || null,
    extraProgramPages: algorandApplicationTransaction['extra-program-pages']
      ? Number(algorandApplicationTransaction['extra-program-pages'])
      : null,
    foreignApps:
      algorandApplicationTransaction['foreign-apps']?.map((value) =>
        new BigNumber(String(value as bigint)).toFixed()
      ) || null,
    foreignAssets:
      algorandApplicationTransaction['foreign-assets']?.map((value) =>
        new BigNumber(String(value as bigint)).toFixed()
      ) || null,
    innerTransactions:
      innerTransactions?.map(mapAVMTransactionToTransaction) || null,
    type,
  };
}
