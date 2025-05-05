import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@provider/types';

// utils
import selectNodeIDByGenesisHashFromSettings from '@provider/utils/selectNodeIDByGenesisHashFromSettings/selectNodeIDByGenesisHashFromSettings';

/**
 * Gets the currently selected node ID by genesis hash from the settings. If no node ID has been selected, null will be
 * returned.
 * @param {string} genesisHash - the genesis hash to select the node ID from.
 * @returns {string | null} the current node ID for the supplied genesis hash.
 */
export default function useSelectSettingsNodeIDByGenesisHash(genesisHash: string): string | null {
  return useSelector<IMainRootState, string | null>(({ settings }) =>
    selectNodeIDByGenesisHashFromSettings({ genesisHash, settings })
  );
}
