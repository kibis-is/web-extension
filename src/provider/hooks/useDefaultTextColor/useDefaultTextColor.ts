// hooks
import _useDefaultTextColor from '@common/hooks/useDefaultTextColor';

// selectors
import { useSelectSettingsColorMode } from '@provider/selectors';

export default function useDefaultTextColor(): string {
  return _useDefaultTextColor(useSelectSettingsColorMode());
}
