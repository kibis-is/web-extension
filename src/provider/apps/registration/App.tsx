import { combineReducers, type Store } from '@reduxjs/toolkit';
import React, { type FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

// features
import { reducer as arc200AssetsReducer } from '@provider/features/arc0200-assets';
import { reducer as layoutReducer } from '@provider/features/layout';
import { reducer as networksReducer } from '@provider/features/networks';
import { reducer as notificationsReducer } from '@provider/features/notifications';
import { reducer as settingsReducer } from '@provider/features/settings';
import { reducer as registrationReducer } from '@provider/features/registration';
import { reducer as systemReducer } from '@provider/features/system';

// providers
import ThemeProvider from '@provider/components/ThemeProvider';

// types
import type { IAppProps, IRegistrationRootState } from '@provider/types';

// utils
import makeStore from '@provider/utils/makeStore';
import createRouter from './utils/createRouter';

const App: FC<IAppProps> = ({ i18n, initialColorMode, initialFontFamily }) => {
  const store: Store<IRegistrationRootState> = makeStore<IRegistrationRootState>(
    combineReducers({
      arc0200Assets: arc200AssetsReducer,
      layout: layoutReducer,
      networks: networksReducer,
      notifications: notificationsReducer,
      settings: settingsReducer,
      registration: registrationReducer,
      system: systemReducer,
    })
  );

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider initialColorMode={initialColorMode} initialFontFamily={initialFontFamily}>
          <RouterProvider router={createRouter({ i18n })} />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
