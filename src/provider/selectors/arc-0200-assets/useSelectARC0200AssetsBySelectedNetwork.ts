import { useSelector } from 'react-redux';

// types
import type { IARC0200Asset, IMainRootState } from '@provider/types';

// utils
import convertGenesisHashToHex from '@provider/utils/convertGenesisHashToHex';
import selectNetworkFromSettings from '@provider/utils/selectNetworkFromSettings';

/**
 * Selects all the ARC200 assets for the selected network.
 * @returns {IARC0200Asset[]} all network ARC200 assets for the selected network.
 */
export default function useSelectARC0200AssetsBySelectedNetwork(): IARC0200Asset[] {
  return useSelector<IMainRootState, IARC0200Asset[]>((state) => {
    const network = selectNetworkFromSettings({
      networks: state.networks.items,
      settings: state.settings,
    });

    if (!network) {
      return [];
    }

    return state.arc0200Assets.items ? state.arc0200Assets.items[convertGenesisHashToHex(network.genesisHash)] : [];
  });
}
