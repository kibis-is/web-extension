import React, { type FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// constants
import { CUSTOM_NODES_ROUTE } from '@provider/constants';

// pages
import AdvancedSettingsPage from '@provider/pages/AdvancedSettingsPage';
import CustomNodesPage from '@provider/pages/CustomNodesPage';

const AdvancedSettingsRouter: FC = () => (
  <Routes>
    <Route element={<AdvancedSettingsPage />} path="/" />
    <Route element={<CustomNodesPage />} path={CUSTOM_NODES_ROUTE} />
  </Routes>
);

export default AdvancedSettingsRouter;
