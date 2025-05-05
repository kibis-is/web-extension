import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import PasskeyCredentialRepository from '@provider/repositories/PasskeyCredentialRepository';

// types
import type { IBackgroundRootState, IBaseAsyncThunkConfig, IMainRootState, IPasskeyCredential } from '@provider/types';

const fetchFromStorageThunk: AsyncThunk<
  IPasskeyCredential | null, // return
  void, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<IPasskeyCredential | null, void, IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>>(
  ThunkEnum.FetchFromStorage,
  async () => {
    return await new PasskeyCredentialRepository().fetch();
  }
);

export default fetchFromStorageThunk;
