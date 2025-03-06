// hooks
import _useTextBackgroundColor from '@common/hooks/useTextBackgroundColor';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

export default function useTextBackgroundColor(): string {
  return _useTextBackgroundColor(useSelectSettingsColorMode());
}
