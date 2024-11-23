import type { ColorMode } from '@chakra-ui/react';

import { theme } from '@common/theme';

export default function useSubTextRawColorCode(colorMode: ColorMode): string {
  if (colorMode === 'dark') {
    return theme.colors.whiteAlpha['700'];
  }

  return theme.colors.gray['500'];
}
