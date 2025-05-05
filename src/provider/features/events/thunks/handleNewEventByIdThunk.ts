import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EventsThunkEnum, EventTypeEnum } from '@provider/enums';

// repositories
import EventQueueRepository from '@provider/repositories/EventQueueRepository';

// types
import type { IBackgroundRootState, IBaseAsyncThunkConfig, IMainRootState, TEvents } from '@provider/types';

const handleNewEventByIdThunk: AsyncThunk<
  TEvents | null, // return
  string, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<TEvents | null, string, IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>>(
  EventsThunkEnum.HandleNewEventById,
  async (eventId, { getState }) => {
    const logger = getState().system.logger;
    const repository = new EventQueueRepository();
    const event = await repository.fetchById(eventId);

    if (!event) {
      logger.debug(`${EventsThunkEnum.HandleNewEventById}: no event found in queue for event "${eventId}", ignoring`);

      return null;
    }

    switch (event.type) {
      case EventTypeEnum.AVMWebProviderRequest:
      case EventTypeEnum.ARC0300KeyRegistrationTransactionSend:
      case EventTypeEnum.WebAuthnAuthenticateRequest:
      case EventTypeEnum.WebAuthnRegisterRequest:
        return event;
      default:
        logger.debug(`${EventsThunkEnum.HandleNewEventById}: unknown event "${JSON.stringify(event)}", removing`);

        await repository.removeById(eventId);

        return null;
    }
  }
);

export default handleNewEventByIdThunk;
