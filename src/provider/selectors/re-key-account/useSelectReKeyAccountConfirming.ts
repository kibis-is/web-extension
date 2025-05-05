import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@provider/types';

export default function useSelectReKeyAccountConfirming(): boolean {
  return useSelector<IMainRootState, boolean>(({ reKeyAccount }) => reKeyAccount.confirming);
}
