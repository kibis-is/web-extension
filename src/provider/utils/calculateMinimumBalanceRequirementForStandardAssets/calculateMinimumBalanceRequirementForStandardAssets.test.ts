import { type Account, generateAccount } from 'algosdk';
import BigNumber from 'bignumber.js';

// config
import { networks } from '@provider/config';

// constants
import { MINIMUM_BALANCE_REQUIREMENT } from '@provider/constants';

// repositories
import AccountRepository from '@provider/repositories/AccountRepository';

// types
import type { IAccount, INetworkWithTransactionParams } from '@provider/types';

// utils
import convertGenesisHashToHex from '@provider/utils/convertGenesisHashToHex';
import convertAVMAddressToPublicKey from '@provider/utils/convertAVMAddressToPublicKey';
import calculateMinimumBalanceRequirementForStandardAssets from './calculateMinimumBalanceRequirementForStandardAssets';

interface ITestParams {
  expected: BigNumber;
  minBalanceInAtomicUnits: BigNumber;
  numOfStandardAssets?: number;
}

describe(`${__dirname}/calculateMinimumBalanceRequirementForStandardAssets`, () => {
  let account: IAccount;
  let encodedGenesisHash: string;
  let network: INetworkWithTransactionParams;

  beforeAll(() => {
    const _account: Account = generateAccount();

    account = AccountRepository.initializeDefaultAccount({
      publicKey: AccountRepository.encode(convertAVMAddressToPublicKey(_account.addr)),
    });
    network = {
      ...networks[0],
      currentBlockTime: '0',
      fee: '1000',
      minFee: '1000',
      lastSeenBlock: '0',
      lastSeenBlockTimestamp: '0',
      updatedAt: new Date().getTime(),
    };
    encodedGenesisHash = convertGenesisHashToHex(network.genesisHash);
  });

  it.each([
    {
      expected: new BigNumber(MINIMUM_BALANCE_REQUIREMENT),
      minBalanceInAtomicUnits: new BigNumber(MINIMUM_BALANCE_REQUIREMENT),
    },
    {
      expected: new BigNumber(MINIMUM_BALANCE_REQUIREMENT).multipliedBy(2),
      minBalanceInAtomicUnits: new BigNumber(MINIMUM_BALANCE_REQUIREMENT),
      numOfStandardAssets: 1,
    },
    {
      expected: new BigNumber(MINIMUM_BALANCE_REQUIREMENT).multipliedBy(3),
      minBalanceInAtomicUnits: new BigNumber(MINIMUM_BALANCE_REQUIREMENT).multipliedBy(2),
      numOfStandardAssets: 1,
    },
    {
      expected: new BigNumber(MINIMUM_BALANCE_REQUIREMENT),
      minBalanceInAtomicUnits: new BigNumber(MINIMUM_BALANCE_REQUIREMENT),
      numOfStandardAssets: -1,
    },
    {
      expected: new BigNumber(MINIMUM_BALANCE_REQUIREMENT).multipliedBy(2),
      minBalanceInAtomicUnits: new BigNumber(MINIMUM_BALANCE_REQUIREMENT).multipliedBy(3),
      numOfStandardAssets: -1,
    },
    {
      expected: new BigNumber(MINIMUM_BALANCE_REQUIREMENT),
      minBalanceInAtomicUnits: new BigNumber(MINIMUM_BALANCE_REQUIREMENT).multipliedBy(3),
      numOfStandardAssets: -3,
    },
  ])(
    `should get the minimum balance $expected for the number of standard assets "$numOfStandardAssets"`,
    ({ expected, minBalanceInAtomicUnits, numOfStandardAssets }: ITestParams) => {
      account.networkInformation[encodedGenesisHash] = {
        ...account.networkInformation[encodedGenesisHash],
        minAtomicBalance: minBalanceInAtomicUnits.toFixed(),
      };

      expect(
        calculateMinimumBalanceRequirementForStandardAssets({
          account,
          network,
          numOfStandardAssets,
        }).comparedTo(expected)
      ).toBe(0);
    }
  );
});
