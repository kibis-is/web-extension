import { useSelector } from 'react-redux';

// types
import type { IMainRootState, INetworkWithTransactionParams } from '@provider/types';

// utils
import supportedNetworksFromSettings from '@provider/utils/supportedNetworksFromSettings';

/**
 * Fetches all the available networks. Availability is subject to the settings.
 * @returns {INetworkWithTransactionParams[]} the available networks.
 */
export default function useSelectNetworks(): INetworkWithTransactionParams[] {
  return useSelector<IMainRootState, INetworkWithTransactionParams[]>(({ networks, settings }) =>
    supportedNetworksFromSettings({
      networks: networks.items,
      settings,
    })
  );
}
