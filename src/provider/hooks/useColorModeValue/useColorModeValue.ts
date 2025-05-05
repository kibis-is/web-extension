// selectors
import { useSelectSettingsColorMode } from '@provider/selectors';

export default function useColorModeValue<LightValue = unknown, DarkValue = unknown>(
  lightValue: LightValue,
  darkValue: DarkValue
): LightValue | DarkValue {
  if (useSelectSettingsColorMode() === 'dark') {
    return darkValue;
  }

  return lightValue;
}
