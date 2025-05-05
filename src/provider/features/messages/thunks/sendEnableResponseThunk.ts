import {
  ARC0027MethodEnum,
  type IAccount as IAVMWebProvideAccount,
  type IEnableResult,
} from '@agoralabs-sh/avm-web-provider';
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
import type { IAccount, IBaseAsyncThunkConfig, IMainRootState } from '@provider/types';
import type { IEnableResponseThunkPayload } from '../types';

// utils
import convertPublicKeyToAVMAddress from '@common/utils/convertPublicKeyToAVMAddress';

const sendEnableResponseThunk: AsyncThunk<
  void, // return
  IEnableResponseThunkPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<void, IEnableResponseThunkPayload, IBaseAsyncThunkConfig<IMainRootState>>(
  ThunkEnum.SendEnableResponse,
  async ({ error, event, session }, { dispatch, getState }) => {
    const accounts = getState().accounts.items;
    const logger = getState().system.logger;

    logger.debug(
      `${ThunkEnum.SendEnableResponse}: sending "${ARC0027MethodEnum.Enable}" message to the content script`
    );

    // send the error the webpage (via the content script)
    if (error) {
      await browser.tabs.sendMessage(
        event.payload.originTabID,
        new AVMWebProviderResponseMessage<IEnableResult>({
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

    // if there is a session, send it back to the webpage (via the content script)
    if (session) {
      await browser.tabs.sendMessage(
        event.payload.originTabID,
        new AVMWebProviderResponseMessage<IEnableResult>({
          error: null,
          id: generateUUID(),
          method: event.payload.message.payload.method,
          reference: AVMWebProviderMessageReferenceEnum.Response,
          requestID: event.payload.message.id,
          result: {
            accounts: session.authorizedAddresses.map<IAVMWebProvideAccount>((address) => {
              const account: IAccount | null =
                accounts.find((value) => convertPublicKeyToAVMAddress(value.publicKey) === address) || null;

              return {
                address,
                ...(account?.name && {
                  name: account.name,
                }),
              };
            }),
            genesisHash: session.genesisHash,
            genesisId: session.genesisId,
            providerId: __PROVIDER_ID__,
            sessionId: session.id,
          },
        })
      );
    }

    // remove the event
    dispatch(removeEventByIdThunk(event.id));
  }
);

export default sendEnableResponseThunk;
