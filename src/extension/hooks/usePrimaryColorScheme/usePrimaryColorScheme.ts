// hooks
import _usePrimaryColorScheme from '@common/hooks/usePrimaryColorScheme';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

export default function usePrimaryColorScheme(): string {
  return _usePrimaryColorScheme(useSelectSettingsColorMode());
}
