import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { ThunkEnum } from '../enums';

// messages
import ProviderThemeUpdatedMessage from '@common/messages/ProviderThemeUpdatedMessage';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

const sendThemeUpdatedMessageThunk: AsyncThunk<
  void, // return
  undefined, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<void, undefined, IBaseAsyncThunkConfig<IMainRootState>>(
  ThunkEnum.SendThemeUpdatedMessage,
  async (_, { getState }) => {
    const { font, theme: colorMode } = getState().settings.appearance;

    // send the message
    await browser.runtime.sendMessage(
      new ProviderThemeUpdatedMessage({
        colorMode,
        font,
      })
    );
  }
);

export default sendThemeUpdatedMessageThunk;
