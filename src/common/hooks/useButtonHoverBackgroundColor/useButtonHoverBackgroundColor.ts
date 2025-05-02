import type { ColorMode } from '@chakra-ui/react';

export default function useButtonHoverBackgroundColor(
  colorMode: ColorMode
): string {
  if (colorMode === 'dark') {
    return 'whiteAlpha.100';
  }

  return 'gray.100';
}
