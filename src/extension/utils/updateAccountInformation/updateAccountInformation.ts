// constants
import { ACCOUNT_INFORMATION_ANTIQUATED_TIMEOUT } from '@extension/constants';

// models
import NetworkClient from '@extension/models/NetworkClient';

// types
import type {
  IAccountInformation,
  IAVMAccountInformation,
  IARC0072AssetHolding,
  IARC0200AssetHolding,
} from '@extension/types';
import type { IOptions } from './types';

// utils
import mapAVMAccountInformationToAccount from '../mapAVMAccountInformationToAccount';

/**
 * Fetches the account information for a given address.
 * @param {IOptions} options - options needed to update the account information.
 * @returns {Promise<IAccountInformation>} the updated account information.
 */
export default async function updateAccountInformation({
  address,
  currentAccountInformation,
  delay = 0,
  forceUpdate = false,
  logger,
  network,
  nodeID,
}: IOptions): Promise<IAccountInformation> {
  const __function = 'updateAccountInformation';
  let avmAccountInformation: IAVMAccountInformation;
  let arc0072AssetHoldings: IARC0072AssetHolding[];
  let arc200AssetHoldings: IARC0200AssetHolding[];
  let enVoiNames: string[];
  let networkClient: NetworkClient;

  // if the account information is not out-of-date just return the account
  if (
    !forceUpdate &&
    currentAccountInformation.updatedAt &&
    currentAccountInformation.updatedAt +
      ACCOUNT_INFORMATION_ANTIQUATED_TIMEOUT >
      new Date().getTime()
  ) {
    logger?.debug(
      `${__function}: last updated account information for "${address}" on "${new Date(
        currentAccountInformation.updatedAt
      ).toString()}", skipping`
    );

    return currentAccountInformation;
  }

  networkClient = new NetworkClient({
    logger,
    network,
  });

  try {
    avmAccountInformation = await networkClient.accountInformationWithDelay({
      address,
      delay,
      nodeID,
    });
    arc0072AssetHoldings = await networkClient.arc0072AssetHoldingsWithDelay({
      address,
      delay,
      nodeID,
    });
    arc200AssetHoldings = await Promise.all(
      currentAccountInformation.arc200AssetHoldings.map(
        async (value) =>
          await networkClient.arc0200AssetHoldingWithDelay({
            address,
            assetID: value.id,
            delay,
            nodeID,
          })
      )
    );
    enVoiNames = network.enVoi ? await network.enVoi.names(address) : [];

    logger?.debug(
      `${__function}: updated account information for account "${address}" for network "${network.genesisId}"`
    );

    return mapAVMAccountInformationToAccount(avmAccountInformation, {
      ...currentAccountInformation,
      arc0072AssetHoldings,
      arc200AssetHoldings,
      enVoi: {
        ...currentAccountInformation.enVoi,
        items: enVoiNames,
      },
    });
  } catch (error) {
    logger?.error(
      `${__function}: failed to get account information for "${address}" on ${network.genesisId}:`,
      error
    );

    return currentAccountInformation;
  }
}
