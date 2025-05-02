import type { ColorMode } from '@chakra-ui/react';

import { theme } from '@common/theme';

export default function usePrimaryRawColorCode(colorMode: ColorMode): string {
  if (colorMode === 'dark') {
    return theme.colors.primaryDark['500'];
  }

  return theme.colors.primaryLight['500'];
}
