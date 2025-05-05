import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@provider/types';

export default function useSelectSendAssetCreating(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.sendAssets.creating);
}
