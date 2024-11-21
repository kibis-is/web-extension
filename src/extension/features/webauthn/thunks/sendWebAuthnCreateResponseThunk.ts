import {
  ARC0027MethodEnum,
  IAccount as IAVMWebProvideAccount,
  IEnableResult,
} from '@agoralabs-sh/avm-web-provider';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import browser from 'webextension-polyfill';

// enums
import { ThunkEnum } from '../enums';

// errors
import { UnknownError } from '@extension/errors';

// features
import { removeEventByIdThunk } from '@extension/features/events';

// messages
import { WebAuthnCreateResponseMessage } from '@common/messages';

// types
import type {
  IAccount,
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type { IWebAuthnCreateResponseThunkPayload } from '../types';

const sendWebAuthnCreateResponseThunk: AsyncThunk<
  void, // return
  IWebAuthnCreateResponseThunkPayload, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  void,
  IWebAuthnCreateResponseThunkPayload,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(
  ThunkEnum.SendWebAuthnCreateResponse,
  async ({ accountID, error, event }, { dispatch, getState }) => {
    const accounts = getState().accounts.items;
    const id = uuid();
    const logger = getState().system.logger;
    let account: IAccount | null;

    // send the error the webpage (via the content script)
    if (error) {
      await browser.tabs.sendMessage(
        event.payload.originTabId,
        new WebAuthnCreateResponseMessage({
          error,
          id,
          requestID: event.payload.message.id,
          result: null,
        })
      );

      // remove the event
      dispatch(removeEventByIdThunk(event.id));

      return;
    }

    account = accounts.find((account) => account.id === accountID) || null;

    if (!account) {
      logger.debug(
        `${ThunkEnum.SendWebAuthnCreateResponse}: account "${accountID}" not found`
      );

      await browser.tabs.sendMessage(
        event.payload.originTabId,
        new WebAuthnCreateResponseMessage({
          error: new UnknownError('no account found'),
          id,
          requestID: event.payload.message.id,
          result: null,
        })
      );

      return;
    }

    logger.debug(
      `${ThunkEnum.SendWebAuthnCreateResponse}: sending "${ARC0027MethodEnum.Enable}" message to the content script`
    );

    // return public credentials
    await browser.tabs.sendMessage(
      event.payload.originTabId,
      new WebAuthnCreateResponseMessage({
        error: null,
        id,
        requestID: event.payload.message.id,
        result: null,
      })
    );
  }
);

export default sendWebAuthnCreateResponseThunk;
