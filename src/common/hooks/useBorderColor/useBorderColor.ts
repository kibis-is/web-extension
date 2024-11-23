import type { ColorMode } from '@chakra-ui/react';

export default function useBorderColor(colorMode: ColorMode): string {
  if (colorMode === 'dark') {
    return 'whiteAlpha.400';
  }

  return 'gray.300';
}
