import { ChakraProvider, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { I18nextProvider } from 'react-i18next';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// managers
import ColorModeManager from '@common/managers/ColorModeManager';

// theme
import { theme } from '@extension/theme';

// types
import type { IProps } from './types';

const WebAuthnRequestApp: FC<IProps> = ({
  i18n,
  initialColorMode,
  initialFontFamily,
}) => {
  return (
    <I18nextProvider i18n={i18n}>
      <ChakraProvider
        colorModeManager={new ColorModeManager(initialColorMode)}
        theme={{
          ...theme,
          fonts: {
            body: initialFontFamily,
            heading: initialFontFamily,
          },
        }}
      >
        <VStack borderRadius={theme.radii['3xl']} p={DEFAULT_GAP}></VStack>
      </ChakraProvider>
    </I18nextProvider>
  );
};

export default WebAuthnRequestApp;
