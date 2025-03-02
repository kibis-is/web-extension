import React, { type FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// constants
import { PASSKEY_ROUTE } from '@extension/constants';

// pages
import AccountPage from '@extension/pages/AccountPage';
import AccountPasskeyPage from '@extension/pages/AccountPasskeyPage';

const AccountRouter: FC = () => (
  <Routes>
    <Route element={<AccountPage />} path="/" />
    <Route
      element={<AccountPasskeyPage />}
      path={`${PASSKEY_ROUTE}/:passkeyID`}
    />
  </Routes>
);

export default AccountRouter;
