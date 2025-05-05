// hooks
import _usePrimaryColor from '@common/hooks/usePrimaryColor';

// selectors
import { useSelectSettingsColorMode } from '@provider/selectors';

export default function usePrimaryColor(): string {
  return _usePrimaryColor(useSelectSettingsColorMode());
}
