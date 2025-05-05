import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { NetworkTypeEnum } from '@provider/enums';
import { ThunkEnum } from '../enums';

// features
import { sendSettingsUpdatedThunk } from '@provider/features/messages';

// repositories
import SettingsRepository from '@provider/repositories/SettingsRepository';

// types
import type { IBaseAsyncThunkConfig, IMainRootState, ISettings } from '@provider/types';

// utils
import convertGenesisHashToHex from '@provider/utils/convertGenesisHashToHex';
import selectDefaultNetwork from '@provider/utils/selectDefaultNetwork';
import selectNetworkFromSettings from '@provider/utils/selectNetworkFromSettings';
import serialize from '@provider/utils/serialize';

const saveToStorageThunk: AsyncThunk<
  ISettings, // return
  ISettings, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<ISettings, ISettings, IBaseAsyncThunkConfig<IMainRootState>>(
  ThunkEnum.SaveToStorage,
  async (settings, { getState, dispatch }) => {
    const networks = getState().networks.items;
    let _settings = serialize(settings); // copy the readonly incoming settings
    let network = selectNetworkFromSettings({
      networks,
      settings,
    });
    let encodedGenesisHash: string;

    // if the betanet/testnet has been disallowed and the selected network is one of the disallowed, set it to a main one
    if (
      !network ||
      (!settings.advanced.allowBetaNet && network.type === NetworkTypeEnum.Beta) ||
      (!settings.advanced.allowTestNet && network.type === NetworkTypeEnum.Test)
    ) {
      network = selectDefaultNetwork(networks);
      encodedGenesisHash = convertGenesisHashToHex(network.genesisHash);

      _settings.general.preferredBlockExplorerIds[encodedGenesisHash] = network.blockExplorers[0]?.id || null;
      _settings.general.preferredNFTExplorerIds[encodedGenesisHash] = network.nftExplorers[0]?.id || null;
      _settings.general.selectedNetworkGenesisHash = network.genesisHash;
    }

    // broadcast the settings have updated
    dispatch(sendSettingsUpdatedThunk());

    return await new SettingsRepository().save(_settings);
  }
);

export default saveToStorageThunk;
