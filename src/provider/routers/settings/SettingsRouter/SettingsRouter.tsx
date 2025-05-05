import React, { type FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// constants
import {
  ABOUT_ROUTE,
  ADVANCED_ROUTE,
  APPEARANCE_ROUTE,
  GENERAL_ROUTE,
  PRIVACY_ROUTE,
  SECURITY_ROUTE,
  SESSIONS_ROUTE,
} from '@provider/constants';

// pages
import AboutSettingsPage from '@provider/pages/settings/AboutSettingsPage';
import AppearanceSettingsPage from '@provider/pages/settings/AppearanceSettingsPage';
import GeneralSettingsPage from '@provider/pages/settings/GeneralSettingsPage';
import PrivacySettingsPage from '@provider/pages/settings/PrivacySettingsPage';
import SettingsIndexPage from '@provider/pages/settings/SettingsIndexPage';
import SessionsSettingsPage from '@provider/pages/settings/SessionsSettingsPage';

// routers
import AdvancedSettingsRouter from '@provider/routers/settings/AdvancedSettingsRouter';
import SecuritySettingsRouter from '@provider/routers/settings/SecuritySettingsRouter';

const SettingsRouter: FC = () => (
  <Routes>
    <Route element={<SettingsIndexPage />} path="/" />
    <Route element={<GeneralSettingsPage />} path={GENERAL_ROUTE} />
    <Route element={<SecuritySettingsRouter />} path={`${SECURITY_ROUTE}/*`} />
    <Route element={<PrivacySettingsPage />} path={PRIVACY_ROUTE} />
    <Route element={<AppearanceSettingsPage />} path={APPEARANCE_ROUTE} />
    <Route element={<SessionsSettingsPage />} path={SESSIONS_ROUTE} />
    <Route element={<AdvancedSettingsRouter />} path={`${ADVANCED_ROUTE}/*`} />
    <Route element={<AboutSettingsPage />} path={ABOUT_ROUTE} />
  </Routes>
);

export default SettingsRouter;
