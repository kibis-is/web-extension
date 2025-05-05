// hooks
import _usePrimaryColorScheme from '@common/hooks/usePrimaryColorScheme';

// selectors
import { useSelectSettingsColorMode } from '@provider/selectors';

export default function usePrimaryColorScheme(): string {
  return _usePrimaryColorScheme(useSelectSettingsColorMode());
}
