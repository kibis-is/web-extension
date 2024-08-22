import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import NetworksService from '@extension/services/NetworksService';

// types
import type {
  IBaseAsyncThunkConfig,
  ICustomNode,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

const addCustomNodeThunk: AsyncThunk<
  INetworkWithTransactionParams[], // return
  ICustomNode, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  INetworkWithTransactionParams[],
  ICustomNode,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.AddCustomNodeThunk, async (customNode, { getState }) => {
  const networks = getState().networks.items;
  const networksService = new NetworksService();
  let network =
    networks.find((value) => value.genesisHash === customNode.genesisHash) ||
    null;

  if (!network) {
    return networks;
  }

  network = await networksService.save({
    ...network,
    ...(customNode.algod && {
      algods: [
        ...network.algods,
        {
          ...customNode.algod,
          canonicalName: customNode.name,
          id: customNode.id,
        },
      ],
    }),
    ...(customNode.indexer && {
      indexers: [
        ...network.indexers,
        {
          ...customNode.indexer,
          canonicalName: customNode.name,
          id: customNode.id,
        },
      ],
    }),
  });

  return networks.map((value) =>
    value.genesisHash === network?.genesisHash ? network : value
  );
});

export default addCustomNodeThunk;
