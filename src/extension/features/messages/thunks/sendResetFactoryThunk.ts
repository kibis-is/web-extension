import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { ThunkEnum } from '../enums';

// messages
import ProviderFactoryResetMessage from '@common/messages/ProviderFactoryResetMessage';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

const sendResetFactoryThunk: AsyncThunk<
  void, // return
  undefined, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<void, undefined, IBaseAsyncThunkConfig<IMainRootState>>(
  ThunkEnum.SendFactoryReset,
  async () => {
    await browser.runtime.sendMessage(new ProviderFactoryResetMessage());
  }
);

export default sendResetFactoryThunk;
