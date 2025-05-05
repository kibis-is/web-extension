import { useSelector } from 'react-redux';

// types
import type { IBaseRootState, ISystemInfo } from '@provider/types';

export default function useSelectSystemInfo(): ISystemInfo | null {
  return useSelector<IBaseRootState, ISystemInfo | null>((state) => state.system.info);
}
