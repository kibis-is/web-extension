import type { ColorMode } from '@chakra-ui/react';

export default function usePrimaryColor(colorMode: ColorMode): string {
  if (colorMode === 'dark') {
    return 'primaryDark.500';
  }

  return 'primaryLight.500';
}
