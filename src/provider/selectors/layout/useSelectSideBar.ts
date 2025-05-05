import { useSelector } from 'react-redux';

// types
import type { IBaseRootState } from '@provider/types';

export default function useSelectSideBar(): boolean {
  return useSelector<IBaseRootState, boolean>((state) => state.layout.sidebar);
}
