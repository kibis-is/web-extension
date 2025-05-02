import type { ColorMode } from '@chakra-ui/react';

export default function useDefaultTextColor(colorMode: ColorMode): string {
  if (colorMode === 'dark') {
    return 'whiteAlpha.800';
  }

  return 'gray.600';
}
