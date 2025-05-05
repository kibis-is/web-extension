import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import PasskeyCredentialRepository from '@provider/repositories/PasskeyCredentialRepository';

// types
import type { IBaseAsyncThunkConfig, IMainRootState, IPasskeyCredential } from '@provider/types';

const saveToStorageThunk: AsyncThunk<
  IPasskeyCredential, // return
  IPasskeyCredential, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<IPasskeyCredential, IPasskeyCredential, IBaseAsyncThunkConfig<IMainRootState>>(
  ThunkEnum.SaveToStorage,
  async (credential) => {
    return await new PasskeyCredentialRepository().save(credential);
  }
);

export default saveToStorageThunk;
