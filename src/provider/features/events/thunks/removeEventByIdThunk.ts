import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EventsThunkEnum } from '@provider/enums';

// repositories
import EventQueueRepository from '@provider/repositories/EventQueueRepository';

// types
import type { IBackgroundRootState, IBaseAsyncThunkConfig, IMainRootState } from '@provider/types';

const removeEventByIdThunk: AsyncThunk<
  string, // return
  string, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<string, string, IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>>(
  EventsThunkEnum.RemoveEventById,
  async (eventId, { getState }) => {
    const logger = getState().system.logger;

    await new EventQueueRepository().removeById(eventId);

    logger.debug(`${EventsThunkEnum.RemoveEventById}: removed event "${eventId}"`);

    return eventId;
  }
);

export default removeEventByIdThunk;
