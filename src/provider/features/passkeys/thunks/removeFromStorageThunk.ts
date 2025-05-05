import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import PasskeyCredentialRepository from '@provider/repositories/PasskeyCredentialRepository';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@provider/types';

const removeFromStorageThunk: AsyncThunk<
  void, // return
  void, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<void, void, IBaseAsyncThunkConfig<IMainRootState>>(ThunkEnum.RemoveFromStorage, async () => {
  return await new PasskeyCredentialRepository().remove();
});

export default removeFromStorageThunk;
