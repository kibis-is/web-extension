import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountGroupRepository from '@provider/repositories/AccountGroupRepository';

// types
import type { IAccount, IBaseAsyncThunkConfig, IMainRootState } from '@provider/types';
import AccountRepository from '@provider/repositories/AccountRepository';

const removeGroupByIDThunk: AsyncThunk<
  string | null, // return
  string, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<string | null, string, IBaseAsyncThunkConfig<IMainRootState>>(
  ThunkEnum.RemoveGroupByID,
  async (id, { getState }) => {
    const accounts = getState().accounts.items;
    const logger = getState().system.logger;
    const groups = getState().accounts.groups;
    const group = groups.find((value) => value.id === id) || null;
    let groupAccounts: IAccount[];

    if (!group) {
      logger.debug(`${ThunkEnum.RemoveGroupByID}: group "${id}" does not exist, ignoring`);

      return null;
    }

    groupAccounts = accounts.filter(({ groupID }) => groupID === group.id);

    await new AccountGroupRepository().removeByID(group.id);

    // if there are group accounts, remove the group ids and indexes
    if (groupAccounts.length > 0) {
      await new AccountRepository().saveMany(
        groupAccounts.map((value) => ({
          ...value,
          groupID: null,
          groupIndex: null,
        }))
      );
    }

    logger.debug(`${ThunkEnum.RemoveGroupByID}: removed group "${id}"`);

    return id;
  }
);

export default removeGroupByIDThunk;
