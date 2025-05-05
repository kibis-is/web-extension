import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import SessionRepository from '@provider/repositories/SessionRepository';

// types
import type { IBackgroundRootState, IBaseAsyncThunkConfig, IMainRootState } from '@provider/types';

const removeByIdFromStorageThunk: AsyncThunk<
  string, // return
  string, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<string, string, IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>>(
  ThunkEnum.RemoveByIdFromStorage,
  async (id, { getState }) => {
    const logger = getState().system.logger;

    await new SessionRepository().removeByIds([id]);

    logger.debug(`${ThunkEnum.RemoveByIdFromStorage}: removed session "${id}" from storage`);

    return id;
  }
);

export default removeByIdFromStorageThunk;
