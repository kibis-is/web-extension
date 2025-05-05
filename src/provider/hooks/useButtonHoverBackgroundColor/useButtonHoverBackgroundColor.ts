// hooks
import _useButtonHoverBackgroundColor from '@common/hooks/useButtonHoverBackgroundColor';

// selectors
import { useSelectSettingsColorMode } from '@provider/selectors';

export default function useButtonHoverBackgroundColor(): string {
  return _useButtonHoverBackgroundColor(useSelectSettingsColorMode());
}
