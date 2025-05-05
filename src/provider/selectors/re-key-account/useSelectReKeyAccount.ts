import { useSelector } from 'react-redux';

// types
import type { IAccountWithExtendedProps, IMainRootState } from '@provider/types';

export default function useSelectReKeyAccount(): IAccountWithExtendedProps | null {
  return useSelector<IMainRootState, IAccountWithExtendedProps | null>(({ reKeyAccount }) => reKeyAccount.account);
}
