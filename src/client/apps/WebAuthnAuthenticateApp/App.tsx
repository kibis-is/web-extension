import '@client/styles/fonts.css';
import { ChakraProvider } from '@chakra-ui/react';
import React, { type FC, useEffect, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';

// containers
import Root from './Root';

// hooks
import useWebAuthn from '@client/hooks/useWebAuthn';

// managers
import ColorModeManager from '@common/managers/ColorModeManager';

// theme
import { theme } from '@common/theme';

// types
import type { IAppProps } from './types';

const App: FC<IAppProps> = ({
  clientInfo,
  config,
  credentialRequestOptions,
  i18n,
  logger,
  navigatorCredentialsGetFn,
  onClose,
  onResponse,
  webAuthnMessageManager,
}) => {
  // hooks
  const { authenticateAction, error, result } = useWebAuthn({
    logger,
    webAuthnMessageManager,
  });
  // memos
  const colorMode = useMemo(
    () => config.theme.colorMode,
    [config.theme.colorMode]
  );
  const _name = useMemo<string>(() => 'WebAuthnAuthenticateApp', []);
  const fontFamily = useMemo(() => config.theme.font, [config.theme.font]);
  // handlers
  const handleOnCancelClick = () => {
    onResponse(navigatorCredentialsGetFn.call(this, credentialRequestOptions));
    onClose();
  };
  const handleOnAuthenticateClick = async () => {
    const __function = 'handleOnAuthenticateClick';

    if (!result) {
      logger?.debug(`${_name}#${__function}: no credentials found`);

      return;
    }

    onResponse(result.credential);
    onClose();
  };
  const handleOnTryAgainClick = async () => {
    await authenticateAction({
      clientInfo,
      publicKeyOptions: credentialRequestOptions.publicKey || null,
    });
  };

  useEffect(() => {
    (async () => {
      await authenticateAction({
        clientInfo,
        publicKeyOptions: credentialRequestOptions.publicKey || null,
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
          onAuthenticateClick={handleOnAuthenticateClick}
          onCancelClick={handleOnCancelClick}
          onTryAgainClick={handleOnTryAgainClick}
          result={result}
        />
      </ChakraProvider>
    </I18nextProvider>
  );
};

export default App;
