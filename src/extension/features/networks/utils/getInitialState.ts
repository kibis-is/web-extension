// config
import { networks } from '@extension/config';

// repositories
import NetworksRepository from '@extension/repositories/NetworksRepository';

// types
import type { INetworkWithTransactionParams } from '@extension/types';
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    fetching: false,
    items: networks.map<INetworkWithTransactionParams>((value) => ({
      ...value,
      ...NetworksRepository.initializeDefaultTransactionParams(),
    })),
    pollingId: null,
    saving: false,
    updating: false,
  };
}
