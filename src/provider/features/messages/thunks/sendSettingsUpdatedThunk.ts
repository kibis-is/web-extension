import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { ThunkEnum } from '../enums';

// messages
import ProviderSettingsUpdatedMessage from '@common/messages/ProviderSettingsUpdatedMessage';

// types
import type { IBackgroundRootState, IBaseAsyncThunkConfig, IMainRootState } from '@provider/types';

const sendSettingsUpdatedThunk: AsyncThunk<
  void, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<void, undefined, IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>>(
  ThunkEnum.SendSettingsUpdated,
  async () => {
    // send the message
    await browser.runtime.sendMessage(new ProviderSettingsUpdatedMessage());
  }
);

export default sendSettingsUpdatedThunk;
