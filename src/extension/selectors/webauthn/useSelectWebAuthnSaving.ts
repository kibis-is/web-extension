import { useSelector } from 'react-redux';

// types
import type { IBackgroundRootState, IMainRootState } from '@extension/types';

export default function useSelectWebAuthnSaving(): boolean {
  return useSelector<IBackgroundRootState | IMainRootState, boolean>(
    ({ webauthn }) => webauthn.saving
  );
}
