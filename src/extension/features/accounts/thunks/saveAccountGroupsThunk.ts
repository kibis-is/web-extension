import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountGroupRepository from '@extension/repositories/AccountGroupRepository';

// types
import type {
  IAccountGroup,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';

const saveAccountGroupsThunk: AsyncThunk<
  IAccountGroup[], // return
  IAccountGroup[], // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IAccountGroup[],
  IAccountGroup[],
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.SaveAccountGroups, async (groups, { getState }) => {
  const logger = getState().system.logger;
  const _groups = await new AccountGroupRepository().saveMany(groups);

  logger.debug(
    `${ThunkEnum.SaveAccountGroups}: saved groups [${_groups
      .map(({ id }) => `"${id}"`)
      .join(',')}] to storage`
  );

  return _groups;
});

export default saveAccountGroupsThunk;
