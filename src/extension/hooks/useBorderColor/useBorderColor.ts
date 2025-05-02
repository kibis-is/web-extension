// hooks
import _useBorderColor from '@common/hooks/useBorderColor';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

export default function useBorderColor(): string {
  return _useBorderColor(useSelectSettingsColorMode());
}
