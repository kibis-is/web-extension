import { ARC0027MethodEnum, type ISignTransactionsResult } from '@agoralabs-sh/avm-web-provider';
import { generate as generateUUID } from '@agoralabs-sh/uuid';
import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { AVMWebProviderMessageReferenceEnum } from '@common/enums';
import { ThunkEnum } from '../enums';

// features
import { removeEventByIdThunk } from '@provider/features/events';

// messages
import AVMWebProviderResponseMessage from '@common/messages/AVMWebProviderResponseMessage';

// types
import type { IBackgroundRootState, IBaseAsyncThunkConfig, IMainRootState } from '@provider/types';
import type { ISignTransactionsResponseThunkPayload } from '../types';

const sendSignTransactionsResponseThunk: AsyncThunk<
  void, // return
  ISignTransactionsResponseThunkPayload, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  void,
  ISignTransactionsResponseThunkPayload,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(ThunkEnum.SendSignTransactionsResponse, async ({ error, event, stxns }, { dispatch, getState }) => {
  const logger = getState().system.logger;

  logger.debug(
    `${ThunkEnum.SendSignTransactionsResponse}: sending "${ARC0027MethodEnum.SignTransactions}" message to content script`
  );

  // send the error the webpage (via the content script)
  if (error) {
    await browser.tabs.sendMessage(
      event.payload.originTabID,
      new AVMWebProviderResponseMessage<ISignTransactionsResult>({
        error,
        id: generateUUID(),
        method: event.payload.message.payload.method,
        reference: AVMWebProviderMessageReferenceEnum.Response,
        requestID: event.payload.message.id,
        result: null,
      })
    );

    // remove the event
    dispatch(removeEventByIdThunk(event.id));

    return;
  }

  // if there is signed transactions, send them back to the webpage (via the content script)
  if (stxns) {
    await browser.tabs.sendMessage(
      event.payload.originTabID,
      new AVMWebProviderResponseMessage<ISignTransactionsResult>({
        error: null,
        id: generateUUID(),
        method: event.payload.message.payload.method,
        reference: AVMWebProviderMessageReferenceEnum.Response,
        requestID: event.payload.message.id,
        result: {
          providerId: __PROVIDER_ID__,
          stxns,
        },
      })
    );
  }

  // remove the event
  dispatch(removeEventByIdThunk(event.id));
});

export default sendSignTransactionsResponseThunk;
