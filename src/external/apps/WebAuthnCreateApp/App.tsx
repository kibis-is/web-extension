import '@common/styles/fonts.css';
import { ChakraProvider, SlideFade } from '@chakra-ui/react';
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
  const [fetching, setFetching] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  // handlers
  const handleOnCancelClick = () => {
    onResponse(navigatorCredentialsCreateFn.call(this, options));
    setIsOpen(false);
  };
  const handleOnRegisterClick = () => {};
  const handleOnSelect = () => {};

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
            fetching={fetching}
            fontFamily={initialFontFamily}
            onCancelClick={handleOnCancelClick}
            onRegisterClick={handleOnRegisterClick}
            onSelect={handleOnSelect}
            saving={saving}
          />
        </SlideFade>
      </ChakraProvider>
    </I18nextProvider>
  );
};

export default App;
