import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import SessionRepository from '@provider/repositories/SessionRepository';

// types
import type { IBackgroundRootState, IBaseAsyncThunkConfig, IMainRootState } from '@provider/types';

const removeAllFromStorageThunk: AsyncThunk<
  void, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<void, undefined, IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>>(
  ThunkEnum.RemoveAllFromStorage,
  async (_, { getState }) => {
    const logger = getState().system.logger;

    await new SessionRepository().removeAll();

    logger.debug(`${ThunkEnum.RemoveAllFromStorage}: cleared all sessions from storage`);
  }
);

export default removeAllFromStorageThunk;
