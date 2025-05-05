import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { StandardAssetsThunkEnum } from '@provider/enums';

// repositories
import StandardAssetRepository from '@provider/repositories/StandardAssetRepository';

// types
import type { IBackgroundRootState, IBaseAsyncThunkConfig, IMainRootState, IStandardAsset } from '@provider/types';

// utils
import convertGenesisHashToHex from '@provider/utils/convertGenesisHashToHex';

const fetchStandardAssetsFromStorageThunk: AsyncThunk<
  Record<string, IStandardAsset[]>, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  Record<string, IStandardAsset[]>,
  undefined,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(StandardAssetsThunkEnum.FetchAssetsFromStorage, async (_, { getState }) => {
  const logger = getState().system.logger;
  const networks = getState().networks.items;
  const assetItems: Record<string, IStandardAsset[]> = {};

  await Promise.all(
    networks.map(
      async (network) =>
        (assetItems[convertGenesisHashToHex(network.genesisHash)] =
          await new StandardAssetRepository().fetchByGenesisHash(network.genesisHash))
    )
  );

  logger.debug(`${StandardAssetsThunkEnum.FetchAssetsFromStorage}: fetched assets from storage`);

  return assetItems;
});

export default fetchStandardAssetsFromStorageThunk;
