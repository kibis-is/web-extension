import type { ColorMode } from '@chakra-ui/react';

export default function useSubTextColor(colorMode: ColorMode): string {
  if (colorMode === 'dark') {
    return 'whiteAlpha.700';
  }

  return 'gray.500';
}
