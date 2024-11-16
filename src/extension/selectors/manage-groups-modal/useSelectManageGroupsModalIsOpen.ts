import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@extension/types';

export default function useSelectManageGroupsModalIsOpen(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.manageGroupsModal.isOpen
  );
}
