import type { ColorMode } from '@chakra-ui/react';

export default function usePrimaryColorScheme(colorMode: ColorMode): string {
  if (colorMode === 'dark') {
    return 'primaryDark';
  }

  return 'primaryLight';
}
