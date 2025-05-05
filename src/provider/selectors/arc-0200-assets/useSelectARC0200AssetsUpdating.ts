import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@provider/types';

export default function useSelectARC0200AssetsUpdating(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.arc0200Assets.updating);
}
