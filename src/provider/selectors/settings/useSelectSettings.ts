import { useSelector } from 'react-redux';

// features
import { filterSettingsFromState } from '@provider/features/settings';

// types
import type { IMainRootState, ISettings } from '@provider/types';

export default function useSelectSettings(): ISettings {
  return useSelector<IMainRootState, ISettings>((state) => filterSettingsFromState(state.settings));
}
