import { useSelector } from 'react-redux';

// types
import type { IBaseRootState, IWhatsNewInfo } from '@provider/types';

export default function useSelectSystemWhatsNewInfo(): IWhatsNewInfo | null {
  return useSelector<IBaseRootState, IWhatsNewInfo | null>((state) => state.system.info?.whatsNewInfo || null);
}
