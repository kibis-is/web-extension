import React, { type FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// constants
import { PASSKEY_ROUTE } from '@provider/constants';

// pages
import AccountPage from '@provider/pages/AccountPage';
import AccountPasskeyPage from '@provider/pages/AccountPasskeyPage';

const AccountRouter: FC = () => (
  <Routes>
    <Route element={<AccountPage />} path="/" />
    <Route element={<AccountPasskeyPage />} path={`${PASSKEY_ROUTE}/:passkeyID`} />
  </Routes>
);

export default AccountRouter;
