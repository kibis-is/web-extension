import { useSelector } from 'react-redux';

// types
import type { IBackgroundRootState, IMainRootState } from '@provider/types';

export default function useSelectCredentialLockActive(): boolean {
  return useSelector<IBackgroundRootState | IMainRootState, boolean>((state) => state.credentialLock.active);
}
