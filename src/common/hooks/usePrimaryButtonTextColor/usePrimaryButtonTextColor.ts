import type { ColorMode } from '@chakra-ui/react';

export default function usePrimaryButtonTextColor(
  colorMode: ColorMode
): string {
  if (colorMode === 'dark') {
    return 'gray.800';
  }

  return 'white';
}
