// config
import { networks } from '@provider/config';

// repositories
import NetworksRepository from '@provider/repositories/NetworksRepository';

// types
import type { INetworkWithTransactionParams } from '@provider/types';
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
