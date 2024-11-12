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

const saveAccountGroupThunk: AsyncThunk<
  IAccountGroup, // return
  string, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IAccountGroup,
  string,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.SaveAccountGroup, async (name) => {
  return await new AccountGroupRepository().save(
    AccountGroupRepository.initializeDefaultAccountGroup(name)
  );
});

export default saveAccountGroupThunk;
