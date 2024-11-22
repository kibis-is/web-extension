import type { ColorMode } from '@chakra-ui/react';

export default function useTextBackgroundColor(colorMode: ColorMode): string {
  if (colorMode === 'dark') {
    return 'whiteAlpha.400';
  }

  return 'gray.200';
}
