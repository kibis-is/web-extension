import { useSelector } from 'react-redux';

// types
import type { ILogger } from '@common/types';
import type { IBaseRootState } from '@provider/types';

export default function useSelectLogger(): ILogger {
  return useSelector<IBaseRootState, ILogger>((state) => state.system.logger);
}
