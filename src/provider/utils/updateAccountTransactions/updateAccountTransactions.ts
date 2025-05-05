// constants
import { DEFAULT_TRANSACTION_INDEXER_LIMIT } from '@provider/constants';

// models
import NetworkClient from '@provider/models/NetworkClient';

// types
import type { IAccountTransactions, IAVMAccountTransaction } from '@provider/types';
import type { IOptions } from './types';

// utils
import mapAVMTransactionToTransaction from '@provider/utils/mapAVMTransactionToTransaction';
import refreshTransactions from '@provider/utils/refreshTransactions';

/**
 * Gets the account transactions.
 * @param {IOptions} options - options needed to fetch account transactions.
 * @returns {Promise<IAccountTransactions>} a promise that resolves to the updated account transactions.
 */
export default async function updateAccountTransactions({
  address,
  currentAccountTransactions,
  delay = 0,
  logger,
  network,
  nodeID,
  refresh = false,
}: IOptions): Promise<IAccountTransactions> {
  const _functionName = 'updateAccountTransactions';
  let avmAccountTransaction: IAVMAccountTransaction;
  let mostRecentTransactionTime: number;
  let networkClient: NetworkClient;

  // if it is a refresh, get all the transactions from the most recent transaction
  if (refresh && currentAccountTransactions.transactions.length > 0) {
    // get the date of the most recent transaction
    mostRecentTransactionTime = currentAccountTransactions.transactions.reduce(
      (acc, value) => (value.completedAt && value.completedAt > acc ? value.completedAt : acc),
      0
    );

    return {
      ...currentAccountTransactions,
      transactions: [
        // get the most recent transactions
        ...(await refreshTransactions({
          address,
          afterTime: mostRecentTransactionTime,
          logger,
          network,
          next: null,
          nodeID,
        })),
        ...currentAccountTransactions.transactions,
      ],
    };
  }

  networkClient = new NetworkClient({ logger, network });

  try {
    avmAccountTransaction = await networkClient.lookupAccountTransactionWithDelay({
      address,
      afterTime: null,
      delay,
      limit: DEFAULT_TRANSACTION_INDEXER_LIMIT,
      next: currentAccountTransactions.next,
      nodeID,
    });

    logger?.debug(
      `${_functionName}: updated account transactions for account "${address}" for network "${network.genesisId}"`
    );

    return {
      next: avmAccountTransaction['next-token'] || null,
      transactions: [
        ...currentAccountTransactions.transactions,
        ...avmAccountTransaction.transactions.map(mapAVMTransactionToTransaction),
      ],
    };
  } catch (error) {
    logger?.error(
      `${_functionName}: failed to get account transactions for "${address}" on ${network.genesisId}:`,
      error
    );

    return currentAccountTransactions;
  }
}
