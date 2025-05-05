import { useSelector } from 'react-redux';

// features
import type { IConfirmModal } from '@provider/features/layout';

// types
import type { IBaseRootState } from '@provider/types';

export default function useSelectConfirmModal(): IConfirmModal | null {
  return useSelector<IBaseRootState, IConfirmModal | null>((state) => state.layout.confirmModal);
}
