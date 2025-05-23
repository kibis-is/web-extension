import { combineReducers, type Store } from '@reduxjs/toolkit';
import React, { type FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

// providers
import ThemeProvider from '@provider/containers/ThemeProvider';

// features
import { reducer as accountsReducer } from '@provider/features/accounts';
import { reducer as addAssetsReducer } from '@provider/features/add-assets';
import { reducer as arc0072AssetsReducer } from '@provider/features/arc0072-assets';
import { reducer as arc200AssetsReducer } from '@provider/features/arc0200-assets';
import { reducer as credentialLockReducer } from '@provider/features/credential-lock';
import { reducer as eventsReducer } from '@provider/features/events';
import { reducer as layoutReducer } from '@provider/features/layout';
import { reducer as manageGroupsModalReducer } from '@provider/features/manage-groups-modal';
import { reducer as messagesReducer } from '@provider/features/messages';
import { reducer as moveGroupModalReducer } from '@provider/features/move-group-modal';
import { reducer as networksReducer } from '@provider/features/networks';
import { reducer as notificationsReducer } from '@provider/features/notifications';
import { reducer as passkeysReducer } from '@provider/features/passkeys';
import { reducer as reKeyAccountReducer } from '@provider/features/re-key-account';
import { reducer as removeAssetsReducer } from '@provider/features/remove-assets';
import { reducer as sendAssetsReducer } from '@provider/features/send-assets';
import { reducer as sessionsReducer } from '@provider/features/sessions';
import { reducer as settingsReducer } from '@provider/features/settings';
import { reducer as standardAssetsReducer } from '@provider/features/standard-assets';
import { reducer as systemReducer } from '@provider/features/system';
import { reducer as webauthnReducer } from '@provider/features/webauthn';

// pages
import SplashPage from '@provider/pages/SplashPage';

// types
import type { IAppProps, IMainRootState } from '@provider/types';

// utils
import makeStore from '@provider/utils/makeStore';
import createRouter from './utils/createRouter';

const App: FC<IAppProps> = ({ i18n, initialColorMode, initialFontFamily }) => {
  const store: Store<IMainRootState> = makeStore<IMainRootState>(
    combineReducers({
      accounts: accountsReducer,
      addAssets: addAssetsReducer,
      arc0072Assets: arc0072AssetsReducer,
      arc0200Assets: arc200AssetsReducer,
      credentialLock: credentialLockReducer,
      events: eventsReducer,
      layout: layoutReducer,
      manageGroupsModal: manageGroupsModalReducer,
      messages: messagesReducer,
      moveGroupModal: moveGroupModalReducer,
      networks: networksReducer,
      notifications: notificationsReducer,
      passkeys: passkeysReducer,
      reKeyAccount: reKeyAccountReducer,
      removeAssets: removeAssetsReducer,
      sendAssets: sendAssetsReducer,
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
          <RouterProvider
            fallbackElement={<SplashPage />}
            router={createRouter({
              i18n,
              store,
            })}
          />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
