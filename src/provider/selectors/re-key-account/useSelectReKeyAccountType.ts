import { useSelector } from 'react-redux';

// types
import type { TReKeyType } from '@provider/features/re-key-account';
import type { IMainRootState } from '@provider/types';

export default function useSelectReKeyAccountType(): TReKeyType | null {
  return useSelector<IMainRootState, TReKeyType | null>(({ reKeyAccount }) => reKeyAccount.type);
}
