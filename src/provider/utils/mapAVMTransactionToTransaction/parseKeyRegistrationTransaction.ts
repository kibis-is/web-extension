import { BigNumber } from 'bignumber.js';

// enums
import { TransactionTypeEnum } from '@provider/enums';

// types
import {
  IAVMKeyRegistrationTransaction,
  IBaseTransaction,
  IKeyRegistrationOfflineTransaction,
  IKeyRegistrationOnlineTransaction,
} from '@provider/types';

export default function parseAssetFreezeTransaction(
  algorandKeyRegistrationTransaction: IAVMKeyRegistrationTransaction,
  baseTransaction: IBaseTransaction
): IKeyRegistrationOfflineTransaction | IKeyRegistrationOnlineTransaction {
  if (
    algorandKeyRegistrationTransaction['selection-participation-key'] &&
    algorandKeyRegistrationTransaction['vote-first-valid'] &&
    algorandKeyRegistrationTransaction['vote-key-dilution'] &&
    algorandKeyRegistrationTransaction['vote-last-valid'] &&
    algorandKeyRegistrationTransaction['vote-participation-key']
  ) {
    return {
      ...baseTransaction,
      selectionParticipationKey: algorandKeyRegistrationTransaction['selection-participation-key'],
      voteFirstValid: new BigNumber(String(algorandKeyRegistrationTransaction['vote-first-valid'] as bigint)).toFixed(),
      voteKeyDilution: new BigNumber(
        String(algorandKeyRegistrationTransaction['vote-key-dilution'] as bigint)
      ).toFixed(),
      voteLastValid: new BigNumber(String(algorandKeyRegistrationTransaction['vote-last-valid'] as bigint)).toFixed(),
      voteParticipationKey: algorandKeyRegistrationTransaction['vote-participation-key'],
      type: TransactionTypeEnum.KeyRegistrationOnline,
    };
  }

  return {
    ...baseTransaction,
    type: TransactionTypeEnum.KeyRegistrationOffline,
  };
}
