// hooks
import _usePrimaryButtonTextColor from '@common/hooks/usePrimaryButtonTextColor';

// selectors
import { useSelectSettingsColorMode } from '@provider/selectors';

export default function usePrimaryButtonTextColor(): string {
  return _usePrimaryButtonTextColor(useSelectSettingsColorMode());
}
