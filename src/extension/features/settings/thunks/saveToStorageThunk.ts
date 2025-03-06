import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { NetworkTypeEnum } from '@extension/enums';
import { ThunkEnum } from '../enums';

// features
import { sendSettingsUpdatedThunk } from '@extension/features/messages';

// repositories
import SettingsRepository from '@extension/repositories/SettingsRepository';

// types
import type {
  IBaseAsyncThunkConfig,
  IMainRootState,
  ISettings,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import serialize from '@extension/utils/serialize';

const saveToStorageThunk: AsyncThunk<
  ISettings, // return
  ISettings, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  ISettings,
  ISettings,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.SaveToStorage, async (settings, { getState, dispatch }) => {
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
    (!settings.advanced.allowBetaNet &&
      network.type === NetworkTypeEnum.Beta) ||
    (!settings.advanced.allowTestNet && network.type === NetworkTypeEnum.Test)
  ) {
    network = selectDefaultNetwork(networks);
    encodedGenesisHash = convertGenesisHashToHex(network.genesisHash);

    _settings.general.preferredBlockExplorerIds[encodedGenesisHash] =
      network.blockExplorers[0]?.id || null;
    _settings.general.preferredNFTExplorerIds[encodedGenesisHash] =
      network.nftExplorers[0]?.id || null;
    _settings.general.selectedNetworkGenesisHash = network.genesisHash;
  }

  // broadcast the settings have updated
  dispatch(sendSettingsUpdatedThunk());

  return await new SettingsRepository().save(_settings);
});

export default saveToStorageThunk;
