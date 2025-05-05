import React from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';

// constants
import {
  ACCOUNTS_ROUTE,
  ADD_ACCOUNT_ROUTE,
  ASSETS_ROUTE,
  NFTS_ROUTE,
  SETTINGS_ROUTE,
  TRANSACTIONS_ROUTE,
} from '@provider/constants';

// containers
import Root from '../../Root';

// features
import { setSideBar } from '@provider/features/layout';

// pages
import AssetPage from '@provider/pages/AssetPage';
import NFTPage from '@provider/pages/NFTPage';
import SettingsRouter from '@provider/routers/settings/SettingsRouter';
import TransactionPage from '@provider/pages/TransactionPage';

// routers
import AccountRouter from '@provider/routers/AccountRouter';
import AddAccountRouter from '@provider/routers/AddAccountMainRouter';

// types
import type { IOptions } from './types';

const createRouter = ({ i18n, store }: IOptions) => {
  const { dispatch } = store;

  return createHashRouter([
    {
      children: [
        {
          element: <Navigate replace={true} to={ACCOUNTS_ROUTE} />,
          path: '/',
        },
        {
          element: <AccountRouter />,
          loader: () => {
            dispatch(setSideBar(true));

            return null;
          },
          path: `${ACCOUNTS_ROUTE}/*`,
        },
        {
          element: <AddAccountRouter />,
          loader: () => {
            dispatch(setSideBar(false));

            return null;
          },
          path: `${ADD_ACCOUNT_ROUTE}/*`,
        },
        {
          element: <AssetPage />,
          loader: () => {
            dispatch(setSideBar(true));

            return null;
          },
          path: `${ASSETS_ROUTE}/:assetId`,
        },
        {
          element: <NFTPage />,
          loader: () => {
            dispatch(setSideBar(true));

            return null;
          },
          path: `${NFTS_ROUTE}/:appId/:tokenId`,
        },
        {
          element: <SettingsRouter />,
          loader: () => {
            dispatch(setSideBar(true));

            return null;
          },
          path: `${SETTINGS_ROUTE}/*`,
        },
        {
          element: <TransactionPage />,
          loader: () => {
            dispatch(setSideBar(true));

            return null;
          },
          path: `${TRANSACTIONS_ROUTE}/:transactionId`,
        },
      ],
      element: <Root i18n={i18n} />,
      path: '/',
    },
  ]);
};

export default createRouter;
