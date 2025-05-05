// models
import NetworkClient from '@provider/models/NetworkClient';

// types
import type { IAVMAsset, IStandardAsset, ITinyManAssetResponse } from '@provider/types';
import type { IOptions } from './types';

// utils
import mapStandardAssetFromAlgorandAsset from '../mapStandardAssetFromAlgorandAsset';

/**
 * Gets the standard asset information.
 * @param {IOptions} options - options needed to fetch the standard asset information.
 * @returns {Promise<IStandardAsset | null>} the standard asset information, or null if there was an error.
 */
export default async function updateStandardAssetInformationById({
  delay = 0,
  id,
  logger,
  network,
  nodeID,
  verifiedAssetList,
}: IOptions): Promise<IStandardAsset | null> {
  const _functionName = 'updateStandardAssetInformationById';
  const networkClient = new NetworkClient({ logger, network });
  let assetInformation: IAVMAsset;
  let verifiedAsset: ITinyManAssetResponse | null;

  try {
    assetInformation = await networkClient.standardAssetInformationByIDWithDelay({
      delay,
      id,
      nodeID,
    });
    verifiedAsset = verifiedAssetList.find((value) => value.id === id) || null;

    return mapStandardAssetFromAlgorandAsset(assetInformation, verifiedAsset?.logo.svg || null, !!verifiedAsset);
  } catch (error) {
    logger?.error(
      `${_functionName}: failed to get asset information for asset "${id}" at "${network.genesisId}":`,
      error
    );

    return null;
  }
}
