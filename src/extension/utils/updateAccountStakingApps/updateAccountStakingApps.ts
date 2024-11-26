import BigNumber from 'bignumber.js';

// constants
import { NETWORK_STAKING_APPS_ANTIQUATED_TIMEOUT } from '@extension/constants';

// models
import NetworkClient from '@extension/models/NetworkClient';
import BaseSCSIndexer from '@extension/models/BaseSCSIndexer';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type { ISCSAccount } from '@extension/models/BaseSCSIndexer';
import type {
  IAccountNetworkStakingApps,
  IAccountStakingApp,
} from '@extension/types';
import type { IOptions } from './types';

// utils
import getRandomItem from '@common/utils/getRandomItem';
import convertAVMAddressToPublicKey from '@extension/utils/convertAVMAddressToPublicKey';

/**
 * Fetches the staking apps for a given address.
 * @param {IOptions} options - options needed to update the staking apps.
 * @returns {Promise<IAccountNetworkStakingApps>} the updated staking apps.
 */
export default async function updateAccountStakingApps({
  address,
  currentNetworkStakingApps,
  delay = 0,
  logger,
  network,
  nodeID,
}: IOptions): Promise<IAccountNetworkStakingApps> {
  const _functionName = 'updateAccountStakingApps';
  const scsIndexer: BaseSCSIndexer | null =
    getRandomItem(network.scsIndexers) || null;
  let scsAccounts: ISCSAccount[];
  let stakingApps: IAccountStakingApp[];
  let networkClient: NetworkClient;

  // if there are no scs indexers or staking apps are not out-of-date just return the current information
  if (
    !scsIndexer ||
    currentNetworkStakingApps.lastUpdatedAt +
      NETWORK_STAKING_APPS_ANTIQUATED_TIMEOUT >
      new Date().getTime()
  ) {
    logger?.debug(
      `${_functionName}: last updated staking apps for "${address}" on "${new Date(
        currentNetworkStakingApps.lastUpdatedAt
      ).toString()}", skipping`
    );

    return currentNetworkStakingApps;
  }

  try {
    scsAccounts = await scsIndexer.fetchByAddress({
      address,
      logger,
    });
  } catch (error) {
    logger?.error(
      `${_functionName}: failed to get staking apps for "${address}" on ${network.genesisId}:`,
      error
    );

    return currentNetworkStakingApps;
  }

  networkClient = new NetworkClient({
    logger,
    network,
  });

  try {
    stakingApps = await Promise.all(
      scsAccounts.map(
        async ({
          contractAddress,
          contractId,
          createRound,
          global_initial,
          global_period,
          global_total,
          // part_vote_fst,
          part_vote_lst,
        }) => {
          const { amount } = await networkClient.accountInformationWithDelay({
            delay,
            address: contractAddress,
            nodeID,
          });
          const accountBalance = new BigNumber(amount.toString());
          const balance = new BigNumber(global_total);
          const lockupStartBlock = await networkClient.block({
            delay,
            round: new BigNumber(createRound.toString()).toFixed(0),
            nodeID,
          });
          // const participationStartBlock = typeof part_vote_fst === 'number' ? await networkClient.block({
          //   delay,
          //   round: new BigNumber(part_vote_fst.toString()).toFixed(0),
          //   nodeID,
          // }) : null;

          return {
            appID: contractId.toString(),
            availableBalance: accountBalance.minus(balance).toFixed(0),
            balance: balance.toFixed(0),
            lockupStartedAt: new BigNumber(
              String(lockupStartBlock.timestamp * BigInt(1000))
            ).toNumber(), // convert to milliseconds
            lockupYears: global_period,
            participationKeyExpiresAt: null, // TODO: estimate when the participation key ends
            phase: new BigNumber(global_initial).toNumber() > 0 ? 1 : 0, // if global_initial is set to "0" this indicates phase 2, otherwise it is phase 1
            publicKey: AccountRepository.encode(
              convertAVMAddressToPublicKey(contractAddress)
            ),
            status: typeof part_vote_lst === 'number' ? 'online' : 'offline',
          };
        }
      )
    );

    logger?.debug(
      `${_functionName}: updated staking apps for "${address}" on "${network.genesisId}"`
    );

    return {
      apps: stakingApps,
      lastUpdatedAt: new Date().getTime(),
    };
  } catch (error) {
    logger?.error(
      `${_functionName}: failed to get staking apps for "${address}" on ${network.genesisId}:`,
      error
    );

    return currentNetworkStakingApps;
  }
}
