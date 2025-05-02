// hooks
import _useSubTextColor from '@common/hooks/useSubTextColor';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

export default function useSubTextColor(): string {
  return _useSubTextColor(useSelectSettingsColorMode());
}
