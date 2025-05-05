import { useSelector } from 'react-redux';

// types
import type { IBackgroundRootState, IMainRootState, IPasskeyCredential } from '@provider/types';

export default function useSelectPasskeysPasskey(): IPasskeyCredential | null {
  return useSelector<IBackgroundRootState | IMainRootState, IPasskeyCredential | null>(
    (state) => state.passkeys.passkey
  );
}
