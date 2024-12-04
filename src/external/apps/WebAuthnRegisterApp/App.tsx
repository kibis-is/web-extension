import '@external/styles/fonts.css';
import { ChakraProvider } from '@chakra-ui/react';
import React, { type FC, useEffect, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';

// containers
import Root from './Root';

// hooks
import useTheme from '@external/hooks/useTheme';
import useWebAuthnRegister from '@external/hooks/useWebAuthnRegister';

// managers
import ColorModeManager from '@common/managers/ColorModeManager';

// theme
import { theme } from '@common/theme';

// types
import type { IAppProps } from './types';

const App: FC<IAppProps> = ({
  clientInfo,
  i18n,
  initialColorMode,
  initialFontFamily,
  logger,
  navigatorCredentialsCreateFn,
  onClose,
  onResponse,
  publicKeyCreationOptions,
}) => {
  // hooks
  const { theme: _theme, fetchThemeAction } = useTheme({ logger });
  const { error, registerAction, result } = useWebAuthnRegister({ logger });
  // memos
  const colorMode = useMemo(
    () => _theme?.colorMode || initialColorMode,
    [_theme]
  );
  const fontFamily = useMemo(() => _theme?.font || initialFontFamily, [_theme]);
  // handlers
  const handleOnCancelClick = () => {
    onResponse(
      navigatorCredentialsCreateFn.call(this, publicKeyCreationOptions)
    );
    onClose();
  };
  const handleOnRegisterClick = async () => {
    const _functionName = 'handleOnRegisterClick';

    if (!result) {
      logger?.debug(
        `WebAuthnRegisterApp#${_functionName}: no credentials found`
      );

      return;
    }

    onResponse(result.credential);
  };

  useEffect(() => {
    (async () => {
      await fetchThemeAction();
      await registerAction({
        clientInfo,
        publicKeyCreationOptions,
      });
    })();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <ChakraProvider
        colorModeManager={new ColorModeManager(colorMode)}
        theme={{
          ...theme,
          fonts: {
            body: initialFontFamily,
            heading: fontFamily,
          },
        }}
      >
        <Root
          clientInfo={clientInfo}
          colorMode={colorMode}
          error={error}
          fontFamily={fontFamily}
          onCancelClick={handleOnCancelClick}
          onRegisterClick={handleOnRegisterClick}
          result={result}
        />
      </ChakraProvider>
    </I18nextProvider>
  );
};

export default App;
