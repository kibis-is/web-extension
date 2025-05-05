import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { ThunkEnum } from '../enums';

// messages
import ProviderRegistrationCompletedMessage from '@common/messages/ProviderRegistrationCompletedMessage';

// types
import type { IBaseAsyncThunkConfig, IRegistrationRootState } from '@provider/types';

const sendRegistrationCompletedThunk: AsyncThunk<
  void, // return
  undefined, // args
  IBaseAsyncThunkConfig<IRegistrationRootState>
> = createAsyncThunk<void, undefined, IBaseAsyncThunkConfig<IRegistrationRootState>>(
  ThunkEnum.SendRegistrationCompleted,
  async () => {
    // send the message
    await browser.runtime.sendMessage(new ProviderRegistrationCompletedMessage());
  }
);

export default sendRegistrationCompletedThunk;
