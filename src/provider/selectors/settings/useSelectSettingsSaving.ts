import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@provider/types';

export default function useSelectSettingsSaving(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.settings.saving);
}
