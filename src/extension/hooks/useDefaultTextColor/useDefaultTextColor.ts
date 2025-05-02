// hooks
import _useDefaultTextColor from '@common/hooks/useDefaultTextColor';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

export default function useDefaultTextColor(): string {
  return _useDefaultTextColor(useSelectSettingsColorMode());
}
