import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountRepository from '@provider/repositories/AccountRepository';
import ActiveAccountRepositoryService from '@provider/repositories/ActiveAccountRepository';

// types
import type { IAccount, IBackgroundRootState, IBaseAsyncThunkConfig, IMainRootState } from '@provider/types';
import type { IFetchAccountsFromStorageResult } from '../types';

// utils
import isWatchAccount from '@provider/utils/isWatchAccount';
import AccountGroupRepository from '@provider/repositories/AccountGroupRepository';

const fetchAccountsFromStorageThunk: AsyncThunk<
  IFetchAccountsFromStorageResult, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  IFetchAccountsFromStorageResult,
  undefined,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(ThunkEnum.FetchAccountsFromStorage, async (_, { getState }) => {
  const logger = getState().system.logger;
  let accounts: IAccount[];

  logger.debug(`${ThunkEnum.FetchAccountsFromStorage}: fetching accounts from storage`);

  accounts = await new AccountRepository().fetchAll();

  return {
    accounts: await Promise.all(
      accounts.map(async (value) => ({
        ...value,
        watchAccount: await isWatchAccount(value),
      }))
    ),
    activeAccountDetails: await new ActiveAccountRepositoryService().fetch(),
    groups: await new AccountGroupRepository().fetchAll(),
  };
});

export default fetchAccountsFromStorageThunk;
