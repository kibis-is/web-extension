import { useSelector } from 'react-redux';

// types
import type { IBaseRootState } from '@provider/types';

export default function useSelectWhatsNewModal(): boolean {
  return useSelector<IBaseRootState, boolean>((state) => state.layout.whatsNewModal);
}
