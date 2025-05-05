import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@provider/types';

export default function useSelectStandardAssetsUpdating(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.standardAssets.updating);
}
