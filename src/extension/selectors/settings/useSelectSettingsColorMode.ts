import type { ColorMode } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

// types
import type { IBaseRootState } from '@extension/types';

export default function useSelectSettingsColorMode(): ColorMode {
  return useSelector<IBaseRootState, ColorMode>(
    ({ settings }) => settings.appearance.theme
  );
}
