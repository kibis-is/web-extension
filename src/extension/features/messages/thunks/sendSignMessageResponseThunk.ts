import {
  ARC0027MethodEnum,
  ISignMessageResult,
} from '@agoralabs-sh/avm-web-provider';
import { generate as generateUUID } from '@agoralabs-sh/uuid';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { AVMWebProviderMessageReferenceEnum } from '@common/enums';
import { ThunkEnum } from '../enums';

// messages
import AVMWebProviderResponseMessage from '@common/messages/AVMWebProviderResponseMessage';

// types
import type {
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type { ISignMessageResponseThunkPayload } from '../types';

const sendSignMessageResponseThunk: AsyncThunk<
  void, // return
  ISignMessageResponseThunkPayload, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  void,
  ISignMessageResponseThunkPayload,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(
  ThunkEnum.SendSignMessageResponse,
  async ({ error, event, signature, signer }, { getState }) => {
    const logger = getState().system.logger;

    logger.debug(
      `${ThunkEnum.SendSignMessageResponse}: sending "${ARC0027MethodEnum.SignMessage}" message to content script`
    );

    // send the error the webpage (via the content script)
    if (error) {
      await browser.tabs.sendMessage(
        event.payload.originTabID,
        new AVMWebProviderResponseMessage<ISignMessageResult>({
          error,
          id: generateUUID(),
          method: event.payload.message.payload.method,
          reference: AVMWebProviderMessageReferenceEnum.Response,
          requestID: event.payload.message.id,
          result: null,
        })
      );

      return;
    }

    // if there is a signature, send it back to the webpage (via the content script)
    if (signature && signer) {
      await browser.tabs.sendMessage(
        event.payload.originTabID,
        new AVMWebProviderResponseMessage<ISignMessageResult>({
          error: null,
          id: generateUUID(),
          method: event.payload.message.payload.method,
          reference: AVMWebProviderMessageReferenceEnum.Response,
          requestID: event.payload.message.id,
          result: {
            providerId: __PROVIDER_ID__,
            signature,
            signer,
          },
        })
      );
    }
  }
);

export default sendSignMessageResponseThunk;
