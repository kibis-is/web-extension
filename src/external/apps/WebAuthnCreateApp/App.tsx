import '@common/styles/fonts.css';
import { ChakraProvider, SlideFade, useDisclosure } from '@chakra-ui/react';
import React, { type FC, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

// containers
import Root from './Root';

// managers
import ColorModeManager from '@common/managers/ColorModeManager';

// theme
import { theme } from '@extension/theme';

// types
import type { IAppProps } from './types';

const App: FC<IAppProps> = ({
  clientInfo,
  i18n,
  initialColorMode,
  initialFontFamily,
  navigatorCredentialsCreateFn,
  onClose,
  onResponse,
  options,
}) => {
  // states
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // handlers
  const handleOnCancel = () => {
    onResponse(navigatorCredentialsCreateFn.call(this, options));
    setIsOpen(false);
  };

  useEffect(() => setIsOpen(true), []);

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
        <SlideFade
          in={isOpen}
          offsetY="20px"
          onAnimationComplete={(type) => type === 'exit' && onClose()}
        >
          <Root
            clientInfo={clientInfo}
            colorMode={initialColorMode}
            fontFamily={initialFontFamily}
            onCancel={handleOnCancel}
          />
        </SlideFade>
      </ChakraProvider>
    </I18nextProvider>
  );
};

export default App;
