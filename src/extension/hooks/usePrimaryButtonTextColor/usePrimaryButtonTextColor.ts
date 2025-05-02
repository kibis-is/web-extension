// hooks
import _usePrimaryButtonTextColor from '@common/hooks/usePrimaryButtonTextColor';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

export default function usePrimaryButtonTextColor(): string {
  return _usePrimaryButtonTextColor(useSelectSettingsColorMode());
}
