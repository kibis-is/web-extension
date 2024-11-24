import '@external/styles/fonts.css';
import { ChakraProvider } from '@chakra-ui/react';
import React, { type FC, useEffect, useMemo, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

// containers
import Root from './Root';

// hooks
import useAccounts from '@external/hooks/useAccounts';
import useTheme from '@external/hooks/useTheme';

// managers
import ColorModeManager from '@common/managers/ColorModeManager';

// theme
import { theme } from '@common/theme';

// types
import type { IExternalAccount } from '@common/types';
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
  options,
}) => {
  // hooks
  const { accounts, fetching, fetchAccountsAction } = useAccounts({ logger });
  const { theme: _theme, fetchThemeAction } = useTheme({ logger });
  // memos
  const colorMode = useMemo(
    () => _theme?.colorMode || initialColorMode,
    [_theme]
  );
  const fontFamily = useMemo(() => _theme?.font || initialFontFamily, [_theme]);
  // states
  const [account, setAccount] = useState<IExternalAccount | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  // handlers
  const handleOnCancelClick = () => {
    onResponse(navigatorCredentialsCreateFn.call(this, options));
    onClose();
  };
  const handleOnRegisterClick = () => {};
  const handleOnSelect = (_account: IExternalAccount) => setAccount(_account);

  useEffect(() => {
    (async () => {
      await fetchThemeAction();
      await fetchAccountsAction();
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
          accounts={accounts}
          clientInfo={clientInfo}
          colorMode={colorMode}
          fetching={fetching}
          fontFamily={fontFamily}
          onCancelClick={handleOnCancelClick}
          onRegisterClick={handleOnRegisterClick}
          onSelect={handleOnSelect}
          saving={saving}
          selectedAccount={account}
        />
      </ChakraProvider>
    </I18nextProvider>
  );
};

export default App;
