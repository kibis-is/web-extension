import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { ACCOUNT_INFORMATION_REFRESH_INTERVAL } from '@provider/constants';

// enums
import { ThunkEnum } from '../enums';

// thunks
import updateAccountsThunk from './updateAccountsThunk';

// types
import type { IBackgroundRootState, IBaseAsyncThunkConfig, IMainRootState } from '@provider/types';

const startPollingForAccountsThunk: AsyncThunk<
  number, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<number, undefined, IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>>(
  ThunkEnum.StartPollingForAccounts,
  (_, { dispatch, getState }) => {
    const logger = getState().system.logger;

    logger.debug(
      `${ThunkEnum.StartPollingForAccounts}: started polling for account information and recent transactions`
    );

    return window.setInterval(() => {
      const activeAccountDetails = getState().accounts.activeAccountDetails;

      if (activeAccountDetails) {
        dispatch(
          updateAccountsThunk({
            accountIDs: [activeAccountDetails.accountId],
            notifyOnNewTransactions: true,
            refreshTransactions: true, // get latest transactions
          })
        );
      }
    }, ACCOUNT_INFORMATION_REFRESH_INTERVAL);
  }
);

export default startPollingForAccountsThunk;
