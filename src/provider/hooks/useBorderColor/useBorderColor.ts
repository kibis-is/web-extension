// hooks
import _useBorderColor from '@common/hooks/useBorderColor';

// selectors
import { useSelectSettingsColorMode } from '@provider/selectors';

export default function useBorderColor(): string {
  return _useBorderColor(useSelectSettingsColorMode());
}
