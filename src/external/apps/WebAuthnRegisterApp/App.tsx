import '@external/styles/fonts.css';
import { ChakraProvider } from '@chakra-ui/react';
import React, { type FC, useEffect, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';

// containers
import Root from './Root';

// hooks
import useWebAuthnRegister from '@external/hooks/useWebAuthnRegister';

// managers
import ColorModeManager from '@common/managers/ColorModeManager';

// theme
import { theme } from '@common/theme';

// types
import type { IAppProps } from './types';

const App: FC<IAppProps> = ({
  clientInfo,
  config,
  credentialCreationOptions,
  i18n,
  logger,
  navigatorCredentialsCreateFn,
  onClose,
  onResponse,
  webAuthnMessageManager,
}) => {
  // hooks
  const { error, registerAction, result } = useWebAuthnRegister({
    logger,
    webAuthnMessageManager,
  });
  // memos
  const colorMode = useMemo(
    () => config.theme.colorMode,
    [config.theme.colorMode]
  );
  const _name = useMemo<string>(() => 'WebAuthnRegisterApp', []);
  const fontFamily = useMemo(() => config.theme.font, [config.theme.font]);
  // handlers
  const handleOnCancelClick = () => {
    onResponse(
      navigatorCredentialsCreateFn.call(this, credentialCreationOptions)
    );
    onClose();
  };
  const handleOnRegisterClick = async () => {
    const _functionName = 'handleOnRegisterClick';

    if (!result) {
      logger?.debug(`${_name}#${_functionName}: no credentials found`);

      return;
    }

    onResponse(result.credential);
  };
  const handleOnTryAgainClick = async () => {
    await registerAction({
      clientInfo,
      publicKeyCreationOptions: credentialCreationOptions.publicKey || null,
    });
  };

  useEffect(() => {
    (async () => {
      await registerAction({
        clientInfo,
        publicKeyCreationOptions: credentialCreationOptions.publicKey || null,
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
            body: fontFamily,
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
          onTryAgainClick={handleOnTryAgainClick}
          result={result}
        />
      </ChakraProvider>
    </I18nextProvider>
  );
};

export default App;
