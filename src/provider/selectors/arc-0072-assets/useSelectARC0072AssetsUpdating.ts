import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@provider/types';

export default function useSelectARC0072AssetsUpdating(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.arc0072Assets.updating);
}
