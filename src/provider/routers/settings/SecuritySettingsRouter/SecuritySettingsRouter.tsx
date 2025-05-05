import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// constants
import {
  CHANGE_PASSWORD_ROUTE,
  EXPORT_ACCOUNT_ROUTE,
  PASSKEY_ROUTE,
  VIEW_SEED_PHRASE_ROUTE,
} from '@provider/constants';

// pages
import ChangePasswordPage from '@provider/pages/ChangePasswordPage';
import ExportAccountPage from '@provider/pages/ExportAccountPage';
import PasskeyPage from '@provider/pages/PasskeyPage';
import SecuritySettingsPage from '@provider/pages/SecuritySettingsPage';
import ViewSeedPhrasePage from '@provider/pages/ViewSeedPhrasePage';

const SecuritySettingsRouter: FC = () => (
  <Routes>
    <Route element={<SecuritySettingsPage />} path="/" />
    <Route element={<ChangePasswordPage />} path={CHANGE_PASSWORD_ROUTE} />
    <Route element={<PasskeyPage />} path={PASSKEY_ROUTE} />
    <Route element={<ExportAccountPage />} path={EXPORT_ACCOUNT_ROUTE} />
    <Route element={<ViewSeedPhrasePage />} path={VIEW_SEED_PHRASE_ROUTE} />
  </Routes>
);

export default SecuritySettingsRouter;
