import BigNumber from 'bignumber.js';

// repositories
import AccountRepository from '@provider/repositories/AccountRepository';

// types
import type { IAccountInformation } from '@provider/types';
import type { IOptions, IState } from './types';

// utils
import calculateMinimumBalanceRequirementForStandardAssets from '@provider/utils/calculateMinimumBalanceRequirementForStandardAssets';

export default function useAddAssetStandardAssetSummaryContent({ account, network }: IOptions): IState {
  const accountInformation: IAccountInformation | null = AccountRepository.extractAccountInformationForNetwork(
    account,
    network
  );
  let accountBalanceInAtomicUnits = new BigNumber('0');

  if (accountInformation) {
    accountBalanceInAtomicUnits = new BigNumber(accountInformation.atomicBalance);
  }

  return {
    accountBalanceInAtomicUnits,
    minimumBalanceRequirementInAtomicUnits: calculateMinimumBalanceRequirementForStandardAssets({
      account,
      network,
    }),
    minimumTransactionFeesInAtomicUnits: new BigNumber(network.minFee),
  };
}
