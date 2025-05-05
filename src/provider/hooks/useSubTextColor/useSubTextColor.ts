// hooks
import _useSubTextColor from '@common/hooks/useSubTextColor';

// selectors
import { useSelectSettingsColorMode } from '@provider/selectors';

export default function useSubTextColor(): string {
  return _useSubTextColor(useSelectSettingsColorMode());
}
