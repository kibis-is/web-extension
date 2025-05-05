import { combineReducers, type Store } from '@reduxjs/toolkit';
import React, { type FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

// components
import ThemeProvider from '@provider/components/ThemeProvider';
import Root from './Root';

// features
import { reducer as accountsReducer } from '@provider/features/accounts';
import { reducer as arc200AssetsReducer } from '@provider/features/arc0200-assets';
import { reducer as credentialLockReducer } from '@provider/features/credential-lock';
import { reducer as eventsReducer } from '@provider/features/events';
import { reducer as layoutReducer } from '@provider/features/layout';
import { reducer as messagesReducer } from '@provider/features/messages';
import { reducer as networksReducer } from '@provider/features/networks';
import { reducer as passkeysReducer } from '@provider/features/passkeys';
import { reducer as sessionsReducer } from '@provider/features/sessions';
import { reducer as settingsReducer } from '@provider/features/settings';
import { reducer as standardAssetsReducer } from '@provider/features/standard-assets';
import { reducer as systemReducer } from '@provider/features/system';
import { reducer as webauthnReducer } from '@provider/features/webauthn';

// types
import type { IAppProps, IBackgroundRootState } from '@provider/types';

// utils
import makeStore from '@provider/utils/makeStore';

const App: FC<IAppProps> = ({ i18n, initialColorMode, initialFontFamily }) => {
  const store: Store<IBackgroundRootState> = makeStore<IBackgroundRootState>(
    combineReducers({
      accounts: accountsReducer,
      arc0200Assets: arc200AssetsReducer,
      credentialLock: credentialLockReducer,
      events: eventsReducer,
      layout: layoutReducer,
      messages: messagesReducer,
      networks: networksReducer,
      passkeys: passkeysReducer,
      sessions: sessionsReducer,
      settings: settingsReducer,
      standardAssets: standardAssetsReducer,
      system: systemReducer,
      webauthn: webauthnReducer,
    })
  );

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider initialColorMode={initialColorMode} initialFontFamily={initialFontFamily}>
          <Root i18n={i18n} />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
