import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@provider/types';

export default function useSelectRemoveAssetsConfirming(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.removeAssets.confirming);
}
