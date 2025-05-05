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
import AboutSettingsPage from '@provider/pages/AboutSettingsPage';
import AppearanceSettingsPage from '@provider/pages/AppearanceSettingsPage';
import GeneralSettingsPage from '@provider/pages/GeneralSettingsPage';
import PrivacySettingsPage from '@provider/pages/PrivacySettingsPage';
import SettingsIndexPage from '@provider/pages/SettingsIndexPage';
import SessionsSettingsPage from '@provider/pages/SessionsSettingsPage';

// routers
import AdvancedSettingsRouter from '@provider/routers/AdvancedSettingsRouter';
import SecuritySettingsRouter from '@provider/routers/SecuritySettingsRouter';

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
