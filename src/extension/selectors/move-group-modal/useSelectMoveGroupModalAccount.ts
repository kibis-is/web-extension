import { useSelector } from 'react-redux';

// types
import type {
  IAccountWithExtendedProps,
  IMainRootState,
} from '@extension/types';

export default function useSelectMoveGroupModalAccount(): IAccountWithExtendedProps | null {
  return useSelector<IMainRootState, IAccountWithExtendedProps | null>(
    (state) =>
      !!state.moveGroupModal.accountID
        ? state.accounts.items.find(
            (value) => value.id === state.moveGroupModal.accountID
          ) || null
        : null
  );
}
