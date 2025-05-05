import React from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';

// constants
import { ADD_ACCOUNT_ROUTE, CREATE_PASSWORD_ROUTE, GET_STARTED_ROUTE } from '@provider/constants';

// containers
import Root from '../../Root';

// pages
import GetStartedPage from '@provider/pages/GetStartedPage';
import CreatePasswordPage from '@provider/pages/CreatePasswordPage';

// routers
import AddAccountRouter from '@provider/routers/AddAccountRegistrationRouter';

// types
import type { IOptions } from './types';

const createRouter = ({ i18n }: IOptions) =>
  createHashRouter([
    {
      children: [
        {
          element: <Navigate replace={true} to={GET_STARTED_ROUTE} />,
          path: '/',
        },
        {
          element: <GetStartedPage />,
          path: GET_STARTED_ROUTE,
        },
        {
          element: <CreatePasswordPage />,
          path: CREATE_PASSWORD_ROUTE,
        },
        {
          element: <AddAccountRouter />,
          path: `${ADD_ACCOUNT_ROUTE}/*`,
        },
      ],
      element: <Root i18n={i18n} />,
      path: '/',
    },
  ]);

export default createRouter;
