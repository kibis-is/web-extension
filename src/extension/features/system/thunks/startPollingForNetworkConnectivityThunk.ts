import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NETWORK_CONNECTIVITY_CHECK_INTERVAL } from '@extension/constants';

// enums
import { ThunkEnum } from '../enums';

// thunks
import updateNetworkConnectivityThunk from './updateNetworkConnectivityThunk';

// types
import type { IBaseAsyncThunkConfig } from '@extension/types';

const startPollingForNetworkConnectivityThunk: AsyncThunk<
  number, // return
  undefined, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<number, undefined, IBaseAsyncThunkConfig>(
  ThunkEnum.StartPollingForNetworkConnectivity,
  (_, { dispatch, getState }) => {
    const logger = getState().system.logger;

    logger.debug(
      `${ThunkEnum.StartPollingForNetworkConnectivity}: started polling for network connectivity`
    );

    return window.setInterval(
      () => dispatch(updateNetworkConnectivityThunk()),
      NETWORK_CONNECTIVITY_CHECK_INTERVAL
    );
  }
);

export default startPollingForNetworkConnectivityThunk;
